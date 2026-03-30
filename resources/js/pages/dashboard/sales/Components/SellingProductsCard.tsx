import IconifyIcon from '@/components/wrappers/IconifyIcon';

import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col } from 'react-bootstrap';
import { salesProductData } from '../data';

const SellingProductsCard = () => {
    return (
        <Card className="card-h-100">
            <CardHeader className="d-flex flex-wrap align-items-center gap-2 border-bottom border-dashed">
                <h4 className="header-title me-auto">Top Selling Products</h4>
                <div className="d-flex gap-2 justify-content-end text-end">
                    <Button variant="light" size="sm">
                        Import <IconifyIcon icon="tabler:download" className="ms-1" />
                    </Button>
                    <Button variant="primary" size="sm">
                        Export <IconifyIcon icon="tabler:file-export" className="ms-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                <div className="table-responsive">
                    <table className="table table-custom align-middle table-nowrap table-hover mb-0">
                        <tbody>
                            {salesProductData.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="avatar-lg">
                                            <img src={item.image} alt="Product-1" className="img-fluid rounded-2" />
                                        </div>
                                    </td>
                                    <td className="ps-0">
                                        <h5 className="fs-14 my-1">
                                            <Link href="/e-commerce/product-details" className="link-reset">
                                                {item.name}
                                            </Link>
                                        </h5>
                                        <span className="text-muted fs-12">
                                            {item.date.toLocaleString('en-us', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td>
                                        <h5 className="fs-14 my-1">${item.price}</h5>
                                        <span className="text-muted fs-12">Price</span>
                                    </td>
                                    <td>
                                        <h5 className="fs-14 my-1">{item.quantity}</h5>
                                        <span className="text-muted fs-12">Quantity</span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-end">
                                            <div className="me-2">
                                                <h5 className="fs-14 my-1">${item.amount}</h5>
                                                <span className="text-muted fs-12">Amount</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
            <CardFooter>
                <div className="align-items-center justify-content-between row text-center text-sm-start">
                    <div className="col-sm">
                        <div className="text-muted">
                            Showing <span className="fw-semibold">5</span> of <span className="fw-semibold">10</span> Results
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

export default SellingProductsCard;
