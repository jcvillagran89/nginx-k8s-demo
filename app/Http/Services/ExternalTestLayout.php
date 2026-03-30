<?php

namespace App\Http\Services;

class ExternalTestLayout
{
    public const LAYOUT_A_HEADERS = [
        'ANO',
        'MES',
        'DIA',
        'PROV',
        'DIVISION',
        'DPTO',
        'LAB',
        'RECH GRAL',
        'RECH 1',
        'RECH 2',
        'RECH 3',
        'RECH 4',
        'RECH 5',
        'PESO',
        'COMPOSICION',
        'ESTATUS CALIDAD',
        'ESTATUS COMPRAS',
        'LIBERACION COMPRAS',
        'REPROCESO/REINGRESO',
        'ACCIONES/SEGUIMIENTO COMPRAS',
        'PROV TELA',
        'NOMBRE GENERICO',
        'NOMBRE COMERCIAL',
        'OC',
        'ESTILO',
    ];

    public const LAYOUT_B_HEADERS = [
        'FECHA DE EMISION DEL REPORTE',
        'REPORT NO.',
        'OVERALL RESULT',
        'VENDOR NAME',
        'FAIL TEST ITEM LIST',
        'ESTILO',
        'STYLE NO.',
        'COLOUR',
        'FIBER CONTENT',
        'DEPARTMENT',
        'NUMBER OF SAMPLES',
        'DATE OF ENTRY',
        'FECHA DE SALIDA RESULTADOS',
        'WEIGHT',
        'NOMBRE GENERICO',
        'TIPO DE PRODUCTO',
        'TIPO DE TEJIDO',
    ];
}
