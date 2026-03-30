import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { ProductStat, productStatData } from '../data';

const ProductStatCard = ({ count, icon, title }: ProductStat) => {
    return (
        <Card>
            <CardBody className="text-center">
                <div className="avatar-lg bg-light rounded d-flex align-items-center justify-content-center mx-auto mb-2">
                    <IconifyIcon icon={icon} className="fs-32 text-warning" />
                </div>
                <Link href="" className="text-dark fs-16 fw-medium">
                    {title}
                </Link>
                <p className="mt-1 mb-0">{count} Items Available</p>
            </CardBody>
        </Card>
    );
};

const Stat = () => {
    return (
        <Row>
            {productStatData.map((item, idx) => (
                <Col lg={3} key={idx}>
                    <ProductStatCard {...item} />
                </Col>
            ))}
        </Row>
    );
};

export default Stat;
