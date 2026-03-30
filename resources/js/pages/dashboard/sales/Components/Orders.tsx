import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Button, CardBody } from 'react-bootstrap';
import { salesOrderData } from '../data';

const Orders = () => {
    return (
        <CardBody>
            <div className="d-flex mb-3 justify-content-between align-items-center">
                <h4 className="header-title">Recent Orders:</h4>
                <div>
                    <Button variant="primary" size="sm" className="rounded-circle btn-icon">
                        <IconifyIcon icon="tabler:plus" />
                    </Button>
                </div>
            </div>
            {salesOrderData.map((item, idx) => (
                <div className={`d-flex align-items-center gap-2 position-relative ${salesOrderData.length - 1 != idx && 'mb-2'} `} key={idx}>
                    <div className="avatar-md flex-shrink-0">{<img src={item.image} alt="product-pic" height={36} />}</div>
                    <div>
                        <h5 className="fs-14 my-1">
                            <Link href="/e-commerce/order-details" className="stretched-link link-reset">
                                {item.title}
                            </Link>
                        </h5>
                        <span className="text-muted fs-12">
                            ${item.price} x {item.quantity} = ${item.price * item.quantity}
                        </span>
                    </div>
                    <div className="ms-auto">
                        <span className={`badge badge-soft-${item.orderStatus == 'Return' ? 'danger' : 'success'} px-2 py-1`}>
                            {item.orderStatus}
                        </span>
                    </div>
                </div>
            ))}
            <div className="mt-3 text-center">
                <Link href="" className="text-decoration-underline fw-semibold ms-auto link-offset-2 link-dark">
                    View All
                </Link>
            </div>
        </CardBody>
    );
};

export default Orders;
