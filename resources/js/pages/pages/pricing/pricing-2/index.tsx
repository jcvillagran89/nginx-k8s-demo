import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import { pricingTwoData } from './data';

const PricingTwoPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Pricing Two" subTitle="Pricing" />
            <Row className="justify-content-center">
                <Col xxl={9}>
                    <div className="text-center">
                        <h3 className="mb-2">Our Plans and Pricing</h3>
                        <p className="text-muted w-50 m-auto">
                            We have plans and prices that fit your business perfectly. Make your client site a success with our products.
                        </p>
                    </div>
                    <Row className="mt-sm-5 align-items-end justify-content-center mt-3 mb-3">
                        {pricingTwoData.map((item, idx) => (
                            <Col lg={4} key={idx}>
                                <Card className="card-pricing h-100">
                                    <CardHeader className="p-3 border-bottom border-dashed">
                                        <h3 className=" fw-semibold">{item.title}</h3>
                                        <h5 className="mt-2 mb-0 fw-normal text-muted">{item.description}</h5>
                                    </CardHeader>
                                    <CardBody className="p-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted fs-3 fw-bold">$</span>
                                            <h1 className="display-5  fw-bold mb-0"> {item.price}</h1>
                                            <div className="d-block">
                                                <p className="fw-semibold fs-5 mb-0">One-time payment</p>
                                                <p className="text-muted fw-semibold fs-5 mb-0">plus local taxes</p>
                                            </div>
                                        </div>
                                        <h4 className="text-primary fw-semibold my-3">What&apos;s Included :</h4>
                                        <ul className="d-flex flex-column gap-2 list-unstyled fs-16 fw-medium">
                                            {item.features.map((feat, idx) => (
                                                <li key={idx}>
                                                    <IconifyIcon icon="tabler:checks" className="text-primary fs-4 align-middle me-1" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardBody>
                                    <CardFooter>
                                        {item.popular ? (
                                            <Button variant="primary" className="w-100">
                                                Buy Now
                                            </Button>
                                        ) : (
                                            <Button variant="outline-primary" className="w-100">
                                                Buy Now
                                            </Button>
                                        )}
                                    </CardFooter>
                                    {item.popular && (
                                        <span className="position-absolute top-0 translate-middle start-50 bg-primary-subtle px-3 py-1 text-primary rounded-pill fw-semibold">
                                            Most Popular
                                        </span>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default PricingTwoPage;
