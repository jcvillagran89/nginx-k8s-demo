import IconifyIcon from '@/components/wrappers/IconifyIcon';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';

import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button, Card, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';

import { currentYear, developedBy } from '@/context/constants';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const RegisterPage = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <BaseLayout>
            <Head title="Register" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <h3 className="fw-semibold mb-2">Welcome to Osen Admin</h3>
                            <p className="text-muted mb-4">Enter your name , email address and password to access account.</p>
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
                            <p className="fs-13 fw-semibold">Or Sign Up With Email</p>

                            <form className="text-start mb-3" onSubmit={submit}>
                                <FormGroup className="mb-3">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter your name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl
                                        type="email"
                                        placeholder="Enter your email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email}</p>}
                                </FormGroup>

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

                                <FormGroup className="mb-3">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && <p className="text-danger">{errors.password_confirmation}</p>}
                                </FormGroup>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={processing}>
                                        Sign Up
                                    </Button>
                                </div>
                            </form>

                            <p className="text-danger fs-14 mb-4">
                                Already have an account?{' '}
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

export default RegisterPage;
