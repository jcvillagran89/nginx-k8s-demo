import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAppointment } from '@/helpers/data';

import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col } from 'react-bootstrap';

const AppointmentCard = () => {
    const appointmentData = useFetchData(getAllAppointment);
    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="header-title">All Appointments</h4>
                <Button variant="secondary" size="sm">
                    Add New <IconifyIcon icon="tabler:plus" className="ms-1" />
                </Button>
            </CardHeader>
            <CardBody className="p-0">
                <div className="table-responsive">
                    <table className="table table-hover table-nowrap table-custom table-centered m-0">
                        <thead className="bg-light bg-opacity-50 thead-sm">
                            <tr className="text-uppercase fs-12">
                                <th className="text-muted">Queue #</th>
                                <th className="text-muted">Name</th>
                                <th className="text-muted">Gender</th>
                                <th className="text-muted">Age</th>
                                <th className="text-muted">Appointment</th>
                                <th className="text-muted">Date / Time</th>
                                <th className="text-muted">Assign Dr.</th>
                                <th className="text-muted">Status</th>
                                <th className="text-muted">•••</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentData?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>#{idx}</td>
                                    <td>
                                        <Link href="" className="link-reset fw-medium">
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td>{item.gender}</td>
                                    <td>{item.age}</td>
                                    <td>{item.appointment}</td>
                                    <td>
                                        {item.date.toLocaleString('en-us', { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                                        <small className="text-muted">
                                            {item.date.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </td>
                                    <td>
                                        {' '}
                                        {item.doctors?.image && (
                                            <img src={item.doctors.image} alt="doctors" className="avatar-xs rounded-circle me-1" />
                                        )}
                                        <Link href="" className="link-reset fw-medium">
                                            {item.doctors?.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge bg-${item.appointmentStatus == 'Canceled' ? 'danger' : item.appointmentStatus == 'Scheduled' ? 'warning' : 'success'}-subtle text-${item.appointmentStatus == 'Canceled' ? 'danger' : item.appointmentStatus == 'Scheduled' ? 'warning' : 'success'} p-1`}
                                        >
                                            {item.appointmentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href="" className="text-muted fs-20">
                                            {' '}
                                            <IconifyIcon icon="tabler:edit" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CardFooter>
                    <div className="align-items-center justify-content-between row text-center text-sm-start">
                        <div className="col-sm">
                            <div className="text-muted">
                                Showing <span className="fw-semibold">7</span> of <span className="fw-semibold">1,243</span> Results
                            </div>
                        </div>
                        <Col sm={'auto'} className="mt-3 mt-sm-0">
                            <ul className="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
                                <li className="page-item disabled">
                                    <Link href="" className="page-link">
                                        <IconifyIcon icon="tabler:chevron-left" />
                                    </Link>
                                </li>
                                <li className="page-item active">
                                    <Link href="" className="page-link">
                                        1
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link href="" className="page-link">
                                        2
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link href="" className="page-link">
                                        3
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link href="" className="page-link">
                                        <IconifyIcon icon="tabler:chevron-right" />
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                    </div>
                </CardFooter>
            </CardBody>
        </Card>
    );
};

export default AppointmentCard;
