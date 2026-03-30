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
        if (DB::getDriverName() === 'oracle') {
            $column = DB::selectOne(
                "select nullable from user_tab_columns where table_name = 'EXTERNAL_TESTS' and column_name = 'COMPOSITION'"
            );

            if ($column && strtoupper((string) $column->nullable) === 'N') {
                DB::statement('alter table "EXTERNAL_TESTS" modify "COMPOSITION" null');
            }

            return;
        }

        Schema::table('external_tests', function (Blueprint $table) {
            $table->string('composition', 500)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'oracle') {
            $column = DB::selectOne(
                "select nullable from user_tab_columns where table_name = 'EXTERNAL_TESTS' and column_name = 'COMPOSITION'"
            );

            if ($column && strtoupper((string) $column->nullable) === 'Y') {
                DB::statement('alter table "EXTERNAL_TESTS" modify "COMPOSITION" not null');
            }

            return;
        }

        Schema::table('external_tests', function (Blueprint $table) {
            $table->string('composition', 500)->nullable(false)->change();
        });
    }
};
