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
        Schema::create('terminologies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('display_name_es');
            $table->string('display_name_en');
            $table->unsignedBigInteger('test_type_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terminologies');
    }
};
