import CustomFlatpickr from '@/components/CustomFlatpickr';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllOrders } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';

const OrdersPage = () => {
    const orderData = useFetchData(getAllOrders);
    return (
        <MainLayout>
            <PageTitle title="Orders" subTitle="eCommerce" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="border-bottom border-light">
                            <Row className="justify-content-between g-3">
                                <Col lg={6}>
                                    <Row className="g-3">
                                        <Col lg={4}>
                                            <div className="position-relative">
                                                <input type="text" className="form-control ps-4" placeholder="Search Order" />
                                                <IconifyIcon icon="tabler:search" className="position-absolute top-50 translate-middle-y ms-2" />
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="flex-grow-1 d-flex align-items-center">
                                                <label htmlFor="status-select" className="me-2">
                                                    Status
                                                </label>
                                                <div className="flex-grow-1">
                                                    <ChoicesFormInput className="form-select my-1 my-md-0" data-toggle="select2" id="status-select">
                                                        <option>Select</option>
                                                        <option value="Date">All</option>
                                                        <option value="Name">Cancelled</option>
                                                        <option value="Revenue">Completed</option>
                                                        <option value="Employee">Denied</option>
                                                        <option value="Employee">Pending</option>
                                                        <option value="Employee">Processing</option>
                                                        <option value="Employee">Refunded</option>
                                                    </ChoicesFormInput>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="input-group">
                                                <CustomFlatpickr
                                                    className="form-control border-0 shadow"
                                                    options={{
                                                        defaultDate: ['2016-10-10', '2016-10-20'],
                                                        dateFormat: 'Y-m-d',
                                                        mode: 'range',
                                                        enableTime: false,
                                                    }}
                                                />
                                                <span className="input-group-text bg-primary border-primary text-white">
                                                    <IconifyIcon icon="tabler:calendar" className="fs-15" />
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={6}>
                                    <div className="text-md-end mt-3 mt-md-0">
                                        <button type="button" className="btn btn-success waves-effect waves-light me-1">
                                            <IconifyIcon icon="tabler:settings" className="me-1" />
                                            More Setting
                                        </button>
                                        <button type="button" className="btn btn-dark waves-effect waves-light">
                                            <IconifyIcon icon="tabler:filter" className="me-1" /> Filters
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <div className="table-responsive">
                            <table className="table table-nowrap mb-0">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="ps-3" style={{ width: 50 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>Order ID</th>
                                        <th>Customer Name</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Order Date</th>
                                        <th>Payment Status</th>
                                        <th>Order Status</th>
                                        <th className="text-center" style={{ width: 120 }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>
                                                <Link href="/e-commerce/order-details" className="text-muted fw-medium">
                                                    #BM9708
                                                </Link>
                                            </td>
                                            <td>
                                                <h5 className="mb-0 text-dark">
                                                    {item.users?.image && (
                                                        <img src={item.users?.image} alt="avatar" className="rounded-circle avatar-xs me-1" />
                                                    )}{' '}
                                                    <Link href="" className="text-dark">
                                                        {item.users?.name}
                                                    </Link>
                                                </h5>
                                            </td>
                                            <td>
                                                <p className="mb-1">
                                                    <span className="text-dark fw-semibold">P1 -</span> {item.product.p1}
                                                </p>
                                                {item.product.p2 && (
                                                    <p className="mb-0">
                                                        <span className="text-dark fw-semibold">P2 -</span> {item.product.p2}
                                                    </p>
                                                )}
                                            </td>
                                            <td>
                                                <p className="mb-1">{item.quantity.p1} Piece</p>
                                                {item.quantity.p2 && <p className="mb-0">{item.quantity.p2} Piece</p>}
                                            </td>
                                            <td>${item.total}</td>
                                            <td>{item.date.toLocaleString('en-us', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                            <td>
                                                <h5 className="mb-0">
                                                    <span
                                                        className={`badge text-${item.paymentStatus == 'Failed' ? 'danger' : item.paymentStatus == 'Pending' ? 'warning' : 'success'} border border-${item.paymentStatus == 'Failed' ? 'danger' : item.paymentStatus == 'Pending' ? 'warning' : 'success'}-subtle fs-11 p-1`}
                                                    >
                                                        {item.paymentStatus}
                                                    </span>
                                                </h5>
                                            </td>
                                            <td>
                                                <h5 className="mb-0">
                                                    <span
                                                        className={`badge badge-soft-${item.orderStatus == 'Delivered' ? 'info' : item.orderStatus == 'Dispatched' ? 'warning' : item.orderStatus == 'Ready To Pick' ? 'dark' : 'danger'} fs-11 p-1`}
                                                    >
                                                        {item.orderStatus == 'Delivered' ? (
                                                            <IconifyIcon icon="tabler:checks" className="me-1 align-middle" />
                                                        ) : item.orderStatus == 'Dispatched' ? (
                                                            <IconifyIcon icon="tabler:progress-check" className="me-1 align-middle" />
                                                        ) : item.orderStatus == 'Ready To Pick' ? (
                                                            <IconifyIcon icon="tabler:check" className="me-1 align-middle" />
                                                        ) : (
                                                            <IconifyIcon icon="tabler:x" className="me-1 align-middle" />
                                                        )}
                                                        {item.orderStatus}
                                                    </span>
                                                </h5>
                                            </td>
                                            <td className="pe-3">
                                                <div className="hstack gap-1 justify-content-end">
                                                    <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:eye" />
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
                        <CardFooter className="d-flex align-items-center justify-content-end">
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
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default OrdersPage;
