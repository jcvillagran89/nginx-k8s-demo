import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllTransaction } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col } from 'react-bootstrap';

const TransactionsCard = () => {
    const transactionsData = useFetchData(getAllTransaction);
    return (
        <Card>
            <CardHeader className="d-flex flex-wrap align-items-center gap-2">
                <h4 className="header-title me-auto">
                    Transactions <span className="text-muted fw-normal fs-14">(95.6k+ Transactions)</span>
                </h4>
                <div className="search-bar">
                    <input type="text" className="form-control form-control-sm search" placeholder="Search Here..." />
                </div>
                <div className="w-auto">
                    <select className="form-select form-select-sm">
                        <option>All</option>
                        <option value={0}>Paid</option>
                        <option value={1}>Cancelled</option>
                        <option value={2}>Failed</option>
                        <option value={2}>Onhold</option>
                    </select>
                </div>
                <Button variant="soft-primary" size="sm">
                    Export <IconifyIcon icon="tabler:file-export" className="ms-1" />
                </Button>
            </CardHeader>
            <CardBody className="p-0">
                <div className="table-responsive table-card">
                    <table className="table table-borderless table-hover table-custom table-nowrap align-middle mb-0">
                        <thead className="bg-light bg-opacity-50 thead-sm">
                            <tr className="text-uppercase fs-12">
                                <th scope="col" className="text-muted">
                                    ID
                                </th>
                                <th scope="col" className="text-muted">
                                    Name / Business
                                </th>
                                <th scope="col" className="text-muted">
                                    Description
                                </th>
                                <th scope="col" className="text-muted">
                                    Amount
                                </th>
                                <th scope="col" className="text-muted">
                                    Timestamp
                                </th>
                                <th scope="col" className="text-muted">
                                    Type
                                </th>
                                <th scope="col" className="text-muted">
                                    Payment Method
                                </th>
                                <th scope="col" className="text-muted">
                                    Status
                                </th>
                                <th scope="col" className="text-muted">
                                    •••
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionsData?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <Link href="" className="fw-medium text-reset">
                                            #{item.id}
                                        </Link>
                                    </td>
                                    <td>
                                        {item.image ? (
                                            <img src={item.image} alt="avatar" className="avatar-xs rounded-circle me-1" />
                                        ) : (
                                            <div className="avatar-xs d-inline-block me-1">
                                                <span className="avatar-title bg-primary-subtle text-primary fw-semibold rounded-circle">
                                                    {item.businessName.slice(0, 1)}
                                                </span>
                                            </div>
                                        )}
                                        <Link href="" className="text-reset">
                                            {item.businessName}
                                        </Link>
                                    </td>
                                    <td>{item.description}</td>
                                    <td className={`text-${item.variant}`}>{item.amount}</td>
                                    <td>
                                        {item.date.toLocaleString('en-us', { day: '2-digit', month: 'short', year: '2-digit' })} &nbsp;
                                        <small className="text-muted">
                                            {item.date.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </small>
                                    </td>
                                    {item.paymentType ? <td>{item.paymentType}</td> : <td>-</td>}
                                    <td>
                                        <img src={item?.paymentImage} alt="paymentImage" height={24} className="me-1" />
                                        <span className="align-middle">{item.paymentMethod}</span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge bg-${item.paymentStatus == 'Failed' ? 'danger' : item.paymentStatus == 'Onhold' ? 'warning' : 'success'}-subtle text-${item.paymentStatus == 'Failed' ? 'danger' : item.paymentStatus == 'Onhold' ? 'warning' : 'success'} p-1`}
                                        >
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href="" className="text-muted fs-20">
                                            <IconifyIcon icon="tabler:edit" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
            <CardFooter className="border-top border-light">
                <div className="align-items-center justify-content-between row text-center text-sm-start">
                    <div className="col-sm">
                        <div className="text-muted">
                            Showing <span className="fw-semibold text-body"> 7 </span> of <span className="fw-semibold"> 15 </span> Transactions
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
        </Card>
    );
};

export default TransactionsCard;
