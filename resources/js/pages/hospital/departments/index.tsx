import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllDepartments } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { Button, Card, CardBody, CardFooter, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

const DepartmentsPage = () => {
    const departmentData = useFetchData(getAllDepartments);
    return (
        <MainLayout>
            <PageTitle title="Departments" subTitle="Hospital" />
            <Row>
                {departmentData?.map((item, idx) => (
                    <Col xxl={3} xl={4} md={6} key={idx}>
                        <Card>
                            <img src={item.image} alt="department" className="mx-auto img-fluid" width={300} />
                            <CardBody className="border-top border-dashed">
                                <h4 className="fw-medium text-dark">{item.title}</h4>
                                <p className="mb-0 mt-2">
                                    {item.description}{' '}
                                    <Link href="" className="link-primary fw-medium">
                                        Show More
                                    </Link>
                                </p>
                                <div className="flex-grow-1  d-inline-flex align-items-center fs-18 mt-2">
                                    {Array(Math.floor(item.rating.star))
                                        .fill(0)
                                        .map((_star, idx) => (
                                            <li className="icons-center " key={idx}>
                                                <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                            </li>
                                        ))}
                                    {!Number.isInteger(item.rating.star) && (
                                        <li className="icons-center">
                                            <IconifyIcon icon="tabler:star-half-filled" className="text-warning" />{' '}
                                        </li>
                                    )}
                                    {item.rating.star < 5 &&
                                        Array(5 - Math.ceil(item.rating.star))
                                            .fill(0)
                                            .map((_star, idx) => (
                                                <li className="icons-center" key={idx}>
                                                    <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                                </li>
                                            ))}
                                    <span className="ms-1 fs-14">{item.rating.review}k Reviews </span>
                                </div>
                                <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                                    <p className="mb-0 fw-medium fs-14">Best Experience Doctor :</p>
                                    <div className="avatar-group">
                                        {item.bestDoctor.map((doctor, idx) => (
                                            <Fragment key={idx}>
                                                {doctor.image ? (
                                                    <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Vicki</Tooltip>}>
                                                        <div
                                                            className="avatar"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-custom-class="tooltip-secondary"
                                                            data-bs-placement="top"
                                                            aria-label="Vicki"
                                                            data-bs-original-title="Vicki"
                                                        >
                                                            <img src={doctor.image} alt="avatar" className="rounded-circle avatar-sm" />
                                                        </div>
                                                    </OverlayTrigger>
                                                ) : (
                                                    <OverlayTrigger overlay={<Tooltip className="tooltip-dark">Thomas</Tooltip>}>
                                                        <div className="avatar avatar-sm">
                                                            <span className={`avatar-title bg-${doctor.textVariant} rounded-circle fw-bold`}>
                                                                {doctor.name}
                                                            </span>
                                                        </div>
                                                    </OverlayTrigger>
                                                )}
                                            </Fragment>
                                        ))}
                                        <OverlayTrigger overlay={<Tooltip className="tooltip-danger">15 more Users</Tooltip>}>
                                            <div
                                                className="avatar avatar-sm"
                                                data-bs-toggle="tooltip"
                                                data-bs-custom-class="tooltip-danger"
                                                data-bs-placement="top"
                                                data-bs-original-title="15 more Users"
                                            >
                                                <span className="avatar-title bg-danger rounded-circle fw-bold">
                                                    {Math.floor(Math.random() * 10)}+
                                                </span>
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter className="border-top border-dashed gap-1 hstack">
                                <Button variant="primary" className="w-100">
                                    View More Report
                                </Button>
                                <Button variant="dark" className="d-inline-flex align-items-center justify-content-center rounded avatar-md">
                                    {' '}
                                    <span>
                                        {' '}
                                        <IconifyIcon icon="tabler:edit" className="fs-20" />
                                    </span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
};

export default DepartmentsPage;
