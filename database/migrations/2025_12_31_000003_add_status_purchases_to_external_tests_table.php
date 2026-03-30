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
            if (! Schema::hasColumn('external_tests', 'status_purchases')) {
                $table->string('status_purchases')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (Schema::hasColumn('external_tests', 'status_purchases')) {
                $table->dropColumn('status_purchases');
            }
        });
    }
};
