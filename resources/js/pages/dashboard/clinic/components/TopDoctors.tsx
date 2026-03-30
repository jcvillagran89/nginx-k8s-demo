import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllDoctors } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';

const TopDoctors = () => {
    const doctorsData = useFetchData(getAllDoctors);
    return (
        <Col xxl={8}>
            <Card>
                <div className="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
                    <h4 className="header-title">
                        Top Doctors{' '}
                        <IconifyIcon
                            icon="tabler:info-octagon"
                            className="text-muted ms-1"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="Based on user reviews and popularity."
                        >
                            {' '}
                        </IconifyIcon>
                    </h4>
                    <Dropdown align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler:dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Refresh Report</DropdownItem>
                            <DropdownItem>Export Report</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <CardBody>
                    <Row className="align-items-center g-3">
                        {doctorsData?.slice(0, 6).map((item, idx) => (
                            <Col xxl={4} md={6} key={idx}>
                                <div className="bg-light bg-opacity-50 rounded-3 p-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <img src={item.image} alt="user-image" className="me-1 avatar-xl rounded-circle" />
                                        <div>
                                            <h4>{item.name}</h4>
                                            <p className="text-muted">{item.position}</p>
                                            <p className="m-0 fs-14">
                                                <IconifyIcon icon="tabler:star-filled" className="text-warning" /> {item.rating.star} •{' '}
                                                <Link href="" className="link-reset fw-medium">
                                                    {item.rating.review}+ Reviews <IconifyIcon icon="tabler:arrow-right" />
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="text-center mt-3">
                        <Button size="sm" variant="secondary">
                            See All Doctors <IconifyIcon icon="tabler:arrow-right" className="ms-1" />
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

export default TopDoctors;
