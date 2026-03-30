import IconifyIcon from '@/components/wrappers/IconifyIcon';
import logoDark from '@/images/logo-dark.png';
import logo from '@/images/logo.png';
import maintenanceImg from '@/images/png/maintenance.png';

import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Col, Row } from 'react-bootstrap';

const MaintenancePage = () => {
    return (
        <BaseLayout>
            <Head title="Maintenance" />
            <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
                    <Col xl={4} lg={5} md={6}>
                        <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
                            <Link href="/" className="auth-brand mb-3">
                                <img src={logoDark} alt="dark logo" height={24} className="logo-dark" />
                                <img src={logo} alt="logo light" height={24} className="logo-light" />
                            </Link>
                            <div>
                                <h3 className="fw-semibold text-dark">Ooop&apos;s ! </h3>
                            </div>
                            <img src={maintenanceImg} alt="maintenance" className="img-fluid mt-3" height={320} />
                            <h5 className="fw-bold my-3 fs-20 text-dark lh-base">We are Under Scheduled Maintenance</h5>
                            <Link href="/" className="btn btn-primary">
                                Back To Home <IconifyIcon icon="tabler:home" className="ms-1" />
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </BaseLayout>
    );
};

export default MaintenancePage;
