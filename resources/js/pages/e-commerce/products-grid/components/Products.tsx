import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getProducts } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import useToggle from '@/hooks/useToggle';
import { ProductType } from '@/types/data';

import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';

const ProductCard = ({ productName, name, size, rating, discountPrice, price, isDeal, isSeal, image }: ProductType) => {
    const { isTrue, toggle } = useToggle();
    return (
        <Card>
            <img src={image} alt="product images" className="img-fluid" />
            <CardBody className="border-top border-dashed">
                <h5 className="text-primary fw-medium">{productName}</h5>
                <div>
                    <Link href="" className="fw-semibold fs-16 text-dark">
                        {name}
                    </Link>
                </div>
                <h5 className="my-1">{size}</h5>
                <div className="flex-grow-1 d-inline-flex align-items-center fs-16 mt-1">
                    {Array(Math.floor(rating.star))
                        .fill(0)
                        .map((_star, idx) => (
                            <li className="icons-center " key={idx}>
                                <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                            </li>
                        ))}
                    {!Number.isInteger(rating.star) && (
                        <li className="icons-center">
                            <IconifyIcon icon="tabler:star-half" className="text-warning" />{' '}
                        </li>
                    )}
                    {rating.star < 5 &&
                        Array(5 - Math.ceil(rating.star))
                            .fill(0)
                            .map((_star, idx) => (
                                <li className="icons-center" key={idx}>
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                </li>
                            ))}
                    <span className="ms-1 fs-14">{rating.review}k Reviews </span>
                </div>
            </CardBody>
            <CardFooter className="d-flex flex-wrap align-items-center justify-content-between border-top border-dashed">
                <h4 className="fw-semibold text-danger d-flex align-items-center gap-2 mb-0">
                    <span className="text-muted text-decoration-line-through">${price}</span> ${discountPrice}
                </h4>
                <Button variant="soft-primary" className="px-2 fs-20">
                    <IconifyIcon icon="solar:cart-3-bold-duotone" />
                </Button>
            </CardFooter>
            <span className="position-absolute top-0 end-0 p-2">
                <div data-toggler="on" onClick={toggle}>
                    {isTrue ? (
                        <button type="button" className="btn btn-icon btn-light rounded-circle" data-toggler-on>
                            <IconifyIcon icon="solar:heart-angle-bold-duotone" className="fs-22 text-danger" />
                        </button>
                    ) : (
                        <button type="button" className="btn btn-icon btn-light rounded-circle" data-toggler-off>
                            <IconifyIcon icon="solar:heart-angle-bold-duotone" className="fs-22" />
                        </button>
                    )}
                </div>
            </span>
            {isDeal ? (
                <span className="position-absolute top-0 start-0 p-2">
                    <span className="badge bg-danger fs-11">On Deal</span>
                </span>
            ) : isSeal ? (
                <span className="position-absolute top-0 start-0 p-2">
                    <span className="badge bg-danger fs-11">On Seal</span>
                </span>
            ) : (
                ''
            )}
        </Card>
    );
};

const Products = () => {
    const productData = useFetchData(getProducts);
    return (
        <>
            <Row>
                {productData?.slice(0, 8).map((product, idx) => (
                    <Col lg={4} md={6} key={idx}>
                        <ProductCard {...product} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Products;
