<?php
echo "<h1>App simulando entorno real</h1>";

echo "<h2>PHP funcionando</h2>";

echo "<h3>Extensiones cargadas:</h3>";
print_r(get_loaded_extensions());

echo "<h3>Simulación Oracle:</h3>";
echo getenv('LD_LIBRARY_PATH');

echo "<h3>Deploy:</h3>";

echo "<h3>Fecha:</h3>";

echo date("Y-m-d H:i:s");
echo "<h3>Deploy local ngnix 2:</h3>";
