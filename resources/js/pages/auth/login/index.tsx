import IconifyIcon from '@/components/wrappers/IconifyIcon';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import logoMY from '@/images/my-logo.png';
import bgImage from '@/images/images-resources/laboratorio-textil.jpg';
import BaseLayout from '@/layouts/BaseLayout';

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button, Card, Col, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';

import { currentYear, developedBy } from '@/context/constants';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

const LoginPage = ({ canResetPassword }: LoginProps) => {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: true,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <BaseLayout>
      <Head title="Login" />
      <div className="relative d-flex min-vh-100 justify-content-center align-items-center">
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 0,
          }}
        />
        <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3" style={{ position: 'relative', zIndex: 1 }}>
          <Col xl={4} lg={5} md={6}>
            <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
              <Link href="/" className="auth-brand mb-3">
                <img src={logo} alt="dark logo" height={74} className="logo-dark" />
                <img src={logoMY} alt="dark logo" height={84} className="logo-dark" />
              </Link>

              <h3 className="fw-semibold mb-2">Iniciar sesión</h3>
              <p className="text-muted mb-4">Ingresa tu correo electrónico y contraseña para acceder al panel de administración.</p>

              <form onSubmit={submit} className="text-start mb-3">
                <FormGroup className="mb-3">
                  <FormLabel>Correo</FormLabel>
                  <FormControl
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </FormGroup>

                <FormGroup className="mb-3">
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </FormGroup>

                <div className="d-flex justify-content-between mb-3">
                  <FormCheck checked={data.remember} onChange={() => setData('remember', !data.remember)} label="Recordarme" />
                  {canResetPassword && (
                    <Link href={route('password.request')} className="text-muted border-bottom border-dashed">
                      Olvidaste tu contraseña?
                    </Link>
                  )}
                </div>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={processing}>Entrar</Button>
                </div>
              </form>

              <p className="mt-auto mb-0">
                {currentYear} © CCP - Todos los derechos reservados
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </BaseLayout>
  );
};

export default LoginPage;
