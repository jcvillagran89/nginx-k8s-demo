import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Link } from '@inertiajs/react';
import Nouislider from 'nouislider-react';
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { popularBrands, popularCategoriesData, ratingData } from '../data';

const CategoryMenu = () => {
    const [selectedValue, setSelectedValue] = useState([200, 1299]);
    const handleSliderChange = (values: any) => {
        setSelectedValue(values);
    };

    const handleInputChange = (event: any) => {
        if (selectedValue[0] <= Math.round(event.target.value)) {
            setSelectedValue([selectedValue[0], Math.round(event.target.value)]);
        }
    };
    return (
        <>
            <Col xxl={3}>
                <Card>
                    <CardHeader className="border-bottom border-dashed">
                        <CardTitle as={'h4'} className="mb-0">
                            Popular Brands
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="categories-list d-flex flex-column gap-2 mb-2">
                            {popularBrands.map((item, idx) => (
                                <div className="form-check" key={idx}>
                                    <input type="checkbox" id="samsung" className="form-check-input" />
                                    <label htmlFor="samsung" className="form-check-label">
                                        {item.brand}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <Link href="" className="text-primary fw-medium">
                            More <IconifyIcon icon="tabler:arrow-right" className="align-middle" />
                        </Link>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="border-bottom border-dashed">
                        <CardTitle as={'h4'} className="mb-0">
                            Popular Categories
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="categories-list d-flex flex-column gap-2 mb-2">
                            {popularCategoriesData.map((item, idx) => (
                                <div className="d-flex justify-content-between" key={idx}>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="all-categories" />
                                        <label className="form-check-label" htmlFor="all-categories">
                                            {item.title}
                                        </label>
                                    </div>
                                    <div>
                                        <span className="badge bg-primary-subtle text-primary">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="" className="text-primary fw-medium">
                            More <IconifyIcon icon="tabler:arrow-right" className="align-middle" />
                        </Link>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="border-bottom border-dashed">
                        <CardTitle as={'h4'} className="mb-0">
                            Custom Price
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="d-flex flex-column gap-2 mb-3">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="all-price" />
                                <label className="form-check-label" htmlFor="all-price">
                                    All Price
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="price-1" />
                                <label className="form-check-label" htmlFor="price-1">
                                    Below {currency}200 (221)
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="price-2" />
                                <label className="form-check-label" htmlFor="price-2">
                                    {currency}200 - {currency}500 (172)
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="price-3" />
                                <label className="form-check-label" htmlFor="price-3">
                                    {currency}500 - {currency}800 (331)
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="price-4" />
                                <label className="form-check-label" htmlFor="price-4">
                                    {currency}800 - {currency}1000 (455)
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="price-5" />
                                <label className="form-check-label" htmlFor="price-5">
                                    {currency}1000 - {currency}1200 (1290)
                                </label>
                            </div>
                        </div>
                        <div id="product-price-range" />
                        <Nouislider
                            range={{ min: 0, max: 1500 }}
                            start={selectedValue}
                            connect={true}
                            className="product-price-range"
                            onSlide={handleSliderChange}
                        />
                        <div className="formCost d-flex gap-2 align-items-center mt-3">
                            <input
                                className="form-control form-control-sm text-center"
                                type="text"
                                id="minCost"
                                value={selectedValue[0]}
                                onChange={handleInputChange}
                            />
                            <span className="fw-semibold text-muted">to</span>
                            <input
                                className="form-control form-control-sm text-center"
                                type="text"
                                id="maxCost"
                                value={selectedValue[1]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="border-bottom border-dashed">
                        <CardTitle as={'h4'} className="mb-0">
                            Rating
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="categories-list d-flex flex-column gap-2">
                            {ratingData.map((item, idx) => (
                                <div className="d-flex justify-content-between" key={idx}>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="five-star" />
                                        <label className="form-check-label" htmlFor="five-star">
                                            <span className="flex-grow-1 d-inline-flex align-items-center">
                                                {Array(Math.floor(item.star))
                                                    .fill(0)
                                                    .map((_star, idx) => (
                                                        <li className="icons-center" key={idx}>
                                                            <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                                        </li>
                                                    ))}
                                                {!Number.isInteger(item.star) && (
                                                    <li className="icons-center">
                                                        <IconifyIcon icon="tabler:star-half-filled" className="text-warning" />{' '}
                                                    </li>
                                                )}
                                                {item.star < 5 &&
                                                    Array(5 - Math.ceil(item.star))
                                                        .fill(0)
                                                        .map((_star, idx) => (
                                                            <li className="icons-center" key={idx}>
                                                                <IconifyIcon icon="tabler:star" className="text-warning" />
                                                            </li>
                                                        ))}
                                                <span className="ms-1">{item.star} Star Rating </span>
                                            </span>
                                        </label>
                                    </div>
                                    <div>
                                        <span className="badge bg-primary-subtle text-primary">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardFooter>
                        <Button variant="primary" className="w-100">
                            Apply Filter
                        </Button>
                    </CardFooter>
                </Card>
            </Col>
        </>
    );
};

export default CategoryMenu;
