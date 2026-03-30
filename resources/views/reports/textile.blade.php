<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Pruebas Textiles</title>

    <style>
        @page {
            size: letter;
            margin: 160px 40px 80px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #000;
            padding-top: 50px;
        }

        .header {
            position: fixed;
            top: 0;
            left: 40px;
            right: 40px;
            height: 120px;
        }

        .page-break {
            page-break-before: always;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 5px;
            vertical-align: middle;
        }

        .no-border td {
            border: none;
        }

        .header-title {
            font-size: 14px;
            font-weight: bold;
            text-align: right;
        }

        .section-title {
            margin-top: 12px;
            font-weight: bold;
            background: #eee;
            padding: 4px;
            border: 1px solid #000;
        }

        .center {
            text-align: center;
        }

        .small {
            font-size: 10px;
        }
    </style>
</head>
<body>

<div class="header">
    <table class="no-border">
        <tr>
            <td style="width:50%; text-align:center;">
                <div class="header-title">
                    INFORME DE RESULTADOS<br />
                    <span class="small">FLPF-003-001</span>
                </div>
            </td>
            <td style="width:50%; text-align:right;">
                <img src="{{ public_path('/logo-ccp-full.png') }}" height="50">
                <img src="{{ public_path('/logo-my.png') }}" height="50">
            </td>
        </tr>
    </table>
</div>

<table>
    <tr>
        <td style="width:20%; background:#e6e6e6;"><strong>Proveedor</strong></td>
        <td style="width:30%;">{{ $testRequest->style->provider->name ?? 'S/D' }}</td>
        <td style="width:20%; background:#e6e6e6;"><strong>Orden de Trabajo</strong></td>
        <td style="width:30%;">{{ $testRequest->number }}</td>
    </tr>

    <tr>
        <td style="background:#e6e6e6;"><strong>Descripción</strong></td>
        <td>{{ $testRequest->style->description ?? 'S/D' }}</td>
        <td style="background:#e6e6e6;"><strong>Fecha de ingreso</strong></td>
        <td>{{ $testRequest->test[0]->started_at }}</td>
    </tr>

    <tr>
        <td style="background:#e6e6e6;"><strong>Estilo García</strong></td>
        <td>{{ $testRequest->style->number ?? 'S/D' }}</td>
        <td style="background:#e6e6e6;"><strong>Fecha de entrega</strong></td>
        <td>{{ $testRequest->test[0]->finished_at }}</td>
    </tr>

    <tr>
        <td style="background:#e6e6e6;"><strong>Departamento</strong></td>
        <td colspan="3">
            {{ $testRequest->style->department->number ?? '' }}
            {{ $testRequest->style->department->description ?? 'S/D' }}
        </td>
    </tr>

    <tr>
        <td style="background:#e6e6e6;"><strong>Revisó</strong></td>
        <td class="center">{{ $testRequest->reviewer->name ?? 'S/D' }}</td>
        <td style="background:#e6e6e6;"><strong>Autorizó</strong></td>
        <td class="center">{{ $testRequest->user->name ?? 'S/D' }}</td>
    </tr>
</table>

<br />

    {{-- EVALUACIÓN --}}
    <table border="1" width="100%" cellpadding="5">
        <tr>
            <td style="width:50%; background:#e6e6e6; font-weight:bold;">
                <strong>Evaluación de los resultados:</strong><br/>
                <span style="font-size:10px;">
                    Nota: Esta parte es evaluada por personal de Cuidado con el Perro
                </span>
            </td>

            <td width="50%">
                <table width="100%">
                    <tr>
                        <td align="center" width="10%">
                            {!! $evaluation['accepted'] ? '✔' : '☐' !!}
                        </td>
                        <td>Aceptado</td>

                        <td align="center" width="10%">
                            {!! $evaluation['informative'] ? '✔' : '☐' !!}
                        </td>
                        <td>Informativo</td>
                    </tr>

                    <tr>
                        <td align="center">
                            {!! $evaluation['rejected'] ? 'X' : '☐' !!}
                        </td>
                        <td>Rechazado</td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <br/>

    {{-- REPORTE PREVIO --}}
 <table style="margin-top:10px; width:50%;"> 
    <tr> 
    <td style="width:70%; background:#e6e6e6; font-weight:bold;"> Reporte previo de telas </td> 
    <td style="width:30%; text-align:center;"> {{ $testRequest->style->externalTests[0]->report_number ?? 'S/N' }} </td> 
    </tr> 
</table> 
<br />

<div class="section-title">Resultados de Pruebas</div>

@php
    $groupedImages = [];
@endphp

@foreach($reportTests as $index => $test)

    @if($index > 0)
        <div class="page-break"></div>
    @endif

    <div>
        <strong>Prueba:</strong> {{ $test['name'] }}

        <table style="margin-top:5px;">
            <thead>
                <tr>
                    <th>Nombre de la prueba</th>
                    <th>Método</th>
                    <th>Descripción de la prueba</th>
                    <th>Resultado</th>
                    <th>Parámetro</th>
                </tr>
            </thead>
            <tbody>
                @foreach($test['fields'] as $field)
                    <tr>
                        <td>{{ $field['description'] }}</td>
                        <td>{{ $field['method'] }}</td>
                        <td>{{ $field['display_name'] ?? '' }}</td>
                        <td class="center">{{ $field['result'] }}</td>
                        <td class="center">{{ $field['parameter'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p style="margin-top:6px;">
            <strong>Resultado:</strong>
            @if($test['approved'] === true)
                APROBADO
            @elseif($test['approved'] === false)
                RECHAZADO
            @else
                SIN REVISIÓN
            @endif
        </p>

        @if(!empty($test['images']))
            @php
                $groupedImages[$test['name']] = $test['images'];
            @endphp
        @endif

    </div>

@endforeach


{{-- ================= SECCIÓN FINAL DE IMÁGENES ================= --}}

@if(!empty($groupedImages))

    <div class="page-break"></div>

    <div class="section-title" style="text-align:center">
        Evidencia Fotográfica
    </div>

    <br />

    @foreach($groupedImages as $testName => $images)

        <div style="margin-bottom:25px;">

            <div style="
                text-align:center;
                font-weight:bold;
                background:#f2f2f2;
                padding:8px;
                border:1px solid #000;
                font-size:12px;
            ">
                PRUEBA: {{ strtoupper($testName) }}
            </div>

            <br />

            <table class="no-border">
                <tbody>
                @foreach(array_chunk($images, 3) as $row)
                    <tr>
                        @foreach($row as $img)
                            <td style="text-align:center; padding:10px;">
                                <img
                                    src="{{ $img }}"
                                    style="
                                        width:170px;
                                        border:1px solid #000;
                                        page-break-inside: avoid;
                                    "
                                >
                            </td>
                        @endforeach

                        @for($i = count($row); $i < 3; $i++)
                            <td></td>
                        @endfor
                    </tr>
                @endforeach
                </tbody>
            </table>

        </div>

    @endforeach

@endif

</body>
</html>
