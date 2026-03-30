import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllPayments } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PaymentList = () => {
    const paymentsData = useFetchData(getAllPayments);

    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                        <CardTitle as={'h4'}>Payment List</CardTitle>
                        <div className="d-flex flex-wrap gap-1">
                            <Button variant="success" className="bg-gradient">
                                <IconifyIcon icon="tabler:plus" className="me-1" /> Add Payment
                            </Button>
                            <Button variant="secondary" className="bg-gradient">
                                <IconifyIcon icon="tabler:file-import" className="me-1" /> Import
                            </Button>
                        </div>
                    </CardHeader>
                    <div className="table-responsive">
                        <table className="table table-hover text-nowrap mb-0">
                            <thead className="bg-light-subtle">
                                <tr>
                                    <th className="ps-3" style={{ width: 50 }}>
                                        <input type="checkbox" className="form-check-input" id="customCheck1" />
                                    </th>
                                    <th>Bill No</th>
                                    <th>Patient Name</th>
                                    <th>Doctor Name</th>
                                    <th>Insurance Company</th>
                                    <th>Payment</th>
                                    <th>Bill Date</th>
                                    <th>Charge</th>
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th className="text-end pe-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsData?.map((item, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>{idx}</td>
                                            <td>{item.user?.name && <Link href="">{item.user?.name}</Link>}</td>
                                            <td>{item.doctors?.name}</td>
                                            <td>{item.insuranceComp}</td>
                                            <td>Cashless</td>
                                            <td>{item.billDate.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            <td>${item.charge}</td>
                                            <td>{item.tax}%</td>
                                            <td>{item.discount}%</td>
                                            <td className="text-end fw-semibold pe-3">${item.total}</td>
                                        </tr>
                                    );
                                })}
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
    );
};

export default PaymentList;
