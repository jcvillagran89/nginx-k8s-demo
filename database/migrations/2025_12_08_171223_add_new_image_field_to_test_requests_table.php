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
        Schema::table('test_requests', function (Blueprint $table) {
            $table->string('new_image')->nullable();
            $table->boolean('is_development')->default(0);
            $table->boolean('is_informative')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_requests', function (Blueprint $table) {
            // $table->dropColumn('new_image');
            // $table->dropColumn('is_development');
            // $table->dropColumn('is_informative');
        });
    }
};
