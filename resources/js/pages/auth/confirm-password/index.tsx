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

const ConfirmPasswordPage = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <BaseLayout>
            <Head title="Confirm Password" />
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
                                <img src={logoMY} alt="dark logo" height={84} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <h3 className="fw-semibold mb-2">Confirm Password</h3>
                            <p className="text-muted mb-2">Please confirm your new password.</p>
                            <p className="mb-4">
                                Need password suggestion ?{' '}
                                <Link href="" className="link-dark fw-semibold text-decoration-underline">
                                    Suggestion
                                </Link>
                            </p>
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                <Button variant="soft-danger" className="avatar-lg">
                                    {' '}
                                    <span>
                                        {' '}
                                        <IconifyIcon width={24} height={24} icon="tabler:brand-google-filled" className="fs-24" />
                                    </span>
                                </Button>
                                <Button variant="soft-success" className="avatar-lg">
                                    {' '}
                                    <span>
                                        {' '}
                                        <IconifyIcon width={24} height={24} icon="tabler:brand-apple" className="fs-24" />
                                    </span>
                                </Button>
                                <Button variant="soft-primary" className="avatar-lg">
                                    {' '}
                                    <span>
                                        {' '}
                                        <IconifyIcon width={24} height={24} icon="tabler:brand-facebook" className="fs-24" />
                                    </span>
                                </Button>
                                <Button variant="soft-info" className="avatar-lg">
                                    {' '}
                                    <span>
                                        {' '}
                                        <IconifyIcon width={24} height={24} icon="tabler:brand-linkedin" className="fs-24" />
                                    </span>
                                </Button>
                            </div>
                            <p className="fs-13 fw-semibold">Or</p>

                            <form className="text-start mb-3" onSubmit={submit}>
                                <FormGroup className="mb-3">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="Enter your password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </FormGroup>

                                <div className="mb-2 d-grid">
                                    <Button variant="primary" type="submit" disabled={processing}>
                                        Create New Password
                                    </Button>
                                </div>
                            </form>

                            <p className="text-danger fs-14 mb-4">
                                Back To{' '}
                                <Link href={route('login')} className="fw-semibold text-dark ms-1">
                                    Login !
                                </Link>
                            </p>
                            <p className="mt-auto mb-0">
                                {currentYear} © Osen - By{' '}
                                <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">{developedBy}</span>
                            </p>
                        </Card>
                    </Col>
                </Row>
            </div>
        </BaseLayout>
    );
};

export default ConfirmPasswordPage;
