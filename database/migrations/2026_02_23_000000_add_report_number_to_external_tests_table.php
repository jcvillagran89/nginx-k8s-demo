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
            if (! Schema::hasColumn('external_tests', 'report_number')) {
                $table->string('report_number')->nullable()->after('style_number');
                $table->index('report_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (Schema::hasColumn('external_tests', 'report_number')) {
                $table->dropIndex(['report_number']);
                $table->dropColumn('report_number');
            }
        });
    }
};
