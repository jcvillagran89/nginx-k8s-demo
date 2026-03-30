import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { statData, StatType } from '../data';

const StatCard = ({ count, details, icon, title, isLabel, isDot }: StatType) => {
    return (
        <Card>
            <CardBody>
                <Link href="" className="text-muted float-end mt-n1 fs-18">
                    <IconifyIcon icon="tabler:external-link" />
                </Link>
                <h5 className="text-muted fs-13 text-uppercase" title="Number of Orders">
                    {title}
                </h5>
                <div className="d-flex align-items-center gap-2 my-3">
                    <div className="avatar-md flex-shrink-0">
                        <span className="avatar-title bg-primary-subtle text-primary rounded fs-22">
                            <IconifyIcon icon={icon} />
                        </span>
                    </div>
                    <h3 className="mb-0 fw-bold">
                        {count} {isLabel && <span className="badge text-bg-success fw-medium ms-2 fs-12">{isLabel}</span>}
                    </h3>
                </div>
                {details.map((data, idx) => (
                    <p className="mb-1" key={idx}>
                        <span className="text-primary me-1">
                            {' '}
                            {isDot ? <IconifyIcon icon="tabler:point-filled" /> : <IconifyIcon icon="tabler:minus" />}{' '}
                        </span>
                        <span className="text-nowrap text-muted">{data.title}</span>
                        <span className="float-end">
                            <b>{data.count}</b>
                        </span>
                    </p>
                ))}
            </CardBody>
        </Card>
    );
};

const Stat = () => {
    return (
        <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1 align-items-center">
            {statData.map((item, idx) => {
                return (
                    <Col key={idx}>
                        <StatCard {...item} />
                    </Col>
                );
            })}
        </Row>
    );
};

export default Stat;
