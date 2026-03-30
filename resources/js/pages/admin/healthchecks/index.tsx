import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Row,
    Spinner,
} from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ConfirmModal from '@/components/_general/ConfirmModal';

type HealthcheckDetail = {
    label: string;
    value: string;
};

type HealthcheckItem = {
    key: string;
    label: string;
    status: 'ok' | 'warn' | 'fail';
    message: string;
    latency_ms?: number;
    checked_at?: string;
    details?: HealthcheckDetail[];
};

type HealthchecksPayload = {
    checked_at?: string;
    items: HealthcheckItem[];
};

type CommandField = {
    key: string;
    label: string;
    type: 'text' | 'number' | 'checkbox';
    placeholder?: string;
    default?: string | number | boolean;
};

type CommandDefinition = {
    signature: string;
    key: string;
    label: string;
    description?: string;
    danger?: boolean;
    fields?: CommandField[];
};

type JobField = {
    key: string;
    label: string;
    type: 'file';
    accept?: string;
};

type JobDefinition = {
    key: string;
    label: string;
    description?: string;
    endpoint: string;
    fields?: JobField[];
};

type PageProps = {
    healthchecks: HealthchecksPayload;
    commands: CommandDefinition[];
    jobs: JobDefinition[];
    canRun: boolean;
};

type CommandResult = {
    ok: boolean;
    exit_code?: number;
    output?: string;
    ran_at?: string;
    duration_ms?: number;
    message?: string;
};

const statusStyles: Record<string, { badge: string; icon: string }> = {
    ok: { badge: 'bg-success-subtle text-success', icon: 'tabler:circle-check' },
    warn: { badge: 'bg-warning-subtle text-warning', icon: 'tabler:alert-triangle' },
    fail: { badge: 'bg-danger-subtle text-danger', icon: 'tabler:circle-x' },
};

const iconMap: Record<string, string> = {
    app: 'tabler:activity-heartbeat',
    scheduler: 'tabler:calendar-stats',
    queue: 'tabler:stack-2',
    db: 'tabler:database',
    oracle: 'tabler:server',
    redis: 'tabler:brand-redis',
    sharepoint: 'tabler:brand-microsoft',
};

const buildCommandDefaults = (commands: CommandDefinition[]) => {
    const initial: Record<string, Record<string, string | number | boolean>> = {};

    commands.forEach((command) => {
        const values: Record<string, string | number | boolean> = {};
        (command.fields ?? []).forEach((field) => {
            if (field.type === 'checkbox') {
                values[field.key] = Boolean(field.default);
            } else if (field.default !== undefined) {
                values[field.key] = field.default;
            } else {
                values[field.key] = '';
            }
        });
        initial[command.signature] = values;
    });

    return initial;
};

const buildJobDefaults = (jobs: JobDefinition[]) => {
    const initial: Record<string, Record<string, File | null>> = {};

    jobs.forEach((job) => {
        const values: Record<string, File | null> = {};
        (job.fields ?? []).forEach((field) => {
            values[field.key] = null;
        });
        initial[job.key] = values;
    });

    return initial;
};

const formatDateTime = (iso?: string) => {
    if (!iso) return 'N/D';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
};

