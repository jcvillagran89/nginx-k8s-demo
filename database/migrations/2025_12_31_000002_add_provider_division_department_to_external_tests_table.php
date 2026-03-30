<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (! Schema::hasColumn('external_tests', 'provider')) {
                $table->string('provider')->nullable();
            }
            if (! Schema::hasColumn('external_tests', 'division')) {
                $table->string('division')->nullable();
            }
            if (! Schema::hasColumn('external_tests', 'department')) {
                $table->string('department')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (Schema::hasColumn('external_tests', 'provider')) {
                $table->dropColumn('provider');
            }
            if (Schema::hasColumn('external_tests', 'division')) {
                $table->dropColumn('division');
            }
            if (Schema::hasColumn('external_tests', 'department')) {
                $table->dropColumn('department');
            }
        });
    }
};
