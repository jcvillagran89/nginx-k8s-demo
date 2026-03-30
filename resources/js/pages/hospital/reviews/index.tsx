import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllReviews } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { ReviewType } from '@/types/data';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

const ReviewsCard = ({ rating, reviews, doctors }: ReviewType) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="d-flex align-items-center gap-2 border-bottom border-dashed bg-light-subtle">
                <img src={doctors?.image} alt="" className="avatar-xl rounded-circle border border-light border-2" />
                <div>
                    <p className="text-dark fw-medium fs-15 mb-1">{doctors?.name}</p>
                    <p className="mb-0 text-muted">{doctors?.specialty}</p>
                </div>
                <div className="ms-auto text-lg-end text-md-end text-sm-end">
                    <div className="flex-grow-1 d-inline-flex align-items-center fs-5 mb-2">
                        {Array(Math.floor(rating.star))
                            .fill(0)
                            .map((_star, idx) => (
                                <li className="icons-center" key={idx}>
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                </li>
                            ))}
                        {!Number.isInteger(rating.star) && (
                            <li className="icons-center">
                                <IconifyIcon icon="tabler:star-half-filled" className="text-warning" />{' '}
                            </li>
                        )}
                        {rating.star < 5 &&
                            Array(5 - Math.ceil(rating.star))
                                .fill(0)
                                .map((_star, idx) => (
                                    <li className="icons-center" key={idx}>
                                        <IconifyIcon icon="tabler:star" className="text-warning" />
                                    </li>
                                ))}
                    </div>
                    <p className="mb-0 fw-medium">Rating {rating.star}</p>
                </div>
            </CardHeader>
            <CardBody>
                <h4>{rating.review}k Reviews and ratings</h4>
                {reviews.map((item, idx) => (
                    <Fragment key={idx}>
                        <div className={`${idx != 1 ? 'mt-3' : 'mb-3'} `}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="mb-0 fs-15 fw-medium">{item.name}</p>
                                    <div className="flex-grow-1 d-inline-flex align-items-center fs-14 mt-0">
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
                                                        <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                                    </li>
                                                ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-0 fs-13 fw-medium text-muted">
                                        {item.date.toLocaleString('en-us', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <p className="my-2">{item.description}</p>
                            <div>
                                <Link href="" className="fs-13 me-2 link-reset icons-center">
                                    <IconifyIcon icon="tabler:thumb-up" className="fs-16 me-1" /> {item.like}
                                </Link>
                                <Link href="" className="fs-13 me-3 link-reset icons-center">
                                    <IconifyIcon icon="tabler:thumb-down" className="fs-16 me-1" /> {item.dislike}
                                </Link>
                            </div>
                        </div>
                        {idx != 1 && <hr />}
                    </Fragment>
                ))}
                <Link href="" className="link-primary fw-medium">
                    View More Review
                </Link>
            </CardBody>
        </Card>
    );
};

const ReviewsPage = () => {
    const reviewData = useFetchData(getAllReviews);
    return (
        <MainLayout>
            <PageTitle title="Reviews" subTitle="Hospital" />
            <Row>
                {reviewData?.map((item, idx) => (
                    <Col xl={4} lg={6} key={idx}>
                        <ReviewsCard {...item} />
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
};

export default ReviewsPage;
