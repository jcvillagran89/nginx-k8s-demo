import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Card, CardBody, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { paymentStatData, PaymentStatType } from '../data';

const PaymentCard = ({ count, icon, title, isMonth }: PaymentStatType) => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <div className="avatar-lg bg-primary bg-opacity-10 rounded flex-centered">
                            <IconifyIcon icon={icon} width={32} height={332} className="fs-32 text-primary" />
                        </div>
                    </div>
                    <div>
                        <CardTitle as={'h4'} className="mb-1 d-flex align-items-center gap-2">
                            {title}
                        </CardTitle>
                        <p className="text-primary fw-medium fs-20 mb-0">
                            {count}
                            {isMonth && <span className="fs-13 text-muted ms-1">/ Month</span>}{' '}
                        </p>
                    </div>
                    <Dropdown align={'end'} className="ms-auto">
                        <DropdownToggle as={'a'} className="drop-arrow-none text-muted card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler:dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardBody>
            <CardFooter className="border-top border-dashed">
                <Link href="" className="link-primary fw-medium">
                    View More <IconifyIcon icon="tabler:arrow-right" />
                </Link>
            </CardFooter>
        </Card>
    );
};

const PaymentStat = () => {
    return (
        <Row>
            {paymentStatData.map((item, idx) => (
                <Col xxl={3} xl={6} md={6} key={idx}>
                    <PaymentCard {...item} />
                </Col>
            ))}
        </Row>
    );
};

export default PaymentStat;
