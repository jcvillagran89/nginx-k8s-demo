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
        Schema::create('internal_tests', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->date('fecha')->nullable();
            $table->string('style_number')->nullable();
            $table->string('departamento')->nullable();
            $table->string('attribute')->nullable();
            $table->string('n1_cambio_de_color_grado')->nullable();
            $table->string('n2_acetato')->nullable();
            $table->string('n3_algodon')->nullable();
            $table->string('n4_poliamida')->nullable();
            $table->string('n5_poliester')->nullable();
            $table->string('n6_acrilico')->nullable();
            $table->string('n7_lana')->nullable();
            $table->string('n1_tr_promedio_lb_f_urdimbre')->nullable();
            $table->string('n2_tr_promedio_lb_f_trama')->nullable();
            $table->string('n1_rs_promedio_lb_f_urdimbre')->nullable();
            $table->string('n2_rs_promedio_lb_f_trama')->nullable();
            $table->string('n1_valor_ph')->nullable();
            $table->string('n1_seco_grado')->nullable();
            $table->string('n2_humedo_grado')->nullable();
            $table->string('n1_pilling_promedio_grado')->nullable();
            $table->string('n1_promedio_g_m2')->nullable();
            $table->string('n2_peso_por_pieza_g')->nullable();
            $table->string('n1_torsion_pct')->nullable();
            $table->string('n1_antes_de_lavar_cambio_de_color_tela_principal_grado')->nullable();
            $table->string('n2_despues_de_lavar_cambio_de_color_tela_principal_grado')->nullable();
            $table->string('n3_antes_de_lavar_cambio_de_color_en_bies_grado')->nullable();
            $table->string('n4_despues_de_lavar_cambio_de_color_en_bies_grado')->nullable();
            $table->string('n5_manchas')->nullable();
            $table->string('n6_cambio_de_color_en_estampado')->nullable();
            $table->string('n7_cambios_en_estampado')->nullable();
            $table->string('n8_antes_de_lavar_pilling')->nullable();
            $table->string('n9_despues_de_lavar_pilling_grado')->nullable();
            $table->string('n10_suavidad')->nullable();
            $table->string('n11_rompimiento_de_la_costura')->nullable();
            $table->string('n12_danos_y_solturas_de_componentes')->nullable();
            $table->string('n13_desprendimiento_de_componentes')->nullable();
            $table->string('n14_legibilidad_de_la_etiqueta')->nullable();
            $table->text('n15_otros')->nullable();
            $table->string('n7_resultado_a1_largo')->nullable();
            $table->string('n8_resultado_a2_largo')->nullable();
            $table->string('n9_resultado_a3_largo')->nullable();
            $table->string('n10_resultado_b1_ancho')->nullable();
            $table->string('n11_resultado_b2_ancho')->nullable();
            $table->string('n12_resultado_b3_ancho')->nullable();
            $table->string('n1_resultado_promedio_largo_pct')->nullable();
            $table->string('n2_resultado_promedio_ancho_pct')->nullable();
            $table->string('n3_resultado_promedio_largo_pct')->nullable();
            $table->string('n4_resultado_promedio_ancho_pct')->nullable();
            $table->string('n5_resultado_promedio_largo_pct')->nullable();
            $table->string('n6_resultado_promedio_ancho_pct')->nullable();
            $table->string('n1_no_hilos_urd_columnas_en_1in')->nullable();
            $table->string('n1_no_hilos_trama_mallas_en_1in')->nullable();
            $table->text('n1_observaciones_o_comentarios')->nullable();
            $table->timestamps();

            $table->index('style_number');
            $table->index('fecha');
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
