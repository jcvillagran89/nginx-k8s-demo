import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import digitalOceanImg from '@/images/brands/digital-ocean.svg';

import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import OrderDetailsCard from './components/OrderDetailsCard';
import { orderItemData } from './data';

const OrderCard = () => {
    return (
        <Card>
            <CardBody>
                <Row className="align-items-start justify-content-between">
                    <Col lg={5}>
                        <p className="text-dark fw-medium fs-15 d-flex align-items-center gap-1 mb-2">
                            <IconifyIcon icon="solar:box-bold-duotone" className="text-danger" />
                            Order
                            <IconifyIcon icon="tabler:arrow-right" />
                            <span className="badge bg-light-subtle rounded-pill text-dark border fs-12 py-1 px-2">#OC3142-EN</span>
                        </p>
                        <h3 className="mb-1 text-dark fw-semibold">
                            Order ID : #OC3142-EN{' '}
                            <span className="badge bg-warning-subtle rounded-pill text-warning border border-warning fs-11 py-1 px-2 my-2">
                                Shipping
                            </span>{' '}
                            <span className="badge bg-success-subtle rounded-pill text-success border border-success fs-11 py-1 px-2  my-2">
                                {' '}
                                No Action Needed
                            </span>
                        </h3>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <p className="mb-0 fs-15">Order Date : 2 July 2024</p>
                            <div>|</div>
                            <div>
                                <p className="mb-0 fs-15 text-success fw-medium  d-flex align-items-center gap-1">
                                    <IconifyIcon icon="tabler:plane-tilt" />
                                    Estimated delivery: July 9, 2024
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} className="text-end">
                        <div className="d-flex gap-2 flex-wrap justify-content-end my-2">
                            <Button variant="soft-primary">Invoice</Button>
                            <Button variant="primary">Edit Details</Button>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const TimelineCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom">
                <CardTitle as={'h5'} className="mb-0">
                    Timeline
                </CardTitle>
            </CardHeader>
            <CardBody>
                <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-1 fs-14 fw-medium">4 July (Now)</p>
                                    <p className="mb-0 fs-14 fw-medium">06:00</p>
                                </td>
                                <td className="fs-14 fw-medium">
                                    <p className="mb-1 fs-14 fw-medium">Your package is packed by the courier</p>
                                    <p className="mb-0 fs-14 fw-medium text-muted">613 Kuhl Avenue Jennifer Lane</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-1 fs-14 fw-medium text-muted">2 July</p>
                                    <p className="mb-0 fs-14 fw-medium text-muted">10:00</p>
                                </td>
                                <td>
                                    <p className="mb-1 fs-14 fw-medium text-muted">Shipment has been created</p>
                                    <p className="mb-0 fs-14 fw-medium text-muted">613 Kuhl Avenue</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-1 fs-14 fw-medium text-muted">2 July</p>
                                    <p className="mb-0 fs-14 fw-medium text-muted">04:00</p>
                                </td>
                                <td>
                                    <p className="mb-1 fs-14 fw-medium text-muted">Order Placed</p>
                                    <p className="mb-0 fs-14 fw-medium text-muted">
                                        Coderthemes <IconifyIcon icon="solar:verified-check-bold" className="align-middle text-success" />
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
};

const ShipmentCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom">
                <CardTitle as={'h5'} className="mb-0">
                    Shipment &amp; Details
                </CardTitle>
            </CardHeader>
            <CardBody>
                <div className="d-flex align-items-center gap-2">
                    <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                        <img src={digitalOceanImg} alt="digitalOceanImg" className="avatar-md" />
                    </div>
                    <div>
                        <p className="text-dark fw-medium fs-16 mb-1">American Franklin Simon</p>
                        <p className="mb-0">dhanookapns142@armyspy.com </p>
                    </div>
                </div>
                <Row className="justify-content-between my-3">
                    <Col lg={5}>
                        <p className="fs-15 mb-1">Recipient</p>
                        <p className="fw-semibold text-dark fs-15 mb-0">Dhanoo K.</p>
                    </Col>
                    <Col lg={7}>
                        <p className="fs-15 mb-1">Delivery Address</p>
                        <p className="fw-semibold text-dark fs-15 mb-0">1890 Uitsig Grahamstad USA</p>
                    </Col>
                </Row>
                <Row className="justify-content-between mt-4">
                    <Col lg={5}>
                        <p className="fs-15 mb-1">Phone Number</p>
                        <p className="fw-semibold text-dark fs-15 mb-0">+ 727-456-6512</p>
                    </Col>
                    <Col lg={7}>
                        <p className="fs-15 mb-1">Payment ID</p>
                        <span className="badge bg-light-subtle rounded-pill text-dark border fs-13 fw-medium py-1 px-2 ">
                            #PY26356-NT{' '}
                            <Link href="" className="ms-1">
                                <IconifyIcon icon="tabler:copy" />
                            </Link>
                        </span>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const MapCard = () => {
    return (
        <Card>
            <CardBody>
                <div className="mapouter">
                    <div className="gmap_canvas">
                        <iframe
                            className="gmap_iframe rounded"
                            width="100%"
                            style={{ height: 264 }}
                            frameBorder={0}
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?width=1980&height=400&hl=en&q=University of Oxford&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

const OrderItemsCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom">
                <CardTitle as={'h5'} className="mb-0">
                    Order Items
                </CardTitle>
            </CardHeader>
            <CardBody>
                <Row className="g-3">
                    {orderItemData.map((item, idx) => (
                        <Col lg={6} key={idx}>
                            <div className="d-flex align-items-center border border-dashed rounded p-2 gap-3">
                                <div className="rounded bg-light avatar-xl d-flex align-items-center justify-content-center">
                                    <img src={item.image} alt="product" className="avatar-xl" />
                                </div>
                                <div>
                                    <Link href="" className="text-dark fw-medium fs-15">
                                        {item.title}
                                    </Link>
                                    <p className="text-muted fw-medium fs-14 my-1">
                                        <span className="text-dark">Price : </span> ${item.price}
                                    </p>
                                    <p className="text-muted fw-medium fs-14 my-1">
                                        <span className="text-dark">Size : </span>
                                        {item.size}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

const SummaryCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom">
                <CardTitle as={'h5'} className="mb-0">
                    Purchase Summary
                </CardTitle>
            </CardHeader>
            <CardBody>
                <div className="table-responsive">
                    <table className="table mb-0 table-borderless">
                        <tbody>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-0 fs-15 fw-medium"> Sub Total : </p>
                                </td>
                                <td className="text-end text-dark fs-14 fw-medium px-0">{currency}1001.8</td>
                            </tr>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-0 fs-15 fw-medium">Discount : </p>
                                </td>
                                <td className="text-end text-dark fs-14 fw-medium px-0">-{currency}120.00</td>
                            </tr>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-0 fs-15 fw-medium">Delivery Charge : </p>
                                </td>
                                <td className="text-end text-success fs-14 fw-medium px-0">Free</td>
                            </tr>
                            <tr>
                                <td className="px-0">
                                    <p className="mb-0 fs-15 fw-medium">Estimated Tax (18.5%) : </p>
                                </td>
                                <td className="text-end text-dark fs-14 fw-medium px-0">{currency}30.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardBody>
            <CardFooter className="d-flex align-items-center justify-content-between border-top">
                <div>
                    <p className="fw-medium text-dark mb-0 fs-15">Grand Amount</p>
                </div>
                <div>
                    <p className="fw-medium fs-14 text-dark mb-0">{currency}911.8</p>
                </div>
            </CardFooter>
        </Card>
    );
};

const OrderDetailsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Order Details" subTitle="eCommerce" />
            <Row>
                <Col lg={12}>
                    <OrderCard />
                </Col>
            </Row>
            <Row>
                <OrderDetailsCard />
            </Row>
            <Row>
                <Col xl={4} lg={6}>
                    <TimelineCard />
                </Col>
                <Col xl={4} lg={6}>
                    <ShipmentCard />
                </Col>
                <Col xl={4} lg={12}>
                    <MapCard />
                </Col>
            </Row>
            <Row>
                <Col xl={8} lg={12}>
                    <OrderItemsCard />
                </Col>
                <Col xl={4} lg={12}>
                    <SummaryCard />
                </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 text-end mb-3">
                <Button variant="primary">Contact To Seller</Button>
                <Button variant="outline-primary">Invoice</Button>
            </div>
        </MainLayout>
    );
};

export default OrderDetailsPage;
