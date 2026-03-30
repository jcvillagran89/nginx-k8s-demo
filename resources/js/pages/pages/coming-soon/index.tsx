import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currentYear } from '@/context/constants';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import comingSoon from '@/images/png/coming-soon.png';
import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Timer from './components/Timer';

const ComingSoonPage = () => {
    return (
        <BaseLayout>
            <Head title="Coming Soon" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <div>
                                <h3 className="fw-semibold mb-2">We Are Launching Soon !</h3>
                                <p className="text-muted mb-0">something exciting is coming your way soon</p>
                            </div>
                            <img src={comingSoon} alt="Coming Soon Img" className="mb-2 w-auto" width={491} height={200} />
                            <Timer />
                            <Row className="justify-content-center">
                                <Col xs={12}>
                                    <div className="position-relative mb-3">
                                        <form className="m-0">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control rounded border w-100 px-2 py-2"
                                                placeholder="Enter Your Email"
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary position-absolute top-50 translate-middle-y translate-middle-x end-0 fw-semibold me-1"
                                            >
                                                Subscribe
                                            </button>
                                        </form>
                                    </div>
                                </Col>
                            </Row>
                            <p className="text-muted">Sign up now to get early launch notification of our launch date !</p>
                            <div className="d-flex justify-content-center gap-2">
                                <Button variant="danger" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:brand-google-filled" className="fs-20" />
                                    </span>
                                </Button>
                                <Button variant="primary" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:brand-facebook" className=" fs-20" />
                                    </span>
                                </Button>
                                <Button variant="info" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:brand-linkedin" className=" fs-20" />
                                    </span>
                                </Button>
                                <Button variant="warning" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:brand-github" className=" fs-20" />
                                    </span>
                                </Button>
                                <Button variant="danger" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:brand-youtube" className=" fs-20" />
                                    </span>
                                </Button>
                            </div>
                            <p className="mt-3 mb-0">
                                {currentYear} © Osen - By{' '}
                                <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">Coderthemes</span>
                            </p>
                        </Card>
                    </Col>
                </Row>
            </div>
        </BaseLayout>
    );
};

export default ComingSoonPage;
