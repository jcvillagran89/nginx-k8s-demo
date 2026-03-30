import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import error400Img from '@/images/error/error-400.png';
import { Head, Link } from '@inertiajs/react';
import { Card, Col, Row } from 'react-bootstrap';

import { currentYear, developedBy } from '@/context/constants';
import BaseLayout from '@/layouts/BaseLayout';

const Error400Page = () => {
    return (
        <BaseLayout>
            <Head title="Error 400" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <div>
                                <h3 className="fw-semibold mb-2">Ooops ! </h3>
                                <p className="text-muted">something exciting is coming your way soon</p>
                            </div>
                            <div className="mx-auto text-center">
                                <img src={error400Img} alt="error 400 img" height={230} />
                                <h2 className="fw-bold mt-3 text-primary lh-base">Bed Request ! </h2>
                                <h4 className="fw-bold mt-2 text-dark lh-base">Your Browser Sent An Invalid Request</h4>
                                <p className="text-muted fs-12 mb-3">
                                    The server could not understand the request due to invalid syntax. Please check your input and try again.
                                </p>
                                <Link href="/" className="btn btn-primary">
                                    Back To Home <IconifyIcon icon="tabler:home" className="ms-1" />
                                </Link>
                            </div>
                            <p className="mt-3 mb-0">
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

export default Error400Page;
