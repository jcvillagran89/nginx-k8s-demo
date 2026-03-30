<?php

namespace App\Http\Controllers;

use App\Http\Services\MicrosoftGraphService;
use App\Http\Services\TestImportService;
use App\Jobs\ImportStylesFromLayout;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HealthcheckController extends Controller
{
    public function index(Request $request, MicrosoftGraphService $graph)
    {
        return Inertia::render('admin/healthchecks/index', [
            'healthchecks' => $this->getHealthchecks($graph),
            'commands' => $this->commandDefinitions(),
            'jobs' => $this->jobDefinitions(),
            'canRun' => $this->canRun($request),
        ]);
    }

    public function status(MicrosoftGraphService $graph)
    {
        return response()->json($this->getHealthchecks($graph));
    }

    public function runCommand(Request $request)
    {
        $this->authorizeRun($request);

        $validated = $request->validate([
            'command' => ['required', 'string'],
            'parameters' => ['nullable', 'array'],
        ]);

        $registry = $this->commandRegistry();
        $command = $validated['command'];

        if (! isset($registry[$command])) {
            return response()->json([
                'ok' => false,
                'message' => 'Comando no permitido.',
            ], 422);
        }

        [$params, $errors] = $this->sanitizeParameters($validated['parameters'] ?? [], $registry[$command]);
        if ($errors) {
            return response()->json([
                'ok' => false,
                'message' => 'Parametros invalidos.',
                'errors' => $errors,
            ], 422);
        }

        if ($command === 'sync:tables' && ! isset($params['table']) && empty($params['--all'])) {
            return response()->json([
                'ok' => false,
                'message' => 'Debes indicar una tabla o usar la opcion --all.',
            ], 422);
        }

        $start = microtime(true);
        $exitCode = Artisan::call($command, $params);
        $output = trim(Artisan::output());

        return response()->json([
            'ok' => $exitCode === 0,
            'command' => $command,
            'parameters' => $params,
            'exit_code' => $exitCode,
            'duration_ms' => (int) round((microtime(true) - $start) * 1000),
            'output' => $output,
            'ran_at' => now()->toIso8601String(),
        ]);
    }

    public function runImportLayoutJob(Request $request, TestImportService $service)
    {
        $this->authorizeRun($request);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        $storedPath = $service->storeUpload($validated['file']);

        ImportStylesFromLayout::dispatch(
            $storedPath,
            (int) $request->user()->id,
            $validated['file']->getClientOriginalName()
        );

        return response()->json([
            'ok' => true,
            'message' => 'Archivo en cola para procesar.',
            'stored_path' => $storedPath,
            'ran_at' => now()->toIso8601String(),
        ]);
    }

    private function getHealthchecks(MicrosoftGraphService $graph): array
    {
        $checkedAt = now()->toIso8601String();

        return [
            'checked_at' => $checkedAt,
            'items' => [
                $this->checkApp($checkedAt),
                $this->checkScheduler($checkedAt),
                $this->checkQueue($checkedAt),
                $this->checkDatabase('mysql', 'MariaDB', 'select 1', $checkedAt),
                $this->checkOracle($checkedAt),
                $this->checkRedis($checkedAt),
                $this->checkSharepoint($graph, $checkedAt),
            ],
        ];
    }

    private function checkApp(string $checkedAt): array
    {
        return [
            'key' => 'app',
            'label' => 'Aplicacion',
            'status' => 'ok',
            'message' => 'Aplicacion en linea.',
            'latency_ms' => 0,
            'checked_at' => $checkedAt,
            'details' => [
                ['label' => 'Entorno', 'value' => config('app.env')],
                ['label' => 'Debug', 'value' => config('app.debug') ? 'Si' : 'No'],
                ['label' => 'Commit', 'value' => $this->getCommitHash() ?? 'N/D'],
                ['label' => 'Uptime', 'value' => $this->getAppUptime()],
            ],
        ];
    }

    private function checkScheduler(string $checkedAt): array
    {
        $start = microtime(true);
        $lastRun = cache()->get('healthchecks_schedule_last_run_at');

        if (! $lastRun) {
            return [
                'key' => 'scheduler',
                'label' => 'Scheduler',
                'status' => 'warn',
                'message' => 'Sin latido reciente.',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'checked_at' => $checkedAt,
                'details' => [
                    ['label' => 'Ultimo run', 'value' => 'N/D'],
                    ['label' => 'Esperado', 'value' => 'Cada minuto'],
                ],
            ];
        }

        $last = $this->parseDate($lastRun);
        $minutes = $last ? now()->diffInMinutes($last) : null;
        $status = 'ok';
        $message = 'Scheduler activo.';

        if ($minutes === null) {
            $status = 'warn';
            $message = 'Ultimo run invalido.';
        } elseif ($minutes > 10) {
            $status = 'fail';
            $message = 'Sin ejecuciones recientes.';
        } elseif ($minutes > 2) {
            $status = 'warn';
            $message = 'Run con retraso.';
        }

        return [
            'key' => 'scheduler',
            'label' => 'Scheduler',
            'status' => $status,
            'message' => $message,
            'latency_ms' => (int) round((microtime(true) - $start) * 1000),
            'checked_at' => $checkedAt,
            'details' => [
                ['label' => 'Ultimo run', 'value' => $last ? $last->toIso8601String() : 'N/D'],
                ['label' => 'Minutos desde', 'value' => $minutes !== null ? (string) $minutes : 'N/D'],
                ['label' => 'Esperado', 'value' => 'Cada minuto'],
            ],
        ];
    }

    private function checkQueue(string $checkedAt): array
    {
        $start = microtime(true);
        $driver = (string) config('queue.default', 'sync');
        $queueName = (string) config("queue.connections.{$driver}.queue", 'default');

        if ($driver === 'sync') {
            return [
                'key' => 'queue',
                'label' => 'Queue',
                'status' => 'warn',
                'message' => 'Driver sync activo.',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'checked_at' => $checkedAt,
                'details' => [
                    ['label' => 'Driver', 'value' => $driver],
                    ['label' => 'Queue', 'value' => $queueName],
                ],
            ];
        }

        try {
            $pending = Queue::connection($driver)->size($queueName);
            $failed = null;

            if (Schema::hasTable('failed_jobs')) {
                $failed = DB::table('failed_jobs')->count();
            }

            return [
                'key' => 'queue',
                'label' => 'Queue',
                'status' => 'ok',
                'message' => 'Conexion OK.',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'checked_at' => $checkedAt,
                'details' => [
                    ['label' => 'Driver', 'value' => $driver],
                    ['label' => 'Queue', 'value' => $queueName],
                    ['label' => 'Pendientes', 'value' => $pending !== null ? (string) $pending : 'N/D'],
                    ['label' => 'Failed', 'value' => $failed !== null ? (string) $failed : 'N/D'],
                ],
            ];
        } catch (\Throwable $e) {
            return $this->buildCheck(
                'queue',
                'Queue',
                'fail',
                $this->shortMessage($e),
                $checkedAt,
                $start
            );
        }
    }

    private function checkDatabase(string $connection, string $label, string $query, string $checkedAt): array
    {
        $start = microtime(true);

        try {
            DB::connection($connection)->select($query);

            return $this->buildCheck(
                'db',
                $label,
                'ok',
                'Conectado.',
                $checkedAt,
                $start
            );
        } catch (\Throwable $e) {
            return $this->buildCheck(
                'db',
                $label,
                'fail',
                $this->shortMessage($e),
                $checkedAt,
                $start
            );
        }
    }

    private function checkOracle(string $checkedAt): array
    {
        $start = microtime(true);

        try {
            DB::connection('oracle')->select('select 1 from dual');

            return $this->buildCheck(
                'oracle',
                'Oracle',
                'ok',
                'Conectado.',
                $checkedAt,
                $start
            );
        } catch (\Throwable $e) {
            return $this->buildCheck(
                'oracle',
                'Oracle',
                'fail',
                $this->shortMessage($e),
                $checkedAt,
                $start
            );
        }
    }

    private function checkRedis(string $checkedAt): array
    {
        $start = microtime(true);

        try {
            $pong = Redis::connection()->ping();
            $message = is_string($pong) ? $pong : 'PONG';

            return $this->buildCheck(
                'redis',
                'Redis',
                'ok',
                "Respuesta: {$message}",
                $checkedAt,
                $start
            );
        } catch (\Throwable $e) {
            return $this->buildCheck(
                'redis',
                'Redis',
                'fail',
                $this->shortMessage($e),
                $checkedAt,
                $start
            );
        }
    }

    private function checkSharepoint(MicrosoftGraphService $graph, string $checkedAt): array
    {
        $start = microtime(true);
        $missing = $this->missingMicrosoftConfig();

        if (! empty($missing)) {
            return [
                'key' => 'sharepoint',
                'label' => 'SharePoint',
                'status' => 'warn',
                'message' => 'Configuracion incompleta.',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'checked_at' => $checkedAt,
                'details' => [
                    ['label' => 'Faltantes', 'value' => implode(', ', $missing)],
                ],
            ];
        }

        try {
            $shareLink = (string) config('services.microsoft.share_link');
            $item = $graph->getDriveItemFromShareLink($shareLink);

            return [
                'key' => 'sharepoint',
                'label' => 'SharePoint',
                'status' => 'ok',
                'message' => 'Acceso confirmado.',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'checked_at' => $checkedAt,
                'details' => [
                    ['label' => 'Archivo', 'value' => $item['name'] ?? 'Sin nombre'],
                    ['label' => 'Tamano', 'value' => isset($item['size']) ? number_format((int) $item['size']) . ' bytes' : 'N/D'],
                    ['label' => 'Actualizado', 'value' => $item['lastModifiedDateTime'] ?? 'N/D'],
                ],
            ];
        } catch (\Throwable $e) {
            return $this->buildCheck(
                'sharepoint',
                'SharePoint',
                'fail',
                $this->shortMessage($e),
                $checkedAt,
                $start
            );
        }
    }

    private function buildCheck(
        string $key,
        string $label,
        string $status,
        string $message,
        string $checkedAt,
        float $start
    ): array {
        return [
            'key' => $key,
            'label' => $label,
            'status' => $status,
            'message' => $message,
            'latency_ms' => (int) round((microtime(true) - $start) * 1000),
            'checked_at' => $checkedAt,
        ];
    }

    private function shortMessage(\Throwable $e): string
    {
        $message = trim($e->getMessage());
        if ($message === '') {
            $message = 'Error desconocido.';
        }

        return Str::limit($message, 180);
    }

    private function missingMicrosoftConfig(): array
    {
        $required = [
            'tenant_id' => 'MICROSOFT_TENANT_ID',
            'client_id' => 'MICROSOFT_CLIENT_ID',
            'client_secret' => 'MICROSOFT_CLIENT_SECRET',
            'refresh_token' => 'MICROSOFT_REFRESH_TOKEN',
            'share_link' => 'MICROSOFT_SHARE_LINK',
        ];

        $missing = [];

        foreach ($required as $key => $label) {
            if (! config("services.microsoft.{$key}")) {
                $missing[] = $label;
            }
        }

        return $missing;
    }

    private function commandDefinitions(): array
    {
        $definitions = [];

        foreach ($this->commandRegistry() as $signature => $definition) {
            $definitions[] = [
                'signature' => $signature,
                'key' => $definition['key'],
                'label' => $definition['label'],
                'description' => $definition['description'],
                'danger' => $definition['danger'] ?? false,
                'fields' => $definition['fields'] ?? [],
            ];
        }

        return $definitions;
    }

    private function jobDefinitions(): array
    {
        return [
            [
                'key' => 'import-layout',
                'label' => 'Importar layout (job)',
                'description' => 'Sube un XLSX para procesarlo en cola.',
                'endpoint' => 'admin.healthchecks.jobs.import-layout',
                'fields' => [
                    [
                        'key' => 'file',
                        'label' => 'Archivo XLSX',
                        'type' => 'file',
                        'accept' => '.xlsx,.xls',
                    ],
                ],
            ],
        ];
    }

    private function commandRegistry(): array
    {
        return [
            'inspire' => [
                'key' => 'inspire',
                'label' => 'Inspire',
                'description' => 'Muestra una cita inspiradora.',
                'danger' => false,
                'fields' => [],
                'allowed' => [],
            ],
            'sharepoint:import-styles' => [
                'key' => 'sharepoint-import',
                'label' => 'Importar estilos desde SharePoint',
                'description' => 'Lee el Excel en SharePoint y actualiza estilos.',
                'danger' => false,
                'fields' => [],
                'allowed' => [],
            ],
            'sync:tables' => [
                'key' => 'sync-tables',
                'label' => 'Sincronizar tablas (MariaDB -> Oracle)',
                'description' => 'Ejecuta sincronizaciones de DbSync.',
                'danger' => false,
                'fields' => [
                    [
                        'key' => 'table',
                        'label' => 'Tabla',
                        'type' => 'text',
                        'placeholder' => 'styles',
                    ],
                    [
                        'key' => '--all',
                        'label' => 'Todas',
                        'type' => 'checkbox',
                    ],
                    [
                        'key' => '--from-id',
                        'label' => 'Desde ID',
                        'type' => 'number',
                    ],
                    [
                        'key' => '--limit',
                        'label' => 'Limite',
                        'type' => 'number',
                    ],
                    [
                        'key' => '--chunk',
                        'label' => 'Chunk',
                        'type' => 'number',
                        'default' => 1000,
                    ],
                    [
                        'key' => '--dry-run',
                        'label' => 'Dry Run',
                        'type' => 'checkbox',
                    ],
                ],
                'allowed' => [
                    'table' => 'string',
                    '--all' => 'bool',
                    '--from-id' => 'int',
                    '--limit' => 'int',
                    '--chunk' => 'int',
                    '--dry-run' => 'bool',
                ],
            ],
            'prune:test-results' => [
                'key' => 'prune-tests',
                'label' => 'Prune test results',
                'description' => 'Elimina campos en resultados segun el catalogo actual.',
                'danger' => true,
                'fields' => [
                    [
                        'key' => '--tests',
                        'label' => 'Tests',
                        'type' => 'text',
                        'placeholder' => 'aatcc135,aatcc150,astm3776',
                    ],
                    [
                        'key' => '--dry-run',
                        'label' => 'Dry Run',
                        'type' => 'checkbox',
                    ],
                ],
                'allowed' => [
                    '--tests' => 'string',
                    '--dry-run' => 'bool',
                ],
            ],
            'backfill:test-results' => [
                'key' => 'backfill-tests',
                'label' => 'Backfill test results',
                'description' => 'Agrega campos faltantes y elimina campos obsoletos segun el catalogo actual.',
                'danger' => true,
                'fields' => [
                    [
                        'key' => '--tests',
                        'label' => 'Tests',
                        'type' => 'text',
                        'placeholder' => 'aatcc135,aatcc150,astm3776',
                    ],
                    [
                        'key' => '--dry-run',
                        'label' => 'Dry Run',
                        'type' => 'checkbox',
                    ],
                ],
                'allowed' => [
                    '--tests' => 'string',
                    '--dry-run' => 'bool',
                ],
            ],
            'oracle:reset-tests' => [
                'key' => 'oracle-reset',
                'label' => 'Reset de pruebas (Oracle)',
                'description' => 'Trunca tablas TEST_* y reinicia secuencias.',
                'danger' => true,
                'fields' => [],
                'allowed' => [],
            ],
        ];
    }

    private function sanitizeParameters(array $params, array $definition): array
    {
        $allowed = $definition['allowed'] ?? [];
        $output = [];
        $errors = [];

        foreach ($params as $key => $value) {
            if (! array_key_exists($key, $allowed)) {
                $errors[$key] = 'Parametro no permitido.';
                continue;
            }

            $type = $allowed[$key];

            if (is_string($value)) {
                $value = trim($value);
            }

            if ($value === '' || $value === null) {
                continue;
            }

            if ($type === 'bool') {
                $output[$key] = (bool) $value;
                continue;
            }

            if ($type === 'int') {
                if (! is_numeric($value)) {
                    $errors[$key] = 'Debe ser numerico.';
                    continue;
                }
                $output[$key] = (int) $value;
                continue;
            }

            $output[$key] = $value;
        }

        return [$output, $errors];
    }

    private function canRun(Request $request): bool
    {
        $user = $request->user();

        if (! $user) {
            return false;
        }

        try {
            return $user->hasPermissionTo('Full Access');
        } catch (\Throwable $e) {
            return false;
        }
    }

    private function authorizeRun(Request $request): void
    {
        if (! $this->canRun($request)) {
            abort(403, 'No autorizado.');
        }
    }

    private function getCommitHash(): ?string
    {
        $headPath = base_path('.git/HEAD');
        if (! is_file($headPath)) {
            return null;
        }

        $head = trim((string) file_get_contents($headPath));
        if ($head === '') {
            return null;
        }

        $hash = null;

        if (str_starts_with($head, 'ref:')) {
            $ref = trim(substr($head, 4));
            $refPath = base_path('.git/' . $ref);
            if (is_file($refPath)) {
                $hash = trim((string) file_get_contents($refPath));
            } else {
                $packedPath = base_path('.git/packed-refs');
                if (is_file($packedPath)) {
                    $lines = file($packedPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    if ($lines) {
                        foreach ($lines as $line) {
                            if ($line[0] === '#' || $line[0] === '^') {
                                continue;
                            }
                            if (str_ends_with($line, ' ' . $ref)) {
                                $hash = substr($line, 0, 40);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            $hash = $head;
        }

        if (! $hash) {
            return null;
        }

        return substr($hash, 0, 8);
    }

    private function getAppUptime(): string
    {
        $key = 'healthchecks_app_booted_at';
        $value = cache()->get($key);

        if (! $value) {
            $value = now()->toIso8601String();
            cache()->forever($key, $value);
        }

        $bootedAt = $this->parseDate($value);
        if (! $bootedAt) {
            return 'N/D';
        }

        $seconds = now()->diffInSeconds($bootedAt);
        return $this->formatDuration($seconds);
    }

    private function parseDate($value): ?Carbon
    {
        if ($value instanceof Carbon) {
            return $value;
        }

        if (! $value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function formatDuration(int $seconds): string
    {
        $seconds = max(0, $seconds);
        $days = intdiv($seconds, 86400);
        $seconds %= 86400;
        $hours = intdiv($seconds, 3600);
        $seconds %= 3600;
        $minutes = intdiv($seconds, 60);

        $parts = [];
        if ($days > 0) {
            $parts[] = $days . 'd';
        }
        if ($hours > 0 || $days > 0) {
            $parts[] = $hours . 'h';
        }
        $parts[] = $minutes . 'm';

        return implode(' ', $parts);
    }
}
