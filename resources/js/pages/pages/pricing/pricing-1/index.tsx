import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import { splitArray } from '@/utils/array';
import { Fragment } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { pricingData, PricingType } from './data';
const PricingCard = ({ description, features, price, title }: PricingType) => {
    const chunk_size = 3;
    const appsChunks = splitArray(features, chunk_size);
    return (
        <Card className="card-pricing">
            <CardBody className="p-4">
                <h3 className=" fw-semibold">{title}</h3>
                <p className="fs-5 text-muted">{description}</p>
                <div className="price">
                    <h1 className="display-5  fw-bold">
                        ${price}
                        <span className="fs-4">.99</span> <span className="text-body-tertiary fs-4 fw-medium">USD / month</span>
                    </h1>
                </div>
                <Row className="mt-3">
                    {(appsChunks || []).map((chunk, idx) => (
                        <Col lg={6} key={idx}>
                            <ul className="d-flex flex-column gap-2 list-unstyled fs-16">
                                {(chunk || []).map((item, idx) => {
                                    return (
                                        <Fragment key={idx}>
                                            <li>
                                                <IconifyIcon icon={item.icon} className={`text-${item.variant} fs-4 align-middle me-1`} />
                                                {item.title}
                                            </li>
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        </Col>
                    ))}
                </Row>
                <Row className="justify-content-between align-items-center mt-3">
                    <Col lg={5}>
                        <p className="fs-5 mb-1">- Cancel anytime.</p>
                        <p className="fs-5 mb-0">- No card required.</p>
                    </Col>
                    <Col lg={4}>
                        <div className="price-btn">
                            <Button variant="primary">Start Free Trial</Button>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const PricingOnePage = () => {
    return (
        <MainLayout>
            <PageTitle title="Pricing One" subTitle="Pricing" />
            <Row className="justify-content-center">
                <Col xxl={9}>
                    <div className="text-center">
                        <h3 className="mb-2">Our Plans and Pricing</h3>
                        <p className="text-muted w-50 m-auto">
                            We have plans and prices that fit your business perfectly. Make your client site a success with our products.
                        </p>
                    </div>
                    <Row className="mt-sm-5 align-items-center justify-content-center mt-3 mb-3">
                        {pricingData.map((item, idx) => (
                            <Col lg={6} key={idx}>
                                <PricingCard {...item} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default PricingOnePage;
