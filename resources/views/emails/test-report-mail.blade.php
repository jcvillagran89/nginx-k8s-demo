<!DOCTYPE html>
<html lang="es">
<body>

<p>Estimado proveedor,</p>

<p>
    Adjuntamos el <strong>reporte de pruebas textiles</strong>
    correspondiente al folio:
</p>

<p>
    <strong>Folio:</strong> {{ $testRequest->number }} <br>
    <strong>Estilo:</strong> {{ $testRequest->style->number ?? 'S/D' }}
</p>

<p>
    Cualquier duda o aclaración, quedamos a sus órdenes.
</p>

<p>
    Atentamente,<br>
    <strong>Laboratorio Textil</strong><br>
</p>

<img
    src="cid:logo"
    alt="Cuidado con el Perro"
    style="margin-top:10px; width:120px;"
>

</body>
</html>