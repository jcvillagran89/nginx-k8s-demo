import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllDoctorList } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { DoctorListType } from '@/types/data';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';

const ContactCard = ({ image, name, locationKm, ratingStar, specialty, location, email }: DoctorListType) => {
    return (
        <Card>
            <CardBody className="text-center">
                <Row className="justify-content-between mb-3">
                    <Col lg={4} xs={4}>
                        <div className="d-flex align-items-center fs-16 gap-1">
                            <span className="fw-medium">{ratingStar} </span>
                            <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                        </div>
                    </Col>
                    <Col lg={4} xs={4}>
                        <img src={image} alt="avatar" className="avatar-xl rounded" />
                    </Col>
                    <Col lg={4} xs={4} className="text-end">
                        <div className="d-flex align-items-center justify-content-end fs-16 gap-1">
                            <span className="fw-medium">{locationKm}</span>
                            <div>
                                <IconifyIcon icon="tabler:map-pin-filled" className="text-primary" />
                            </div>
                        </div>
                    </Col>
                </Row>
                <h4>{name}</h4>
                <p className="mb-0 text-muted">{specialty}</p>
                <div className="mt-3 d-flex gap-2 justify-content-center">
                    <Button variant="soft-danger" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                        <span>
                            {' '}
                            <IconifyIcon icon="solar:chat-round-call-bold-duotone" className="fs-22" />
                        </span>
                    </Button>
                    <Button variant="soft-primary" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                        {' '}
                        <span>
                            {' '}
                            <IconifyIcon icon="solar:outgoing-call-rounded-bold-duotone" className="fs-22" />
                        </span>{' '}
                    </Button>
                    <Button variant="soft-success" className="d-inline-flex align-items-center justify-content-center rounded avatar-md ">
                        {' '}
                        <span>
                            {' '}
                            <IconifyIcon icon="solar:videocamera-bold-duotone" className="fs-22" />
                        </span>
                    </Button>
                </div>
                <div className="text-start mt-3">
                    <p className="mb-1 fw-medium fs-14  d-flex align-items-center">
                        Location : <span className="fs-13 ms-auto fw-normal">{location}</span>
                    </p>
                    <p className="mb-0 fw-medium fs-14  d-flex align-items-center">
                        Email Address :{' '}
                        <Link href="" className="fs-13 ms-auto fw-normal">
                            {email}
                        </Link>
                    </p>
                </div>
            </CardBody>
            <CardFooter className="border-top border-dashed gap-1 hstack">
                <Button variant="outline-primary" className="w-100">
                    Show All Services
                </Button>
                <Button variant="primary" className="w-100">
                    Get Appointment
                </Button>
            </CardFooter>
        </Card>
    );
};

const ContactsPage = () => {
    const contactData = useFetchData(getAllDoctorList);
    return (
        <MainLayout>
            <PageTitle title="Hospital Contacts" subTitle="Hospital" />
            <Row>
                {contactData?.slice(0, 8).map((item, idx) => (
                    <Col xl={3} lg={6} key={idx}>
                        <ContactCard {...item} />
                    </Col>
                ))}
            </Row>
        </MainLayout>
    );
};

export default ContactsPage;
