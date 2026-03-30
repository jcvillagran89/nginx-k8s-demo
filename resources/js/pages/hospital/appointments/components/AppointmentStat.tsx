import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Card, CardBody, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { appointmentStatData, AppointmentStatType } from '../data';

const AppointmentCard = ({ count, icon, patients, title }: AppointmentStatType) => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-start gap-3">
                    <div>
                        <div className="avatar-lg bg-primary bg-opacity-10 rounded flex-centered">
                            <IconifyIcon icon={icon} width={32} height={32} className="fs-32 text-primary" />
                        </div>
                    </div>
                    <div>
                        <CardTitle as={'h4'} className="mb-1 d-flex align-items-center gap-2">
                            {title}
                        </CardTitle>
                        <p className="text-primary fw-medium fs-20 mb-0">
                            {count} <span className="fs-15 text-muted ms-1"> Today</span>
                        </p>
                    </div>
                    <Dropdown className="ms-auto" align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none text-muted card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler:dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="mt-3">
                    {patients.map((item, idx) => (
                        <p key={idx} className="text-dark mb-1 fs-14 d-flex justify-content-between">
                            {item.patients} <span className="text-dark fw-semibold">{item.patientsCount} Patients</span>
                        </p>
                    ))}
                </div>
            </CardBody>
            <CardFooter className="border-top border-dashed">
                <Link href="" className="link-primary fw-medium">
                    View More <IconifyIcon icon="tabler:arrow-right" />
                </Link>
            </CardFooter>
        </Card>
    );
};

const AppointmentStat = () => {
    return (
        <Row>
            {appointmentStatData.map((item, idx) => (
                <Col xxl={3} xl={6} md={6} key={idx}>
                    <AppointmentCard {...item} />
                </Col>
            ))}
        </Row>
    );
};

export default AppointmentStat;
