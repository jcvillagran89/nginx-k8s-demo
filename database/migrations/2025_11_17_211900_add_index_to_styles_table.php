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
        Schema::table('styles', function (Blueprint $table) {
            $table->string('DESCRIPTION')->after('NUMBER')->nullable();
            $table->index('DEPARTMENT_ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('styles', function (Blueprint $table) {
            $table->dropColumn('DESCRIPTION');
            $table->dropIndex(['DEPARTMENT_ID']);
        });
    }
};
