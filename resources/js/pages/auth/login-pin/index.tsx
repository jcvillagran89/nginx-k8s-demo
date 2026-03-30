import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currentYear, developedBy } from '@/context/constants';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const LoginPinPage = () => {
    return (
        <BaseLayout>
            <Head title="Login Pin" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <h3 className="fw-semibold mb-2">Login With Pin</h3>
                            <p className="text-muted mb-4">
                                We sent you a code , please enter it below to verify your number{' '}
                                <span className="text-primary fw-medium">+ (94) 883-630-646</span>
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
                            <form action="" className="text-start mb-3">
                                <label className="form-label" htmlFor="code">
                                    Enter 6 Digit Code
                                </label>
                                <div className="d-flex gap-2 mt-1 mb-3">
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                    <input type="text" maxLength={1} className="form-control text-center" />
                                </div>
                                <div className="mb-3 d-grid">
                                    <Button variant="primary" type="submit">
                                        Continue
                                    </Button>
                                </div>
                                <p className="mb-0 text-center">
                                    Don&apos;t received code yet?{' '}
                                    <Link href="" className="link-primary fw-semibold text-decoration-underline">
                                        Send Again
                                    </Link>
                                </p>
                            </form>
                            <p className="text-danger fs-14 mb-4">
                                Back To{' '}
                                <Link href="/" className="fw-semibold text-dark ms-1">
                                    Home !
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

export default LoginPinPage;
