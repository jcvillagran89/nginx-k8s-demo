import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import product10 from '@/images/products/p-10.png';
import product11 from '@/images/products/p-11.png';
import product12 from '@/images/products/p-12.png';
import product3 from '@/images/products/p-3.png';
import product9 from '@/images/products/p-9.png';
import clsx from 'clsx';

import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, Carousel, CarouselItem, Col, Row } from 'react-bootstrap';

const ProductDetails = () => {
    const products = [product3, product9, product10, product11, product12];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const handleThunkSelect = (index: number) => {
        setActiveIndex(index);
    };

    const [quantity, setQuantity] = useState<number>(1);

    const increment = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        } else {
            setQuantity(1);
        }
    };

    return (
        <>
            <Row>
                <Col xl={5} lg={12}>
                    <Card className="bg-body shadow-none ">
                        <CardBody>
                            <Carousel
                                activeIndex={activeIndex}
                                onSelect={handleSelect}
                                indicators={false}
                                className="slide carousel-fade"
                                data-bs-ride="carousel"
                            >
                                {products.map((item, idx) => (
                                    <CarouselItem className="text-center" key={idx}>
                                        <img src={item} width={500} height={500} alt="product" className="img-fluid bg-body shadow-none rounded" />
                                    </CarouselItem>
                                ))}
                            </Carousel>
                            <div className="carousel-indicators m-0 mt-2 d-lg-flex d-none position-static h-100 rounded gap-1">
                                {products.map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleThunkSelect(idx)}
                                        data-bs-target="#carouselExampleFade"
                                        data-bs-slide-to={0}
                                        aria-label={`Slide ${idx}`}
                                        className={clsx('h-auto rounded bg-light-subtle border', { active: activeIndex === idx })}
                                        style={{ width: 'auto' }}
                                    >
                                        <img src={item} className="d-block avatar-xl" alt="swiper-indicator-img" />
                                    </button>
                                ))}
                            </div>
                        </CardBody>
                        <CardFooter className="p-0 rounded">
                            <div className="bg-dark-gradient shadow text-center p-3 rounded mt-3">
                                <p className="fs-20 fw-semibold text-white mb-1">Enjoy an Additional 20% Discount on Your Purchase</p>
                                <p className="mb-1 text-white-50">On Purchase Of 2+ Style</p>
                                <p className="mb-0 text-white-50">
                                    USE CODE : <span className="text-warning fw-bold">OSEN24</span>
                                </p>
                            </div>
                            <div className="bg-body-secondary shadow rounded p-3 mt-3">
                                <h4 className="mb-3 text-dark">Offer Expires In :</h4>
                                <div className="bg-warning-subtle border border-warning-subtle p-2 rounded">
                                    <Row className="text-xxl-center">
                                        <Col className="border-end border-warning-subtle">
                                            <h3 id="days" className="fw-bold fs-18 text-dark">
                                                10
                                            </h3>
                                            <p className="mb-0">Days</p>
                                        </Col>
                                        <Col className="border-end border-warning-subtle">
                                            <h3 id="hours" className="fw-bold fs-18 text-dark">
                                                09
                                            </h3>
                                            <p className="mb-0">Hours</p>
                                        </Col>
                                        <Col className="border-end border-warning-subtle">
                                            <h3 id="minutes" className="fw-bold fs-18 text-dark">
                                                30
                                            </h3>
                                            <p className="mb-0">Minutes</p>
                                        </Col>
                                        <Col>
                                            <h3 id="seconds" className="fw-bold fs-18 text-dark">
                                                70
                                            </h3>
                                            <p className="mb-0">Seconds</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </CardFooter>
                        <span className="position-absolute top-0 end-0 p-5 pt-0 z-1">
                            <div data-toggler="on">
                                <button type="button" className="btn btn-icon btn-light rounded-circle" data-toggler-on>
                                    <IconifyIcon icon="solar:heart-angle-bold-duotone" className="fs-22 text-danger" />
                                </button>
                                <button type="button" className="btn btn-icon btn-light rounded-circle d-none" data-toggler-off>
                                    <IconifyIcon icon="solar:heart-angle-bold-duotone" className="fs-22" data-toggler-off />
                                </button>
                            </div>
                        </span>
                        <span className="position-absolute top-0 start-0 p-5 pt-2 z-1">
                            <span className="badge bg-danger fs-14">On Deal</span>
                        </span>
                    </Card>
                </Col>
                <Col xl={7} lg={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="badge bg-success-subtle text-success px-2 py-1 fs-13 rounded-pill">New</span>
                                </div>
                                <div className="flex-grow-1 d-inline-flex align-items-center justify-content-end fs-16">
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    <span className="ms-1 fs-14">23k Reviews </span>
                                </div>
                            </div>
                            <div className="mt-3 mb-1">
                                <Link href="" className="text-dark fs-20 fw-medium">
                                    Minetta Rattan Swivel Luxury Green Premium Lounge Chair
                                </Link>
                            </div>
                            <p className="text-muted fw-medium fs-14 mb-1">
                                <span className="text-dark">Menufechar : </span> Premium Furniture
                            </p>
                            <p className="text-muted fw-medium fs-14 mb-1">
                                <span className="text-dark">Article : </span> CR63541
                            </p>
                            <p className="text-muted fw-medium fs-14 mb-1">
                                <span className="text-dark">Sold Items : </span> 76k
                            </p>
                            <p className="text-muted fw-medium fs-14 mb-0">
                                <span className="text-dark">Product Code : </span> CD4671CR
                            </p>
                            <h2 className="my-4 fw-bold text-dark">
                                {currency}300.00 <span className="text-muted fs-14 fw-medium">/ 20% Off</span>
                            </h2>
                            <div
                                className="d-flex flex-wrap align-items-center gap-2 mt-3 mb-2"
                                role="group"
                                aria-label="Basic checkbox toggle button group"
                            >
                                <p className="mb-0 text-dark fw-semibold fs-15">Colors : </p>
                                <input type="checkbox" className="btn-check" id="color-dark2" />
                                <label
                                    className="btn avatar btn-icon rounded-circle d-flex justify-content-center align-items-center"
                                    htmlFor="color-dark2"
                                >
                                    {' '}
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-28 border rounded-circle text-success" />
                                </label>
                                <input type="checkbox" className="btn-check" id="color-yellow2" />
                                <label
                                    className="btn avatar btn-icon rounded-circle d-flex justify-content-center align-items-center"
                                    htmlFor="color-yellow2"
                                >
                                    {' '}
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-28 border rounded-circle text-warning" />
                                </label>
                                <input type="checkbox" className="btn-check" id="color-white2" />
                                <label
                                    className="btn avatar btn-icon rounded-circle d-flex justify-content-center align-items-center"
                                    htmlFor="color-white2"
                                >
                                    {' '}
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-28 border rounded-circle text-primary" />
                                </label>
                                <input type="checkbox" className="btn-check" id="color-info" defaultChecked />
                                <label
                                    className="btn avatar btn-icon rounded-circle d-flex justify-content-center align-items-center"
                                    htmlFor="color-info"
                                >
                                    {' '}
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-28 border rounded-circle text-info" />
                                </label>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-2 my-3">
                                <p className="mb-0 text-dark fw-semibold fs-15">Stock : </p>
                                <div>
                                    <p className="text-success mb-0 fw-semibold fs-15">
                                        <IconifyIcon icon="tabler:checks" /> In Stock
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-2 my-3">
                                <p className="mb-0 text-dark fw-semibold fs-15">Quantity : </p>
                                <div
                                    data-touchspin
                                    className="input-step border bg-body-secondary p-1 mt-1 rounded-pill d-inline-flex overflow-visible"
                                >
                                    <button
                                        type="button"
                                        onClick={decrement}
                                        className="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        className="text-dark text-center border-0 bg-body-secondary rounded h-100"
                                        min={0}
                                        max={100}
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        onClick={increment}
                                        className="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <h4 className="text-dark fw-medium">Description :</h4>
                            <p className="mb-1">
                                Bring Axis home and watch life revolve around it. This 2-seat sofa offers exceptional durability for family rooms and
                                casual living rooms, featuring track arms that create a clean look. Low back cushions and deep seats encourage
                                lounging with family and friends.
                            </p>
                            <p className="mb-1">
                                An exceptional occasional chair with slim arm rests, styled with a reclined back for supreme comfort. The metal tipped
                                flaring legs add a decorative flourish to this elegant classic. Also available with a quilted fabric back (60-0775)
                            </p>
                            <Link href="" className="link-primary">
                                Read More...
                            </Link>
                            <h4 className="text-dark fw-medium mt-3">Details :</h4>
                            <ul className="d-flex flex-column gap-1 fs-14 mb-0">
                                <li>Doweled mortise and tenon frame in solid Mahogany from certified source.</li>
                                <li>Solid certified Mahogany.</li>
                                <li>Available in a selection of finishes.</li>
                                <li>Tight seat undersupport with high-density upholstery fill.</li>
                            </ul>
                            <h4 className="text-dark fw-medium mt-3 mb-2 pb-1">Additional Information :</h4>
                            <div className="border border-dashed p-2 rounded text-center">
                                <Row>
                                    <Col lg={3} xs={4} className="border-end">
                                        <p className="text-muted fw-medium fs-14 mb-0">
                                            <span className="text-dark">Arm Width : </span> 54 cm
                                        </p>
                                    </Col>
                                    <Col lg={3} xs={4} className="border-end">
                                        <p className="text-muted fw-medium fs-14 mb-0">
                                            <span className="text-dark">Seat Width : </span> 67 cm
                                        </p>
                                    </Col>
                                    <Col lg={3} xs={4} className="border-end">
                                        <p className="text-muted fw-medium fs-14 mb-0">
                                            <span className="text-dark">Seat Depth : </span> 54 cm
                                        </p>
                                    </Col>
                                    <Col lg={3} xs={4} className="border-end">
                                        <p className="text-muted fw-medium fs-14 mb-0">
                                            <span className="text-dark">Seat Height : </span> 40 cm
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                        <CardFooter className="border-top border-dashed">
                            <Row className="g-2">
                                <Col lg={3}>
                                    <Button variant="primary" className="w-100 d-flex align-items-center gap-1">
                                        <IconifyIcon icon="solar:cart-large-2-bold" className="fs-16 align-middle" /> Add to Bag
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant="success" className="w-100 d-flex align-items-center gap-1">
                                        <IconifyIcon icon="solar:bag-check-bold" className="fs-16 align-middle" /> Buy Now
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant="outline-danger" className="w-75 d-flex align-items-center gap-1">
                                        <IconifyIcon icon="solar:heart-bold" className="fs-16 align-middle" /> Wishlist
                                    </Button>
                                </Col>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductDetails;
