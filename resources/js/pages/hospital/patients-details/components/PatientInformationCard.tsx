import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PatientInformationCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Patient Information
                </CardTitle>
            </CardHeader>
            <CardBody>
                <Row className="justify-content-between align-items-center">
                    <Col lg={3} xs={6} className="border-end border-dashed">
                        <p className="text-muted mb-1">Gender</p>
                        <p className="fs-15 fw-medium mb-3">Male</p>
                        <p className="text-muted mb-1">Date Of Birth</p>
                        <p className="fs-15 fw-medium mb-0">1 January 1980</p>
                    </Col>
                    <Col lg={3} xs={6} className="border-end border-dashed">
                        <p className="text-muted mb-1">Phone</p>
                        <p className="fs-15 fw-medium mb-3">+ (901) 234.5678</p>
                        <p className="text-muted mb-1">City</p>
                        <p className="fs-15 fw-medium mb-0">New York</p>
                    </Col>
                    <Col lg={3} xs={6}>
                        <p className="text-muted mb-1">Address</p>
                        <p className="fs-15 fw-medium mb-3">2713 Frum Street Nashville, TN</p>
                        <p className="text-muted mb-1">Register Date</p>
                        <p className="fs-15 fw-medium mb-0">18 May 2022</p>
                    </Col>
                </Row>
                <hr className="my-3" />
                <h4 className="mb-0 fs-15 fw-semibold">Body Status :</h4>
                <Row className="mt-2 g-2">
                    <Col lg={2} xs={6}>
                        <h3 className="fw-medium">22.3</h3>
                        <p className="mb-0 text-muted">
                            BIM{' '}
                            <span className="text-success fw-medium">
                                <IconifyIcon icon="tabler:arrow-down" />
                                10
                            </span>
                        </p>
                    </Col>
                    <Col lg={2} xs={6}>
                        <h3 className="fw-medium">
                            70 <span className="text-muted fs-15">kg</span>
                        </h3>
                        <p className="mb-0 text-muted">
                            Weight{' '}
                            <span className="text-success fw-medium">
                                <IconifyIcon icon="tabler:arrow-down" />
                                13 kg
                            </span>
                        </p>
                    </Col>
                    <Col lg={2} xs={6}>
                        <h3 className="fw-medium">
                            175 <span className="text-muted fs-15">cm</span>
                        </h3>
                        <p className="mb-0 text-muted">Height</p>
                    </Col>
                    <Col lg={2} xs={6}>
                        <h3 className="fw-medium">124/80</h3>
                        <p className="mb-0 text-muted">
                            Blood Pressure{' '}
                            <span className="text-danger fw-medium">
                                <IconifyIcon icon="tabler:arrow-up" />
                                12
                            </span>
                        </p>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default PatientInformationCard;
