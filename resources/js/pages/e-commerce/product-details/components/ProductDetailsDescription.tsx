import IconifyIcon from '@/components/wrappers/IconifyIcon';
import product10 from '@/images/products/p-10.png';
import product11 from '@/images/products/p-11.png';
import product12 from '@/images/products/p-12.png';
import product3 from '@/images/products/p-3.png';

import { Link } from '@inertiajs/react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Nav,
    NavItem,
    NavLink,
    ProgressBar,
    Row,
    TabContainer,
    TabContent,
    TabPane,
} from 'react-bootstrap';
import { productRatingData, shopOffersData, shopProductRating, shopRatingData } from '../data';

const ProductDetailsDescription = () => {
    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <TabContainer defaultActiveKey={1}>
                            <CardHeader className="p-0">
                                <Nav className="nav nav-tabs nav-bordered">
                                    <NavItem className="nav-item px-3">
                                        <NavLink
                                            eventKey={1}
                                            href="#description"
                                            data-bs-toggle="tab"
                                            aria-expanded="false"
                                            className="nav-link py-2"
                                        >
                                            <span className="d-block d-sm-none">
                                                <IconifyIcon icon="solar:notebook-bold" className="fs-20" />
                                            </span>
                                            <span className="d-none d-sm-block">
                                                <IconifyIcon icon="solar:notebook-bold" className="fs-14 me-1 align-middle" /> Description
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item px-3">
                                        <NavLink eventKey={2} href="#review" data-bs-toggle="tab" aria-expanded="true" className="nav-link py-2">
                                            <span className="d-block d-sm-none">
                                                <IconifyIcon icon="solar:chat-dots-bold" className="fs-20" />
                                            </span>
                                            <span className="d-none d-sm-block">
                                                <IconifyIcon icon="solar:chat-dots-bold" className="fs-14 me-1 align-middle" /> Review
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item px-3">
                                        <NavLink
                                            eventKey={3}
                                            href="#offer-warranty"
                                            data-bs-toggle="tab"
                                            aria-expanded="false"
                                            className="nav-link py-2"
                                        >
                                            <span className="d-block d-sm-none">
                                                <IconifyIcon icon="solar:ticket-sale-bold" className="fs-20" />
                                            </span>
                                            <span className="d-none d-sm-block">
                                                <IconifyIcon icon="solar:ticket-sale-bold" className="fs-14 me-1 align-middle" /> Offers &amp;
                                                Warranty
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody>
                                <TabContent className="tab-content ">
                                    <TabPane eventKey={1} className="tab-pane" id="description">
                                        <Row>
                                            <Col lg={6}>
                                                <p>
                                                    Modern designer chair with a frame made of a metal profile. The minimalist style will work in any
                                                    modern and loft interior. The furniture is characterized by high durability and solid workmanship,
                                                    so you can be sure that it will serve you for many years.
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="g-4">
                                            <Col lg={6}>
                                                <CardTitle as={'h4'} className="my-2">
                                                    Dimension :
                                                </CardTitle>
                                                <div className="table-responsive">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Width : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">54 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Length : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">50 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Seat Width : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">67 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Seat Length : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">65 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Seat Height : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">40 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Backrest Height : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">50 cm</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">
                                                                        Armrest Height From THe Ground :{' '}
                                                                    </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">58 cm</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Col>
                                            <Col lg={6}>
                                                <CardTitle as={'h4'} className="my-2">
                                                    Material :
                                                </CardTitle>
                                                <div className="table-responsive">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Material Seat : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">Velor Fabric</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Material Base : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">Steel Powder Coated</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <CardTitle as={'h4'} className="mb-1 mt-3">
                                                    Colors :
                                                </CardTitle>
                                                <div className="table-responsive">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Seat Color : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">Sky Blue</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-0">
                                                                    <p className="d-flex mb-0 align-items-center gap-1">Base Color : </p>
                                                                </td>
                                                                <td className="text-end text-dark fw-medium px-0">Wooden Brown</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane eventKey={2} className="tab-pane" id="review">
                                        <Row className="g-2">
                                            <Col xl={6} lg={12}>
                                                <div className="pe-lg-3">
                                                    <CardTitle as={'h4'}>
                                                        <IconifyIcon icon="solar:box-bold-duotone" /> Product Rating
                                                    </CardTitle>
                                                    <Row className="align-items-center text-center my-4">
                                                        <Col lg={4}>
                                                            <h2 className="text-dark fw-semibold d-flex align-items-center gap-1 justify-content-center">
                                                                4.5 <IconifyIcon icon="solar:star-bold" className="text-warning" />
                                                            </h2>
                                                            <p className="mb-0 fs-5">Best Review</p>
                                                        </Col>
                                                        <Col lg={8}>
                                                            {productRatingData.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`d-flex align-items-center gap-3 ${productRatingData.length - 1 != idx ? `${idx != 0 && 'my-3'}` : 'mt-3'} `}
                                                                >
                                                                    <h5 className="mb-0 flex-shrink-0">{item.star} star :</h5>
                                                                    <ProgressBar
                                                                        style={{ height: 10 }}
                                                                        now={item.length}
                                                                        variant="warning"
                                                                        className="flex-grow-1 rounded "
                                                                        role="progressbar"
                                                                    ></ProgressBar>
                                                                    <h5 className="mb-0 flex-shrink-0">{item.count}</h5>
                                                                </div>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                    <CardTitle as={'h4'} className="mb-3">
                                                        Customer Upload Photos :
                                                    </CardTitle>
                                                    <div className="d-flex flex-wrap align-items-center gap-2 text-center">
                                                        <div>
                                                            <Link href="">
                                                                <img
                                                                    src={product3}
                                                                    alt="product"
                                                                    className="avatar-xl bg-light-subtle rounded border"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <Link href="">
                                                                <img
                                                                    src={product12}
                                                                    alt="product"
                                                                    className="avatar-xl bg-light-subtle rounded border"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <Link href="">
                                                                <img
                                                                    src={product11}
                                                                    alt="product"
                                                                    className="avatar-xl bg-light-subtle rounded border"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <Link href="">
                                                                <img
                                                                    src={product10}
                                                                    alt="product"
                                                                    className="avatar-xl bg-light-subtle rounded border"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="avatar-xl bg-light rounded border d-flex justify-content-center align-items-center">
                                                            <Link href="" className="fs-16 fw-semibold text-dark">
                                                                44+
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex  align-items-center justify-content-between mt-4 mb-3">
                                                        <CardTitle as={'h4'}>Customer Reviews (2567) :</CardTitle>
                                                        <div>
                                                            <Link href="" className="link-primary fw-medium text-decoration-underline">
                                                                View All
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <div className="d-flex gap-3">
                                                                <div>
                                                                    <span className="badge bg-warning-subtle text-dark py-1 px-2 fs-14 d-flex align-items-center justify-content-center gap-1 mb-2">
                                                                        4.5 <IconifyIcon icon="solar:star-bold" className="text-warning fs-16" />
                                                                    </span>
                                                                    <Link href="">
                                                                        <img
                                                                            src={product10}
                                                                            alt="product"
                                                                            className="avatar-xl bg-light-subtle rounded border"
                                                                        />
                                                                    </Link>
                                                                </div>
                                                                <div>
                                                                    <p className="fs-15 d-flex gap-2 fw-semibold">
                                                                        Ruth L. Garner<span className="text-muted fs-14 fw-normal">|</span>
                                                                        <span className="text-muted fs-14 fw-normal">11 November 2023</span>
                                                                    </p>
                                                                    <p className="mb-0">
                                                                        The design of the chair is sleek and modern, fitting perfectly with the
                                                                        aesthetic of my home office. The black mesh backrest not only looks stylish
                                                                        but also provides excellent reachability, preventing any discomfort during
                                                                        long working hours.{' '}
                                                                    </p>
                                                                    <div className="d-flex align-items-center gap-2 mt-2 mb-1">
                                                                        <ul className="d-flex text-warning m-0 fs-18 list-unstyled">
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-half-filled" />
                                                                            </li>
                                                                        </ul>
                                                                        <p className="fw-medium mb-0 text-dark fs-14">4.5 / 5 Best Review</p>
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <Link href="" className="fs-14 me-3 link-reset">
                                                                            <IconifyIcon icon="tabler:thumb-up" className="fs-18" /> 2543
                                                                        </Link>
                                                                        <Link href="" className="fs-14 me-3 link-reset">
                                                                            <IconifyIcon icon="tabler:thumb-down" className="fs-18" /> 129
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr className="my-3" />
                                                            <div className="d-flex gap-3">
                                                                <div>
                                                                    <span className="badge bg-warning-subtle text-dark py-1 px-2 fs-14 d-flex align-items-center justify-content-center gap-1 mb-2">
                                                                        4.2 <IconifyIcon icon="solar:star-bold" className="text-warning fs-16" />
                                                                    </span>
                                                                    <Link href="">
                                                                        <img
                                                                            src={product10}
                                                                            alt="product"
                                                                            className="avatar-xl bg-light-subtle rounded border d-none"
                                                                        />
                                                                    </Link>
                                                                </div>
                                                                <div>
                                                                    <p className="fs-15 d-flex gap-2 fw-semibold">
                                                                        Michelle M. Kellerman<span className="text-muted fs-14 fw-normal">|</span>
                                                                        <span className="text-muted fs-14 fw-normal">20 March 2024</span>
                                                                    </p>
                                                                    <p className="mb-0">
                                                                        One of the standout features of this chair is its adjustability. The chair
                                                                        offers a wide range of adjustments, including seat height, armrest height, and
                                                                        tilt tension. The lumbar support can be easily adjusted to fit the natural
                                                                        curve
                                                                    </p>
                                                                    <div className="d-flex align-items-center gap-2 mt-2 mb-1">
                                                                        <ul className="d-flex text-warning m-0 fs-18 list-unstyled">
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-filled" />
                                                                            </li>
                                                                            <li>
                                                                                <IconifyIcon icon="tabler:star-half-filled" />
                                                                            </li>
                                                                        </ul>
                                                                        <p className="fw-medium mb-0 text-dark fs-14">4.2 / 5 Best Review</p>
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <Link href="" className="fs-14 me-3 link-reset">
                                                                            <IconifyIcon icon="tabler:thumb-up" className="fs-18" /> 1323
                                                                        </Link>
                                                                        <Link href="" className="fs-14 me-3 link-reset">
                                                                            <IconifyIcon icon="tabler:thumb-down" className="fs-18" /> 34
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col xl={6} lg={12} className="border-start">
                                                <div className="ps-lg-3">
                                                    <CardTitle as={'h4'}>
                                                        <IconifyIcon icon="solar:shop-2-bold" /> Shop Rating
                                                    </CardTitle>
                                                    <Row className="align-items-center text-center my-4">
                                                        <Col lg={4}>
                                                            <h2 className="text-dark fw-semibold d-flex align-items-center gap-1 justify-content-center">
                                                                4.2 <IconifyIcon icon="solar:star-bold" className="text-warning" />
                                                            </h2>
                                                            <p className="mb-0 fs-5">Best Review</p>
                                                        </Col>
                                                        <Col lg={8}>
                                                            {shopRatingData.map((item, idx) => (
                                                                <div
                                                                    className={`d-flex align-items-center gap-3 ${productRatingData.length - 1 != idx ? `${idx != 0 && 'my-3'}` : 'mt-3'} `}
                                                                    key={idx}
                                                                >
                                                                    <h5 className="mb-0 flex-shrink-0">{item.star} star :</h5>
                                                                    <ProgressBar
                                                                        className="rounded flex-grow-1"
                                                                        style={{ height: 10 }}
                                                                        now={item.length}
                                                                        variant="warning"
                                                                        role="progressbar"
                                                                    ></ProgressBar>
                                                                    <h5 className="mb-0 flex-shrink-0">{item.count}</h5>
                                                                </div>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                    <CardTitle as={'h4'}>Shop Product Rating :</CardTitle>
                                                    <Row className="mt-3 text-center g-2">
                                                        {shopProductRating.map((item, idx) => (
                                                            <Col lg={4} key={idx}>
                                                                <img src={item.image} alt="product" className="img-fluid border rounded" />
                                                                <div className="d-flex align-items-center justify-content-center gap-2 mt-2 mb-1">
                                                                    <ul className="d-flex text-warning m-0 fs-18 list-unstyled">
                                                                        {Array(Math.floor(item.rating))
                                                                            .fill(0)
                                                                            .map((_star, idx) => (
                                                                                <li className="icons-center" key={idx}>
                                                                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                                                                </li>
                                                                            ))}
                                                                        {!Number.isInteger(item.rating) && (
                                                                            <li className="icons-center">
                                                                                <IconifyIcon
                                                                                    icon="tabler:star-half-filled"
                                                                                    className="text-warning"
                                                                                />{' '}
                                                                            </li>
                                                                        )}
                                                                        {item.rating < 5 &&
                                                                            Array(5 - Math.ceil(item.rating))
                                                                                .fill(0)
                                                                                .map((_star, idx) => (
                                                                                    <li className="icons-center" key={idx}>
                                                                                        <IconifyIcon icon="tabler:star" className="text-warning" />
                                                                                    </li>
                                                                                ))}
                                                                    </ul>
                                                                    <p className="fw-medium mb-0 text-dark fs-14">{item.rating} / 5</p>
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane eventKey={3} className="tab-pane" id="offer-warranty">
                                        <CardTitle as={'h4'}>Available Offers : </CardTitle>
                                        <Row className="mt-3 g-2">
                                            <Col lg={6}>
                                                <div className="border rounded p-2 text-center">
                                                    <p className="fw-semibold text-dark fs-20 my-1">
                                                        To Get This Price , Use Code : <span className="text-primary fw-semibold">WINTER2024</span>
                                                    </p>
                                                    <p className="fs-15 text-muted fw-medium">Fast &amp; Free Delivery</p>
                                                    <Button variant="primary">Show Offers</Button>
                                                </div>
                                            </Col>
                                            <Col lg={6}>
                                                <div className="border rounded p-2 text-center">
                                                    <p className="fw-semibold text-dark fs-20 my-1">
                                                        Enjoy an Additional 20% Discount on Your Purchase :{' '}
                                                        <span className="text-primary fw-semibold">OSEN24</span>
                                                    </p>
                                                    <p className="fs-15 text-muted fw-medium">Fast &amp; Free Delivery</p>
                                                    <Button variant="primary">Show Offers</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <CardTitle as={'h4'} className="my-3">
                                            Shop Offers :{' '}
                                        </CardTitle>
                                        <Row className="g-3">
                                            {shopOffersData.map((item, idx) => (
                                                <Col lg={3} key={idx}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                                                            <IconifyIcon icon={item.icon} className="fs-28 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-dark fw-medium fs-16 mb-0">{item.title}</p>
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                        <div className="alert alert-success d-flex align-items-center mt-4 mb-0" role="alert">
                                            <IconifyIcon icon="solar:shield-check-bold" className="fs-20 me-1" />
                                            <div className="lh-1">
                                                <strong>3 Years - </strong>Guaranteed Product Global Warranty
                                            </div>
                                        </div>
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </TabContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductDetailsDescription;
