import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import faqImg from '@/images/png/faq.png';

import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import Faqs from './components/Faqs';
import Question from './components/Question';
import { contactDetailsData } from './data';

const FaqPage = () => {
    return (
        <MainLayout>
            <PageTitle title="FAQ" subTitle="Pages" />
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <Row className="justify-content-between g-3">
                                <Col xl={3} lg={6}>
                                    <div>
                                        <div className="avatar-lg bg-primary rounded d-flex align-items-center justify-content-center mb-3">
                                            <IconifyIcon icon="tabler:question-mark" className="fs-32 text-white" />
                                        </div>
                                        <h3 className="mb-1">Frequently Asked Questions</h3>
                                        <p className="mb-3">Browse Through The Most Frequently Asked Questions</p>
                                        {contactDetailsData.map((item, idx) => (
                                            <div className="d-flex align-items-center gap-2 border p-2 rounded mb-3 ms-0" key={idx}>
                                                <div className="avatar-lg bg-light rounded d-flex align-items-center justify-content-center">
                                                    <IconifyIcon icon={item.icon} className="fs-23 text-primary" />
                                                </div>
                                                <div>
                                                    <Link href="" className="fw-medium fs-15">
                                                        {item.title}
                                                    </Link>
                                                    <p className="mb-0 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-3">
                                            <Button variant="primary">Show More</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={5} lg={6} className="text-center">
                                    <img src={faqImg} alt="faq" className="img-fluid mt-3" />
                                    <div className="app-search app-search-lg py-1 mt-3">
                                        <input type="text" className="form-control rounded py-2" placeholder="Search..." />
                                        <IconifyIcon icon="tabler:search" width={18} height={18} className="app-search-icon fs-18 text-muted" />
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center gap-1 mt-2">
                                        <h5 className="mb-0">Popular Searched : </h5>
                                        <span className="badge text-bg-light rounded-pill fw-normal px-2 py-1 fs-6">Apps</span>
                                        <span className="badge text-bg-light rounded-pill fw-normal px-2 py-1 fs-6">Developers</span>
                                        <span className="badge text-bg-light rounded-pill fw-normal px-2 py-1 fs-6">Repair</span>
                                        <span className="badge text-bg-light rounded-pill fw-normal px-2 py-1 fs-6">Billing</span>
                                        <span className="badge text-bg-light rounded-pill fw-normal px-2 py-1 fs-6">Payment</span>
                                    </div>
                                </Col>
                                <Col xl={3} lg={6}>
                                    <div>
                                        <CardTitle as={'h4'} className="mb-3">
                                            Write Your Question :
                                        </CardTitle>
                                        <Question />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Faqs />
        </MainLayout>
    );
};

export default FaqPage;
