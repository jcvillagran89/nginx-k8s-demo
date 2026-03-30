import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currentYear, developedBy } from '@/context/constants';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import logoMY from '@/images/my-logo.png';
import bgImage from '@/images/images-resources/laboratorio-textil.jpg';
import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button, Card, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';

const ForgotPasswordPage = ({ status }: { status?: string }) => {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <BaseLayout>
            <Head title="Forgot Password" />
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
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                              <img src={logo} alt="dark logo" height={74} className="logo-dark" />
                              <img src={logoMY} alt="dark logo" height={84} className="logo-dark" />
                            </Link>
                            <h3 className="fw-semibold mb-2">Solicitar conteseña</h3>
                            <p className="text-muted mb-2">Ingresa tu correo para reestablecer tu contraseña.</p>

                            <form className="text-start mb-3" onSubmit={submit}>
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

                                <div className="mb-2 d-grid">
                                    <Button variant="primary" type="submit" disabled={processing}>
                                        Solicitar contraseña
                                    </Button>
                                </div>
                            </form>

                            <p className="text-danger fs-14 mb-4">
                                Regresar a{' '}
                                <Link href={route('login')} className="fw-semibold text-dark ms-1">
                                    Inicio de sesión !
                                </Link>
                            </p>
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

export default ForgotPasswordPage;
