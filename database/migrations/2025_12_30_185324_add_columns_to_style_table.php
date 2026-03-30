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
            $table->date('reported_at')->nullable();
            $table->string('lab')->nullable();
            $table->string('rejected_1')->nullable();
            $table->string('rejected_2')->nullable();
            $table->string('rejected_3')->nullable();
            $table->string('rejected_4')->nullable();
            $table->string('rejected_5')->nullable();
            $table->string('rejected_6')->nullable();
            $table->string('weigth')->nullable();
            $table->string('composition')->nullable();
            $table->string('status')->nullable();
            $table->string('released_at')->nullable();
            $table->string('reprocesses')->nullable();
            $table->string('action_taken')->nullable();
            $table->string('cloth_provider')->nullable();
            $table->string('generic_name')->nullable();
            $table->string('comercial_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('styles', function (Blueprint $table) {
            $table->dropColumn('reported_at');
            $table->dropColumn('lab');
            $table->dropColumn('rejected_1');
            $table->dropColumn('rejected_2');
            $table->dropColumn('rejected_3');
            $table->dropColumn('rejected_4');
            $table->dropColumn('rejected_5');
            $table->dropColumn('rejected_6');
            $table->dropColumn('weigth');
            $table->dropColumn('composition');
            $table->dropColumn('status');
            $table->dropColumn('released_at');
            $table->dropColumn('reprocesses');
            $table->dropColumn('action_taken');
            $table->dropColumn('cloth_provider');
            $table->dropColumn('generic_name');
            $table->dropColumn('comercial_name');
        });
    }
};
