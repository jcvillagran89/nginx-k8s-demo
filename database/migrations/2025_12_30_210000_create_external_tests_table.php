<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('external_tests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('style_id');
            $table->string('style_number')->nullable();
            $table->date('reported_at')->nullable();
            $table->string('lab')->nullable();
            $table->string('color')->nullable();
            $table->string('rejected_1')->nullable();
            $table->string('rejected_2')->nullable();
            $table->string('rejected_3')->nullable();
            $table->string('rejected_4')->nullable();
            $table->string('rejected_5')->nullable();
            $table->string('rejected_6')->nullable();
            $table->string('weigth')->nullable();
            $table->string('composition', 500)->nullable();
            $table->string('status')->nullable();
            $table->string('released_at')->nullable();
            $table->string('reprocesses')->nullable();
            $table->string('action_taken')->nullable();
            $table->string('cloth_provider')->nullable();
            $table->string('generic_name')->nullable();
            $table->string('comercial_name')->nullable();
            $table->timestamps();

            $table->index('style_id');
            $table->index('style_number');
        });

        if (Schema::hasColumn('styles', 'reported_at')) {
            $columns = [
                'reported_at',
                'lab',
                'color',
                'rejected_1',
                'rejected_2',
                'rejected_3',
                'rejected_4',
                'rejected_5',
                'rejected_6',
                'weigth',
                'composition',
                'status',
                'released_at',
                'reprocesses',
                'action_taken',
                'cloth_provider',
                'generic_name',
                'comercial_name',
            ];

            $columns = array_values(array_filter($columns, function ($column) {
                return Schema::hasColumn('styles', $column);
            }));

            $selectColumns = array_merge(['id', 'number', 'created_at', 'updated_at'], $columns);

            DB::table('styles')
                ->select($selectColumns)
                ->orderBy('id')
                ->chunkById(500, function ($styles) use ($columns) {
                    $rows = [];
                    foreach ($styles as $style) {
                        $payload = [
                            'style_id' => $style->id,
                            'style_number' => $style->number ?? null,
                            'reported_at' => $style->reported_at ?? null,
                            'lab' => $style->lab ?? null,
                            'color' => $style->color ?? null,
                            'rejected_1' => $style->rejected_1 ?? null,
                            'rejected_2' => $style->rejected_2 ?? null,
                            'rejected_3' => $style->rejected_3 ?? null,
                            'rejected_4' => $style->rejected_4 ?? null,
                            'rejected_5' => $style->rejected_5 ?? null,
                            'rejected_6' => $style->rejected_6 ?? null,
                            'weigth' => $style->weigth ?? null,
                            'composition' => $style->composition ?? null,
                            'status' => $style->status ?? null,
                            'released_at' => $style->released_at ?? null,
                            'reprocesses' => $style->reprocesses ?? null,
                            'action_taken' => $style->action_taken ?? null,
                            'cloth_provider' => $style->cloth_provider ?? null,
                            'generic_name' => $style->generic_name ?? null,
                            'comercial_name' => $style->comercial_name ?? null,
                            'created_at' => $style->created_at,
                            'updated_at' => $style->updated_at,
                        ];

                        $hasData = false;
                        foreach ($columns as $column) {
                            if ($payload[$column] !== null && $payload[$column] !== '') {
                                $hasData = true;
                                break;
                            }
                        }

                        if ($hasData) {
                            $rows[] = $payload;
                        }
                    }

                    if ($rows) {
                        DB::table('external_tests')->insert($rows);
                    }
                });
        }

        Schema::table('styles', function (Blueprint $table) {
            $columns = [
                'reported_at',
                'lab',
                'color',
                'rejected_1',
                'rejected_2',
                'rejected_3',
                'rejected_4',
                'rejected_5',
                'rejected_6',
                'weigth',
                'composition',
                'status',
                'released_at',
                'reprocesses',
                'action_taken',
                'cloth_provider',
                'generic_name',
                'comercial_name',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('styles', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('styles', function (Blueprint $table) {
            $table->date('reported_at')->nullable();
            $table->string('lab')->nullable();
            $table->string('color')->nullable();
            $table->string('rejected_1')->nullable();
            $table->string('rejected_2')->nullable();
            $table->string('rejected_3')->nullable();
            $table->string('rejected_4')->nullable();
            $table->string('rejected_5')->nullable();
            $table->string('rejected_6')->nullable();
            $table->string('weigth')->nullable();
            $table->string('composition', 255)->nullable();
            $table->string('status')->nullable();
            $table->string('released_at')->nullable();
            $table->string('reprocesses')->nullable();
            $table->string('action_taken')->nullable();
            $table->string('cloth_provider')->nullable();
            $table->string('generic_name')->nullable();
            $table->string('comercial_name')->nullable();
        });

        Schema::dropIfExists('external_tests');
    }
};
