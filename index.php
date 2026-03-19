<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Login</title>
<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: url('https://images.unsplash.com/photo-1581091215367-59ab6b7a0c1f') no-repeat center center fixed;
        background-size: cover;
    }

    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        background: rgba(0,0,0,0.4);
    }

    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 40px;
        border-radius: 10px;
        width: 320px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .logo {
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: 10px;
    }

    p {
        font-size: 13px;
        color: #666;
        margin-bottom: 20px;
    }

    input {
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .options {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 15px;
    }

    button {
        width: 100%;
        padding: 10px;
        background: #2f3640;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background: #1e272e;
    }

    .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #999;
    }
</style>
</head>
<body>

<div class="overlay"></div>

<div class="login-container">
    <div class="logo">
        <img src="https://via.placeholder.com/50" alt="logo">
    </div>

    <h2>Iniciar sesión</h2>
    <p>Ingresa tu correo electrónico y contraseña para acceder</p>

    <input type="text" placeholder="Correo">
    <input type="password" placeholder="Contraseña">

    <div class="options">
        <label><input type="checkbox"> Recordarme</label>
        <a href="#">¿Olvidaste tu contraseña?</a>
    </div>

    <button>Entrar</button>

    <div class="footer">
        2026 © CCP - Todos los derechos reservados
    </div>
</div>

</body>
</html>
