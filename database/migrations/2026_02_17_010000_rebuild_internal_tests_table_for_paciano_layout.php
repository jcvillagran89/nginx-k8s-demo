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
        Schema::dropIfExists('internal_tests');

        Schema::create('internal_tests', function (Blueprint $table) {
            $table->id();
            $table->string('prov')->nullable();
            $table->string('division')->nullable();
            $table->string('mes')->nullable();
            $table->string('sku')->nullable();
            $table->string('codigo_num')->nullable();
            $table->string('codigo')->nullable();
            $table->date('fecha')->nullable();
            $table->string('hora')->nullable();
            $table->date('fecha_termino_pruebas')->nullable();
            $table->date('fecha_envio_reporte')->nullable();
            $table->string('analista')->nullable();
            $table->string('departamento')->nullable();
            $table->string('confeccionista')->nullable();
            $table->string('style_number')->nullable();
            $table->string('descripcion')->nullable();
            $table->string('imp_etiq')->nullable();
            $table->string('solicitante')->nullable();
            $table->text('comentarios')->nullable();
            $table->string('estatus_lab_ccp')->nullable();
            $table->string('clasificacion_rechazo')->nullable();
            $table->string('motivo_rech_lab')->nullable();
            $table->string('motivo_rech_lab2')->nullable();
            $table->date('fecha_comite')->nullable();
            $table->string('estatus_comite')->nullable();
            $table->string('seguimiento_comite_calidad')->nullable();
            $table->string('liberacion_compras')->nullable();
            $table->date('fecha_lib_compras')->nullable();
            $table->string('status_final')->nullable();
            $table->string('c_dimen_3')->nullable();
            $table->string('torsion_2')->nullable();
            $table->string('apariencia_5')->nullable();
            $table->string('peso_1')->nullable();
            $table->string('frote_9')->nullable();
            $table->string('pilling_4')->nullable();
            $table->string('rasgado_6')->nullable();
            $table->string('traccion_7')->nullable();
            $table->string('lavado_acelerado_8')->nullable();
            $table->string('densidad_10')->nullable();
            $table->string('microscopio_11')->nullable();
            $table->string('tipo_de_lavado')->nullable();
            $table->string('temperatura_de_lavado')->nullable();
            $table->string('tipo_de_secado')->nullable();
            $table->string('planchado')->nullable();
            $table->string('oc')->nullable();
            $table->string('no_reporte')->nullable();
            $table->string('reingreso')->nullable();
            $table->string('estatus_de_calidad')->nullable();
            $table->string('estatus_de_compras')->nullable();
            $table->string('motivo_de_rechazo')->nullable();
            $table->string('prov_tela')->nullable();
            $table->string('composicion')->nullable();
            $table->date('recibo_cedis')->nullable();
            $table->string('prioridad')->nullable();
            $table->string('fase')->nullable();
            $table->string('peso_g_m2')->nullable();
            $table->timestamps();

            $table->index('style_number');
            $table->index('fecha');
            $table->index('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internal_tests');
    }
};
