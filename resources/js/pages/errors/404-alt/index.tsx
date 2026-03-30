import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Error404Alt from '@/images/error/error-404.png';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Col, Row } from 'react-bootstrap';

const Error404AltPage = () => {
    return (
        <MainLayout>
            <PageTitle title="404 Error" subTitle="Pages" />
            <Row className="justify-content-center">
                <Col lg={4}>
                    <div className="text-center">
                        <img src={Error404Alt} height={230} alt="File not found Image" />
                        <h4 className="text-uppercase text-danger mt-3">Page Not Found</h4>
                        <p className="text-muted mt-3">
                            It&apos;s looking like you may have taken a wrong turn. Don&apos;t worry... it happens to the best of us. Here&apos;s a
                            little tip that might help you get back on track.
                        </p>
                        <Link className="btn btn-info mt-3" href="/">
                            <IconifyIcon icon="tabler:home" className="me-1" /> Return Home
                        </Link>
                    </div>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default Error404AltPage;
