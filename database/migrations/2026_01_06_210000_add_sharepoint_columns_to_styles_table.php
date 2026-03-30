<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('styles', function (Blueprint $table) {
            if (! Schema::hasColumn('styles', 'cloth_provider')) {
                $table->string('cloth_provider')->nullable();
            }
            if (! Schema::hasColumn('styles', 'cloth_name')) {
                $table->string('cloth_name')->nullable();
            }
            if (! Schema::hasColumn('styles', 'generic_name')) {
                $table->string('generic_name')->nullable();
            }
            if (! Schema::hasColumn('styles', 'comercial_name')) {
                $table->string('comercial_name')->nullable();
            }
            if (! Schema::hasColumn('styles', 'china_style')) {
                $table->string('china_style')->nullable();
            }
            if (! Schema::hasColumn('styles', 'laboratory')) {
                $table->string('laboratory')->nullable();
            }
            if (! Schema::hasColumn('styles', 'laboratory_delivery_date')) {
                $table->string('laboratory_delivery_date')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('styles', function (Blueprint $table) {
            if (Schema::hasColumn('styles', 'cloth_provider')) {
                $table->dropColumn('cloth_provider');
            }
            if (Schema::hasColumn('styles', 'cloth_name')) {
                $table->dropColumn('cloth_name');
            }
            if (Schema::hasColumn('styles', 'generic_name')) {
                $table->dropColumn('generic_name');
            }
            if (Schema::hasColumn('styles', 'comercial_name')) {
                $table->dropColumn('comercial_name');
            }
            if (Schema::hasColumn('styles', 'china_style')) {
                $table->dropColumn('china_style');
            }
            if (Schema::hasColumn('styles', 'laboratory')) {
                $table->dropColumn('laboratory');
            }
            if (Schema::hasColumn('styles', 'laboratory_delivery_date')) {
                $table->dropColumn('laboratory_delivery_date');
            }
        });
    }
};
