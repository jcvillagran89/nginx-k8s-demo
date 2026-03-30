<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'prov',
        'division',
        'mes',
        'sku',
        'codigo_num',
        'codigo',
        'fecha',
        'hora',
        'fecha_termino_pruebas',
        'fecha_envio_reporte',
        'analista',
        'departamento',
        'confeccionista',
        'style_number',
        'descripcion',
        'imp_etiq',
        'solicitante',
        'comentarios',
        'estatus_lab_ccp',
        'clasificacion_rechazo',
        'motivo_rech_lab',
        'motivo_rech_lab2',
        'fecha_comite',
        'estatus_comite',
        'seguimiento_comite_calidad',
        'liberacion_compras',
        'fecha_lib_compras',
        'status_final',
        'c_dimen_3',
        'torsion_2',
        'apariencia_5',
        'peso_1',
        'frote_9',
        'pilling_4',
        'rasgado_6',
        'traccion_7',
        'lavado_acelerado_8',
        'densidad_10',
        'microscopio_11',
        'tipo_de_lavado',
        'temperatura_de_lavado',
        'tipo_de_secado',
        'planchado',
        'oc',
        'no_reporte',
        'reingreso',
        'estatus_de_calidad',
        'estatus_de_compras',
        'motivo_de_rechazo',
        'prov_tela',
        'composicion',
        'recibo_cedis',
        'prioridad',
        'fase',
        'peso_g_m2',
    ];
}
