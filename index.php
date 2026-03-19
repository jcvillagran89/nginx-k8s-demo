<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Login</title>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #9e9e9e;
}

.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    background: #fff;
    padding: 40px 35px;
    width: 350px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 15px 40px rgba(0,0,0,0.25);
}

.logo {
    margin-bottom: 10px;
    font-weight: bold;
    color: #555;
}

h2 {
    margin: 10px 0;
    font-size: 26px;
}

.subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 25px;
}

.input-group {
    margin-bottom: 15px;
    text-align: left;
}

input {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
}

input.error {
    border-color: red;
}

.error-msg {
    color: red;
    font-size: 12px;
    display: none;
}

.options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-bottom: 20px;
}

.options a {
    color: blue;
    text-decoration: none;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #2f3742;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
}

button:disabled {
    background-color: #999;
}

.footer {
    margin-top: 20px;
    font-size: 12px;
    color: #888;
}

.loader {
    display: none;
    margin-top: 10px;
    font-size: 13px;
}
</style>

</head>

<body>

<div class="container">
    <div class="card">

        <div class="logo">HOLA MUNDO</div>

        <h2>Iniciar sesión</h2>
        <div class="subtitle">
            Ingresa tu correo electrónico y contraseña para acceder
        </div>

        <form id="loginForm">

            <div class="input-group">
                <input type="text" id="email" placeholder="Correo">
                <div class="error-msg" id="emailError">Correo requerido</div>
            </div>

            <div class="input-group">
                <input type="password" id="password" placeholder="Contraseña">
                <div class="error-msg" id="passError">Contraseña requerida</div>
            </div>

            <div class="options">
                <label>
                    <input type="checkbox"> Recordarme
                </label>
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" id="btnLogin">Entrar</button>

            <div class="loader" id="loader">Validando...</div>

        </form>

        <div class="footer">
            2026 © CCP - Todos los derechos reservados
        </div>

    </div>
</div>

<script>
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');

const loader = document.getElementById('loader');
const btn = document.getElementById('btnLogin');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let valid = true;

    // Reset
    email.classList.remove('error');
    password.classList.remove('error');
    emailError.style.display = 'none';
    passError.style.display = 'none';

    // Validaciones
    if (email.value.trim() === "") {
        email.classList.add('error');
        emailError.style.display = 'block';
        valid = false;
    }

    if (password.value.trim() === "") {
        password.classList.add('error');
        passError.style.display = 'block';
        valid = false;
    }

    if (!valid) return;

    // Simulación de login
    btn.disabled = true;
    loader.style.display = 'block';

    setTimeout(() => {

        // Credenciales fake
        if (email.value === "admin@test.com" && password.value === "1234") {

            // Simula sesión
            localStorage.setItem("auth", "true");

            alert("Login exitoso 🚀");

            // Redirección fake
            window.location.href = "/dashboard";

        } else {
            alert("Credenciales incorrectas ❌");
        }

        btn.disabled = false;
        loader.style.display = 'none';

    }, 1500);
});
</script>

</body>
</html>
