import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import discoverCardImg from '@/images/cards/discover-white.svg';
import visaCardImg from '@/images/cards/visa-white.svg';
import { Link } from '@inertiajs/react';
import { Card, CardBody, Carousel, CarouselItem, Col, Row } from 'react-bootstrap';

const BalanceCard = () => {
    return (
        <Card>
            <CardBody className="product-slider">
                <Carousel controls={false} id="carouselExampleIndicators" className="slide carousel-dark" data-bs-ride="carousel">
                    <CarouselItem>
                        <Card className="bg-primary shadow-none rounded-4">
                            <CardBody>
                                <span className="float-end text-white-50 display-5 mt-n1">
                                    <IconifyIcon icon="tabler:wifi" />
                                </span>
                                <h4 className="text-white">Mr. Dhanoo K</h4>
                                <Row className="align-items-center mt-4">
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-16 fw-bold">
                                        <span>1</span>
                                        <span>0</span>
                                        <span>0</span>
                                        <span>1</span>
                                    </Col>
                                </Row>
                                <Row className="mt-4 align-items-center">
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">Expiry Date</p>
                                        <h5 className="text-white my-0">10/32</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">CVV</p>
                                        <h5 className="text-white my-0">XXX</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <img src={visaCardImg} alt="visaCardImg" height={20} className="me-1" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h5 className="text-muted">Balance:</h5>
                                <h4 className="fs-18">
                                    {currency}38562.25 <small className="text-muted">USD</small>
                                </h4>
                            </div>
                            <Link href="" className="link-reset text-decoration-underline link-offset-2 fw-semibold pb-2">
                                View Details
                            </Link>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <Card className="bg-success rounded-4">
                            <CardBody>
                                <span className="float-end text-white-50 display-5 mt-n1">
                                    <i className="ti ti-wifi" />
                                </span>
                                <h4 className="text-white">Mr. Dhanoo K</h4>
                                <Row className="align-items-center mt-4">
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-16 fw-bold">
                                        <span>1</span>
                                        <span>0</span>
                                        <span>0</span>
                                        <span>1</span>
                                    </Col>
                                </Row>
                                <Row className="mt-4 align-items-center">
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">Expiry Date</p>
                                        <h5 className="text-white my-0">10/32</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">CVV</p>
                                        <h5 className="text-white my-0">000</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <img src={discoverCardImg} alt="discoverCardImg" height={16} className="me-1" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h5 className="text-muted">Balance:</h5>
                                <h4 className="fs-18">
                                    {currency}38562.25 <small className="text-muted">USD</small>
                                </h4>
                            </div>
                            <Link href="" className="link-reset text-decoration-underline link-offset-2 fw-semibold pb-2">
                                View Details
                            </Link>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <Card className="bg-secondary rounded-4">
                            <CardBody>
                                <span className="float-end text-white-50 display-5 mt-n1">
                                    <i className="ti ti-wifi" />
                                </span>
                                <h4 className="text-white">Mr. Dhanoo K</h4>
                                <Row className="align-items-center mt-4">
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-10">
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                        <IconifyIcon icon="tabler:circle-filled" />
                                    </Col>
                                    <Col xs={3} className="text-white fs-16 fw-bold">
                                        <span>1</span>
                                        <span>0</span>
                                        <span>0</span>
                                        <span>1</span>
                                    </Col>
                                </Row>
                                <Row className="mt-4 align-items-center">
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">Expiry Date</p>
                                        <h5 className="text-white my-0">10/32</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <p className="text-white-50 mb-1">CVV</p>
                                        <h5 className="text-white my-0">000</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <img src={visaCardImg} alt="visaCardImg" height={20} className="me-1" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h5 className="text-muted">Balance:</h5>
                                <h4 className="fs-18">
                                    {currency}38562.25 <small className="text-muted">USD</small>
                                </h4>
                            </div>
                            <Link href="" className="link-reset text-decoration-underline link-offset-2 fw-semibold pb-2">
                                View Details
                            </Link>
                        </div>
                    </CarouselItem>
                </Carousel>
            </CardBody>
        </Card>
    );
};

export default BalanceCard;
