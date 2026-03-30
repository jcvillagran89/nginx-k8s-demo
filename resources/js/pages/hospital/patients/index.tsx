import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllPatients } from '@/helpers/data';

import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PatientsPage = () => {
    const patientsData = useFetchData(getAllPatients);
    return (
        <MainLayout>
            <PageTitle title="Patients" subTitle="Hospital" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                            <CardTitle as={'h4'}>Manage Patients</CardTitle>
                            <div>
                                <Link href="/hospital/add-patients" className="btn btn-success bg-gradient">
                                    <IconifyIcon icon="tabler:plus" className="me-1" /> Add Patient
                                </Link>
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
                                        <th className="ps-3" style={{ width: 60 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Date of Birth</th>
                                        <th>Gender</th>
                                        <th>Blood Group</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th>Primary Care Physician</th>
                                        <th className="text-center" style={{ width: 125 }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientsData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>PS49201</td>
                                            <td>
                                                {item.user?.image && (
                                                    <img src={item.user.image} className="avatar-sm rounded-circle me-2" alt="..." />
                                                )}
                                                <Link href="/hospital/patients-details" className="text-reset fw-medium">
                                                    {item.user?.name}
                                                </Link>
                                            </td>
                                            <td>{item.user?.BirthDate}</td>
                                            <td>
                                                <span className={`badge bg-${item.gender == 'Male' ? 'secondary' : 'warning'} p-1 fs-11`}>
                                                    {item.gender}
                                                </span>
                                            </td>
                                            <td>{item.bloodGroup}</td>
                                            <td>+ {item.user?.phone}</td>
                                            <td>{item.address}</td>
                                            <td>{item.physician}</td>
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
                                <ul className="pagination mb-0 justify-content-center">
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

export default PatientsPage;
