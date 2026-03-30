import IconifyIcon from '@/components/wrappers/IconifyIcon';
import masterCardImg from '@/images/cards/mastercard.svg';

import { Button, Card, CardBody, Col } from 'react-bootstrap';

const TrackOrderCard = () => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                        <IconifyIcon icon="solar:delivery-bold-duotone" className="fs-32 text-primary" />
                    </div>
                    <Button variant="primary" size="sm">
                        Track Order
                    </Button>
                </div>
                <div className="d-flex flex-wrap align-items-center justify-content-between mt-5 pt-1">
                    <div>
                        <p className="fs-15 fw-medium mb-0 text-muted mb-1">Estimated Arrival</p>
                        <p className="text-dark fw-semibold mb-0 fs-16">9 July 2024</p>
                    </div>
                    <div>
                        <p className="fs-15 fw-medium mb-0 text-muted mb-1">Tracker ID</p>
                        <p className="text-dark fw-semibold mb-0 fs-16">#TR73647</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

const MasterCard = () => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded  flex-shrink-0">
                        <img src={masterCardImg} alt="Card Img" className="img-fluid" />
                    </div>
                    <div>
                        <p className="text-dark fw-medium fs-16 mb-1">Master Card</p>
                        <p className="mb-0">**** **** **** 3541 </p>
                    </div>
                    <div className="ms-auto">
                        <span className="badge bg-success-subtle rounded-pill text-success border border-success fs-11 py-1 px-2  my-2">Paid</span>
                    </div>
                </div>
                <div className="d-flex flex-wrap align-items-center justify-content-between mt-5 pt-1">
                    <div>
                        <p className="fs-15 fw-medium mb-0 text-muted mb-1">Transaction ID</p>
                        <p className="text-dark fw-semibold mb-0 fs-16">TR626788-MR</p>
                    </div>
                    <div>
                        <p className="fs-15 fw-medium mb-0 text-muted mb-1">Payment Method</p>
                        <p className="text-dark fw-semibold mb-0 fs-16">Master Card</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

const DeliverDriverCard = () => {
    return (
        <Card>
            <CardBody>
                <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                    <IconifyIcon icon="solar:scooter-bold-duotone" className="fs-32 text-primary" />
                </div>
                <p className="my-3 text-dark fs-20 text-dark fw-medium">Be patient, package on deliver!</p>
                <div className="d-flex flex-wrap align-items-center mt-3 mb-2 justify-content-between gap-2">
                    <div>
                        <span className="badge bg-light-subtle rounded-pill text-dark border fs-13 fw-medium py-1 px-2 d-flex align-items-center gap-1">
                            <IconifyIcon icon="tabler:plane-tilt" className="text-warning" /> 613 Kuhl Avenue
                        </span>
                    </div>
                    <IconifyIcon icon="tabler:arrow-narrow-right" className="fs-18 text-muted" />
                    <div>
                        <span className="badge bg-light-subtle rounded-pill text-dark border fs-13 fw-medium py-1 px-2 d-flex align-items-center gap-1">
                            <IconifyIcon icon="solar:map-point-bold-duotone" className="fs-18 text-warning" /> 1890 Uitsig St Grahamstad USA
                        </span>
                    </div>
                </div>
                <div
                    className="progress flex-grow-1"
                    role="progressbar"
                    aria-label="Basic example"
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ height: 10 }}
                >
                    <div className="progress-bar bg-warning rounded progress-bar-striped progress-bar-animated" style={{ width: '90%' }} />
                </div>
            </CardBody>
        </Card>
    );
};

const OrderDetailsCard = () => {
    return (
        <>
            <Col xl={3} lg={6}>
                <TrackOrderCard />
            </Col>
            <Col xl={3} lg={6}>
                <MasterCard />
            </Col>
            <Col xl={6} lg={12}>
                <DeliverDriverCard />
            </Col>
        </>
    );
};

export default OrderDetailsCard;