const HealthchecksPage = () => {
    const { healthchecks, commands, jobs, canRun } = usePage<PageProps>().props;
    const [items, setItems] = useState<HealthcheckItem[]>(healthchecks?.items ?? []);
    const [checkedAt, setCheckedAt] = useState<string | undefined>(healthchecks?.checked_at);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);

    const [commandParams, setCommandParams] = useState(() => buildCommandDefaults(commands ?? []));
    const [commandResults, setCommandResults] = useState<Record<string, CommandResult | null>>({});
    const [commandErrors, setCommandErrors] = useState<Record<string, string | null>>({});
    const [runningCommand, setRunningCommand] = useState<string | null>(null);
    const [confirmCommand, setConfirmCommand] = useState<CommandDefinition | null>(null);

    const [jobInputs, setJobInputs] = useState(() => buildJobDefaults(jobs ?? []));
    const [jobResults, setJobResults] = useState<Record<string, CommandResult | null>>({});
    const [jobErrors, setJobErrors] = useState<Record<string, string | null>>({});
    const [runningJob, setRunningJob] = useState<string | null>(null);

    const summary = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                acc.total += 1;
                if (item.status === 'ok') acc.ok += 1;
                if (item.status === 'warn') acc.warn += 1;
                if (item.status === 'fail') acc.fail += 1;
                return acc;
            },
            { total: 0, ok: 0, warn: 0, fail: 0 }
        );
    }, [items]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshError(null);

        try {
            const { data } = await axios.get(route('admin.healthchecks.status'));
            setItems(data.items ?? []);
            setCheckedAt(data.checked_at);
        } catch (error: any) {
            setRefreshError('No se pudieron actualizar los healthchecks.');
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleParamChange = (
        signature: string,
        key: string,
        value: string | number | boolean
    ) => {
        setCommandParams((prev) => ({
            ...prev,
            [signature]: {
                ...(prev[signature] ?? {}),
                [key]: value,
            },
        }));
    };

    const runCommand = async (command: CommandDefinition) => {
        if (!canRun) return;

        const params = commandParams[command.signature] ?? {};
        const payload: Record<string, string | number | boolean> = {};

        Object.entries(params).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                if (value) payload[key] = true;
                return;
            }
            if (value !== '' && value !== null && value !== undefined) {
                payload[key] = value;
            }
        });

        setRunningCommand(command.signature);
        setCommandErrors((prev) => ({ ...prev, [command.signature]: null }));

        try {
            const { data } = await axios.post(route('admin.healthchecks.run'), {
                command: command.signature,
                parameters: payload,
            });
            setCommandResults((prev) => ({ ...prev, [command.signature]: data }));
        } catch (error: any) {
            const message = error?.response?.data?.message || 'No se pudo ejecutar el comando.';
            setCommandErrors((prev) => ({ ...prev, [command.signature]: message }));
        } finally {
            setRunningCommand(null);
            setConfirmCommand(null);
        }
    };

    const requestRunCommand = (command: CommandDefinition) => {
        if (command.danger) {
            setConfirmCommand(command);
            return;
        }
        runCommand(command);
    };

    const handleJobFileChange = (jobKey: string, fieldKey: string, file: File | null) => {
        setJobInputs((prev) => ({
            ...prev,
            [jobKey]: {
                ...(prev[jobKey] ?? {}),
                [fieldKey]: file,
            },
        }));
    };

    const runJob = async (job: JobDefinition) => {
        if (!canRun) return;

        const fields = job.fields ?? [];
        const payload = new FormData();

        for (const field of fields) {
            if (field.type === 'file') {
                const file = jobInputs[job.key]?.[field.key];
                if (file) {
                    payload.append(field.key, file);
                }
            }
        }

        if ([...payload.keys()].length === 0) {
            setJobErrors((prev) => ({ ...prev, [job.key]: 'Selecciona un archivo antes de ejecutar.' }));
            return;
        }

        setRunningJob(job.key);
        setJobErrors((prev) => ({ ...prev, [job.key]: null }));

        try {
            const { data } = await axios.post(route(job.endpoint), payload);
            setJobResults((prev) => ({ ...prev, [job.key]: data }));
        } catch (error: any) {
            const message = error?.response?.data?.message || 'No se pudo ejecutar el job.';
            setJobErrors((prev) => ({ ...prev, [job.key]: message }));
        } finally {
            setRunningJob(null);
        }
    };

    return (
        <MainLayout>
            <PageTitle title="Healthchecks" subTitle="Admin" />

            {!canRun && (
                <Alert variant="warning" className="mb-3">
                    Tu usuario no tiene permisos para ejecutar comandos o jobs.
                </Alert>
            )}

            <Card className="border-0 shadow-sm rounded-4 mb-3">
                <Card.Body className="p-3">
                    <Row className="align-items-center g-3">
                        <Col md={8}>
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <Badge className="bg-success-subtle text-success">OK: {summary.ok}</Badge>
                                <Badge className="bg-warning-subtle text-warning">Warn: {summary.warn}</Badge>
                                <Badge className="bg-danger-subtle text-danger">Fail: {summary.fail}</Badge>
                                <span className="text-muted">Total: {summary.total}</span>
                            </div>
                            <div className="text-muted mt-2">
                                Ultima actualizacion: {formatDateTime(checkedAt)}
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Button
                                variant="primary"
                                onClick={handleRefresh}
                                disabled={refreshing}
                            >
                                {refreshing ? (
                                    <>
                                        <Spinner size="sm" className="me-2" /> Actualizando
                                    </>
                                ) : (
                                    <>
                                        <IconifyIcon icon="tabler:refresh" className="me-2" /> Actualizar
                                    </>
                                )}
                            </Button>
                        </Col>
                    </Row>
                    {refreshError && (
                        <div className="text-danger mt-2">{refreshError}</div>
                    )}
                </Card.Body>
            </Card>

            <Row className="g-3 mb-4">
                {items.map((item) => {
                    const style = statusStyles[item.status] ?? statusStyles.ok;
                    const icon = iconMap[item.key] ?? 'tabler:shield-check';

                    return (
                        <Col xs={12} md={6} xl={4} key={item.key}>
                            <Card className="h-100 border-0 shadow-sm rounded-4">
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="avatar-sm">
                                                    <span className="avatar-title rounded bg-light text-dark">
                                                        <IconifyIcon icon={icon} />
                                                    </span>
                                                </span>
                                                <div>
                                                    <h5 className="mb-0">{item.label}</h5>
                                                    <div className="text-muted fs-12">{item.message}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={style.badge}>
                                            <IconifyIcon icon={style.icon} className="me-1" />
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <div className="mt-3 text-muted d-flex flex-wrap gap-3">
                                        <span>
                                            <IconifyIcon icon="tabler:clock" className="me-1" />
                                            {item.latency_ms !== undefined ? `${item.latency_ms} ms` : 'N/D'}
                                        </span>
                                        {item.checked_at && (
                                            <span>
                                                <IconifyIcon icon="tabler:calendar-time" className="me-1" />
                                                {formatDateTime(item.checked_at)}
                                            </span>
                                        )}
                                    </div>

                                    {item.details && item.details.length > 0 && (
                                        <div className="mt-3">
                                            {item.details.map((detail, idx) => (
                                                <div key={`${item.key}-detail-${idx}`} className="d-flex justify-content-between">
                                                    <span className="text-muted">{detail.label}</span>
                                                    <span className="fw-medium">{detail.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Row className="g-3">
                <Col xs={12} xl={7}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-transparent border-0 pb-0">
                            <h5 className="mb-0">Comandos</h5>
                            <div className="text-muted fs-13">
                                Ejecuta tareas administrativas desde la misma pantalla.
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-column gap-3">
                                {commands.map((command) => {
                                    const result = commandResults[command.signature];
                                    const error = commandErrors[command.signature];
                                    const isRunning = runningCommand === command.signature;

                                    return (
                                        <Card key={command.signature} className="border rounded-4">
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-start justify-content-between">
                                                    <div>
                                                        <h6 className="mb-1">{command.label}</h6>
                                                        <div className="text-muted fs-13">
                                                            {command.description || command.signature}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant={command.danger ? 'danger' : 'success'}
                                                        size="sm"
                                                        onClick={() => requestRunCommand(command)}
                                                        disabled={!canRun || isRunning}
                                                    >
                                                        {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                                                    </Button>
                                                </div>

                                                {(command.fields ?? []).length > 0 ? (
                                                    <Row className="mt-3 g-2">
                                                        {command.fields?.map((field) => (
                                                            <Col xs={12} md={field.type === 'checkbox' ? 4 : 6} key={`${command.signature}-${field.key}`}>
                                                                {field.type === 'checkbox' ? (
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label={field.label}
                                                                        checked={Boolean(commandParams[command.signature]?.[field.key])}
                                                                        onChange={(event) =>
                                                                            handleParamChange(
                                                                                command.signature,
                                                                                field.key,
                                                                                event.currentTarget.checked
                                                                            )
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Form.Group>
                                                                        <Form.Label className="text-muted">{field.label}</Form.Label>
                                                                        <Form.Control
                                                                            type={field.type}
                                                                            placeholder={field.placeholder}
                                                                            value={String(commandParams[command.signature]?.[field.key] ?? '')}
                                                                            onChange={(event) =>
                                                                                handleParamChange(
                                                                                    command.signature,
                                                                                    field.key,
                                                                                    event.currentTarget.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                )}
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ) : (
                                                    <div className="text-muted mt-2">Sin parametros.</div>
                                                )}

                                                {error && (
                                                    <div className="text-danger mt-2">{error}</div>
                                                )}

                                                {result && (
                                                    <div className="mt-3">
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <Badge className={result.ok ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}>
                                                                {result.ok ? 'OK' : 'ERROR'}
                                                            </Badge>
                                                            {result.exit_code !== undefined && (
                                                                <span className="text-muted">Exit {result.exit_code}</span>
                                                            )}
                                                            {result.duration_ms !== undefined && (
                                                                <span className="text-muted">{result.duration_ms} ms</span>
                                                            )}
                                                            {result.ran_at && (
                                                                <span className="text-muted"> {formatDateTime(result.ran_at)}</span>
                                                            )}
                                                        </div>
                                                        {result.output && (
                                                            <pre className="bg-light-subtle p-2 rounded small mb-0">
                                                                {result.output}
                                                            </pre>
                                                        )}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} xl={5}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-transparent border-0 pb-0">
                            <h5 className="mb-0">Jobs</h5>
                            <div className="text-muted fs-13">
                                Dispara procesos en cola con insumos controlados.
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-column gap-3">
                                {jobs.map((job) => {
                                    const result = jobResults[job.key];
                                    const error = jobErrors[job.key];
                                    const isRunning = runningJob === job.key;

                                    return (
                                        <Card key={job.key} className="border rounded-4">
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-start justify-content-between">
                                                    <div>
                                                        <h6 className="mb-1">{job.label}</h6>
                                                        <div className="text-muted fs-13">
                                                            {job.description}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => runJob(job)}
                                                        disabled={!canRun || isRunning}
                                                    >
                                                        {isRunning ? 'Enviando...' : 'Ejecutar'}
                                                    </Button>
                                                </div>

                                                {(job.fields ?? []).length > 0 && (
                                                    <Row className="mt-3 g-2">
                                                        {job.fields?.map((field) => (
                                                            <Col xs={12} key={`${job.key}-${field.key}`}>
                                                                <Form.Group>
                                                                    <Form.Label className="text-muted">{field.label}</Form.Label>
                                                                    <Form.Control
                                                                        type="file"
                                                                        accept={field.accept}
                                                                        onChange={(event) =>
                                                                            handleJobFileChange(
                                                                                job.key,
                                                                                field.key,
                                                                                event.currentTarget.files?.[0] ?? null
                                                                            )
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                )}

                                                {error && (
                                                    <div className="text-danger mt-2">{error}</div>
                                                )}

                                                {result && (
                                                    <div className="mt-3">
                                                        <Badge className={result.ok ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}>
                                                            {result.ok ? 'En cola' : 'Error'}
                                                        </Badge>
                                                        {result.ran_at && (
                                                            <span className="text-muted ms-2">{formatDateTime(result.ran_at)}</span>
                                                        )}
                                                        {result.message && (
                                                            <div className="text-muted mt-2">{result.message}</div>
                                                        )}
                                                        {result.output && (
                                                            <pre className="bg-light-subtle p-2 rounded small mt-2 mb-0">
                                                                {result.output}
                                                            </pre>
                                                        )}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ConfirmModal
                show={Boolean(confirmCommand)}
                title="Confirmar comando"
                body="Este comando es destructivo y no se puede deshacer. Deseas continuar?"
                confirmText="Si, ejecutar"
                confirmVariant="danger"
                onConfirm={() => confirmCommand && runCommand(confirmCommand)}
                onClose={() => setConfirmCommand(null)}
                loading={runningCommand !== null}
            />
        </MainLayout>
    );
};

export default HealthchecksPage;
