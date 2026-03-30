import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { invoiceData } from '../data';

const InvoicesStat = () => {
    return (
        <>
            <Card>
                <CardBody className="p-0">
                    <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1 g-0 text-center align-items-center">
                        {invoiceData.map((item, idx) => (
                            <Col className="border-end border-light border-dashed" key={idx}>
                                <div className="mt-3 mt-md-0 p-3">
                                    <h5 className="text-muted fs-13 text-uppercase" title="Number of Orders">
                                        {item.title}
                                    </h5>
                                    <div className="d-flex align-items-center justify-content-center gap-2 my-3">
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className={`avatar-title bg-${item.variant}-subtle text-${item.variant} rounded-circle fs-22`}>
                                                <IconifyIcon icon={item.icon} />
                                            </span>
                                        </div>
                                        <h3 className="mb-0 fw-bold">{item.count}</h3>
                                    </div>
                                    <p className="mb-0 text-muted">
                                        <span className={`text-${item.isUp ? 'success' : 'danger'} me-2 icons-center `}>
                                            {item.change}% &nbsp;
                                            {item.isUp ? (
                                                <IconifyIcon icon="tabler:caret-up-filled" />
                                            ) : (
                                                <IconifyIcon icon="tabler:caret-down-filled" />
                                            )}
                                        </span>
                                        <span className="text-nowrap">Since last month</span>
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};

export default InvoicesStat;
