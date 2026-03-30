import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAppointment } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';

import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const AppointmentsList = () => {
    const appointmentData = useFetchData(getAllAppointment);
    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                        <CardTitle as={'h4'}>Appointments List</CardTitle>
                        <div className="d-flex flex-wrap gap-1">
                            <Button variant="success" className="bg-gradient">
                                <IconifyIcon icon="tabler:plus" className="me-1" /> New Appointment
                            </Button>
                            <Button variant="secondary" className="bg-gradient">
                                <IconifyIcon icon="tabler:file-import" className="me-1" /> Import
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="table-responsive">
                            <table className="table table-hover text-nowrap mb-0">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="ps-3" style={{ width: 50 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Department</th>
                                        <th>Doctor Name</th>
                                        <th>Appo. Date</th>
                                        <th>Appo. Time</th>
                                        <th>Mobile No</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.age}</td>
                                            <td>{item.department}</td>
                                            <td>
                                                {item.doctors?.image && (
                                                    <img src={item.doctors.image} alt="avatar" className="avatar-sm rounded-circle me-2" />
                                                )}
                                                {item.doctors?.name}
                                            </td>
                                            <td>{item.date.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            <td>{item.date.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>+123456789</td>
                                            <td>
                                                <div className="hstack gap-1">
                                                    <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:eye" />
                                                    </Button>
                                                    <Button variant="soft-success" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:edit" className="fs-16" />
                                                    </Button>
                                                    <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:trash" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default AppointmentsList;
