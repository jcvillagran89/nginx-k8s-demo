import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllCustomers } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, Col, ProgressBar, Row } from 'react-bootstrap';

const CustomersPage = () => {
    const customersData = useFetchData(getAllCustomers);
    return (
        <MainLayout>
            <PageTitle title="Customers" subTitle="eCommerce" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                            <h4 className="header-title">Manage Customers</h4>
                            <Button variant="secondary">
                                <IconifyIcon icon="tabler:file-import" className="me-1" /> Import
                            </Button>
                        </CardHeader>
                        <div className="table-responsive">
                            <table className="table table-nowrap mb-0">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="ps-3" style={{ width: 50 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>Customer</th>
                                        <th>Invoice</th>
                                        <th>Status</th>
                                        <th>Total Amount</th>
                                        <th>Amount Due</th>
                                        <th>Shop Rate</th>
                                        <th>Due Date</th>
                                        <th className="text-center pe-3" style={{ width: 120 }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customersData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>
                                                <h5 className="mb-0 text-dark">
                                                    {item.users?.image && (
                                                        <img src={item.users?.image} alt="avatar" className="rounded-circle avatar-sm me-1" />
                                                    )}
                                                    <Link href="" className="text-dark">
                                                        {item.users?.name}
                                                    </Link>
                                                </h5>
                                            </td>
                                            <td>{item.invoice}</td>
                                            <td>
                                                <h5 className="mb-0">
                                                    <span className={`badge badge-soft-${item.status == 'Block' ? 'danger' : 'success'} py-1 px-2`}>
                                                        {item.status}
                                                    </span>
                                                </h5>
                                            </td>
                                            <td>${item.totalAmount}</td>
                                            <td>${item.amountDue}</td>
                                            <td>
                                                <ProgressBar
                                                    striped
                                                    animated
                                                    className="rounded flex-grow-1"
                                                    style={{ height: 10 }}
                                                    now={item.shopRate}
                                                    variant="warning"
                                                    role="progressbar"
                                                ></ProgressBar>
                                            </td>
                                            <td>{item.dueDate.toLocaleString('en-us', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="hstack gap-1 justify-content-end pe-3">
                                                <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                                    {' '}
                                                    <IconifyIcon icon="tabler:eye" />
                                                </Button>
                                                <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle">
                                                    {' '}
                                                    <IconifyIcon icon="tabler:trash" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <CardFooter>
                            <div className="d-flex justify-content-end">
                                <ul className="pagination justify-content-center mb-0">
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

export default CustomersPage;
