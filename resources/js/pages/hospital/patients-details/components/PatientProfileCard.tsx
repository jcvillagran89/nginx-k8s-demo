import IconifyIcon from '@/components/wrappers/IconifyIcon';
import avatar5 from '@/images/users/avatar-5.jpg';

import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';

const PatientProfile = () => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-center gap-2">
                    <img src={avatar5} alt="avatar" className="avatar-xl rounded-circle border border-light border-2" />
                    <div>
                        <h4 className="text-dark fw-medium">Ernest J. Johnson</h4>
                        <p className="mb-0 text-muted">ID: PS49201</p>
                    </div>
                    <div className="ms-auto">
                        <span className="badge bg-success px-2 py-1 fs-12">Active</span>
                    </div>
                </div>
                <div className="mt-3">
                    <h4 className="fs-15">Contact Details :</h4>
                    <div className="mt-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="bg-opacity-75 d-flex align-items-center justify-content-center rounded">
                                <IconifyIcon icon="solar:point-on-map-bold-duotone" className="fs-20 text-primary" />
                            </div>
                            <p className="mb-0 text-dark">2713 Frum Street Nashville, TN 37207</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="bg-opacity-75 d-flex align-items-center justify-content-center rounded">
                                <IconifyIcon icon="solar:smartphone-2-bold-duotone" className="fs-20 text-primary" />
                            </div>
                            <p className="mb-0 text-dark">+ (901) 234.5678</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-opacity-75 d-flex align-items-center justify-content-center rounded">
                                <IconifyIcon icon="solar:letter-bold-duotone" className="fs-20 text-primary" />
                            </div>
                            <p className="mb-0 text-dark">2713 Frum Street Nashville, TN 37207</p>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <h4 className="fs-15">Diagnosis Details :</h4>
                    <p className="mb-0 text-muted fs-14 mt-2">Hypertonic disease. Persistent atrial fibrillation. Chronic heart failure</p>
                </div>
                <div className="mt-3">
                    <h4 className="fs-15">Treatment :</h4>
                    <Row className="mt-1 g-2">
                        <Col lg={4} xs={6}>
                            <h4 className="fw-medium mb-0">10 G</h4>
                            <p className="mb-0 text-muted lh-lg">Dopamine</p>
                        </Col>
                        <Col lg={4} xs={6}>
                            <h4 className="fw-medium mb-0">5-8 G</h4>
                            <p className="mb-0 text-muted lh-lg">Salt Restriction/day</p>
                        </Col>
                        <Col lg={4} xs={6}>
                            <h4 className="fw-medium mb-0">1.5-2 L</h4>
                            <p className="mb-0 text-muted lh-lg">Fluid Restriction/day</p>
                        </Col>
                        <Col lg={4} xs={6}>
                            <h4 className="fw-medium mb-0">90MM</h4>
                            <p className="mb-0 text-muted lh-lg">Nitroglycerin for BP</p>
                        </Col>
                    </Row>
                </div>
            </CardBody>
            <CardFooter className="border-top border-dashed gap-1 hstack">
                <Button variant="primary" className="w-100">
                    Open Chat
                </Button>
                <Button variant="light" className="w-100">
                    Call Patient
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

export default PatientProfile;
