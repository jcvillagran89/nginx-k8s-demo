import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAppointment } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

const AppointmentListCard = () => {
    const appointmentData = useFetchData(getAllAppointment);
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Today Appointment List
                </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
                <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                        <thead className="bg-light bg-opacity-25">
                            <tr>
                                <th className="ps-3" style={{ width: 50 }}>
                                    <input type="checkbox" className="form-check-input" id="customCheck1" />
                                </th>
                                <th>Patient Name</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th>Phone Number</th>
                                <th>Reason for Visit</th>
                                <th className="text-center" style={{ width: 125 }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentData?.slice(0, 5).map((item, idx) => (
                                <tr key={idx}>
                                    <td className="ps-3">
                                        <input type="checkbox" className="form-check-input" id="customCheck2" />
                                    </td>
                                    <td>
                                        <h5 className="mb-0 text-dark">
                                            <Link href="" className="text-dark">
                                                {item.name}
                                            </Link>
                                        </h5>
                                    </td>
                                    <td>{item.date.toLocaleString('en-us', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                    <td>{item.date.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>+{item.phone}</td>
                                    <td>{item.reasonVisit}</td>
                                    <td className="pe-3">
                                        <div className="d-flex gap-2">
                                            <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                                {' '}
                                                <IconifyIcon icon="tabler:eye" />
                                            </Button>
                                            <Button variant="soft-success" size="sm" className="btn-icon rounded-circle">
                                                {' '}
                                                <IconifyIcon icon="tabler:edit" />
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
    );
};

export default AppointmentListCard;
