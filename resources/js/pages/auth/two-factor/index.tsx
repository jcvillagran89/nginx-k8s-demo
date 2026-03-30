import { currentYear, developedBy } from '@/context/constants';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import qrCode from '@/images/png/qr-code.png';
import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const TwoFactorPage = () => {
    return (
        <BaseLayout>
            <Head title="Two Factor" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <h3 className="fw-semibold mb-2">Set up your two-factor authentication.</h3>
                            <div className="bg-body-secondary border border-dashed p-3 rounded my-3 text-center">
                                <img src={qrCode} alt="code" height={130} />
                                <p className="mt-3 mb-0">Scan this code with your Google authenticator app to continue this process.</p>
                            </div>
                            <form action="" className="text-start mb-3">
                                <label className="form-label" htmlFor="code">
                                    Verification Code
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

export default TwoFactorPage;
