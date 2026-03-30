import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllDoctorList } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';

const DoctorsPage = () => {
    const doctorData = useFetchData(getAllDoctorList);
    return (
        <MainLayout>
            <PageTitle title="Doctors" subTitle="Hospital" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                            <h4 className="header-title">Doctor List</h4>
                            <div>
                                <Link href="/hospital/add-doctors" className="btn btn-success bg-gradient">
                                    <IconifyIcon icon="tabler:plus" className="me-1" /> Add Doctor
                                </Link>{' '}
                                &nbsp;
                                <Button variant="secondary" className="bg-gradient">
                                    <IconifyIcon icon="tabler:file-import" className="me-1" /> Import
                                </Button>
                            </div>
                        </CardHeader>
                        <div className="table-responsive">
                            <table className="table table-nowrap mb-0">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="ps-3" style={{ width: 50 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>Doctor ID</th>
                                        <th>Doctor Name</th>
                                        <th>Specialty</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Timing</th>
                                        <th>Years of Experience</th>
                                        <th className="text-center" style={{ width: 120 }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctorData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>{item.id}</td>
                                            <td>
                                                <img src={item.image} className="avatar-sm rounded-circle me-2" alt="..." />
                                                <Link href="/hospital/doctors-Details" className="text-dark fw-medium">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td>{item.specialty}</td>
                                            <td>+{item.number}</td>
                                            <td>{item.email}</td>
                                            <td>{item.timing}</td>
                                            <td>{item.experience} Years</td>
                                            <td className="pe-3">
                                                <div className="hstack gap-1 justify-content-end">
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
                        <CardFooter>
                            <div className="d-flex justify-content-end">
                                <ul className="pagination mb-0">
                                    <li className="page-item disabled">
                                        <Link href="" className="page-link">
                                            <IconifyIcon icon="tabler:chevrons-left" />
                                        </Link>
                                    </li>
                                    <li className="page-item">
                                        <Link href="" className="page-link">
                                            1
                                        </Link>
                                    </li>
                                    <li className="page-item active">
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
                                            <IconifyIcon icon="tabler:chevrons-right" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default DoctorsPage;
