import IconifyIcon from '@/components/wrappers/IconifyIcon';
import avatar3 from '@/images/users/avatar-3.jpg';

import { Button, Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap';

const ProfileCard = () => {
    return (
        <Card>
            <CardBody>
                <div className="dr-profile-bg rounded-top position-relative mx-n3 mt-n3 position-relative">
                    <img
                        src={avatar3}
                        alt="avatar"
                        className="border border-light border-3 rounded-circle position-absolute top-100 start-50 translate-middle"
                        height={100}
                        width={100}
                    />
                </div>
                <div className="mt-4 mb-2 pt-3  text-center">
                    <p className="mb-1 fs-18 fw-semibold text-dark">Dr. James Roger</p>
                    <p className="mb-0 fw-medium text-muted">(MD , Cardiology)</p>
                </div>
                <CardTitle as={'h5'} className="fw-semibold">
                    About Doctor :
                </CardTitle>
                <p className="mt-2">
                    Dr. James Roger has vast experience in treating cardiovascular diseases. He has presented papers at national and international
                    levels. Currently, he is a Professor and Head at a Medical College specializing in Cardiology.
                </p>
                <div className="mt-3">
                    <Row>
                        <Col lg={3} xs={3}>
                            <h5>Operations</h5>
                            <p className="fs-15 text-dark fw-semibold mb-0">1302</p>
                        </Col>
                        <Col lg={3} xs={3}>
                            <h5>Hospital</h5>
                            <p className="fs-15 text-dark fw-semibold mb-0">40</p>
                        </Col>
                        <Col lg={3} xs={3}>
                            <h5>Patient</h5>
                            <p className="fs-15 text-dark fw-semibold mb-0">3412</p>
                        </Col>
                        <Col lg={3} xs={3}>
                            <h5>Experience</h5>
                            <p className="fs-15 text-dark fw-semibold mb-0">14 Year</p>
                        </Col>
                    </Row>
                </div>
                <CardTitle as={'h5'} className="fw-semibold mt-4 mb-2">
                    Doctor Level :
                </CardTitle>
                <span className="badge bg-light text-dark my-1 px-2 py-1 rounded-pill fw-medium fs-12">General Cardiology</span>&nbsp;
                <span className="badge bg-light text-dark my-1 px-2 py-1 rounded-pill fw-medium fs-12">Echocardiology</span>&nbsp;
                <span className="badge bg-light text-dark my-1 px-2 py-1 rounded-pill fw-medium fs-12">Senior Doctor</span>&nbsp;
                <span className="badge bg-light text-dark my-1 px-2 py-1 rounded-pill fw-medium fs-12">CHO</span>&nbsp;
                <span className="badge bg-light text-dark mt-1 px-2 py-1 rounded-pill fw-medium fs-12">Adult Congenital Cardiology</span>
                <CardTitle as={'h5'} className="fw-semibold mt-4">
                    Doctor Rating :
                </CardTitle>
                <div className="flex-grow-1 d-inline-flex align-items-center fs-20 mt-1">
                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                    <IconifyIcon icon="tabler:star-half" className="text-warning" />
                    <span className="ms-1 fs-14">4.6k Reviews </span>
                </div>
            </CardBody>
            <CardFooter className="border-top gap-1 hstack">
                <Button variant="primary" className="w-100">
                    Send Message
                </Button>
                <Button variant="light" className="w-100">
                    Follow
                </Button>
                <Button variant="dark" className="d-inline-flex align-items-center justify-content-center rounded avatar-md">
                    {' '}
                    <span>
                        {' '}
                        <IconifyIcon icon="tabler:edit" className="fs-20" />
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProfileCard;
