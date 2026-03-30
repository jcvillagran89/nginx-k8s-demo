import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type SupervisionStatsCardProps = {
    stats: {
        total: number;
        pending_review: number;
        approved: number;
        rejected: number;
    };
};

const SupervisionStatsCards: React.FC<SupervisionStatsCardProps> = ({ stats }) => {
    const cards = [
        {
            key: "total",
            title: "Total Muestras",
            value: stats.total,
            icon: "tabler:clipboard",
            iconBgClass: "bg-info-subtle",
            color: "info",
        },
        {
            key: "pending_review",
            title: "Pendientes en Revisión",
            value: stats.pending_review,
            icon: "tabler:clock",
            iconBgClass: "bg-warning-subtle",
            color: "warning",
        },
        {
            key: "approved",
            title: "Aprobadas",
            value: stats.approved,
            icon: "tabler:circle-check",
            iconBgClass: "bg-success-subtle",
            color: "success",
        },
        {
            key: "rejected",
            title: "Rechazadas",
            value: stats.rejected,
            icon: "tabler:circle-x",
            iconBgClass: "bg-danger-subtle",
            color: "danger",
        },
    ];

    return (
        <Row className="g-3">
            {cards.map((card) => (
                <Col key={card.key} xs={12} md={6} xl={3}>
                    <Card className="h-70 border-0 shadow-sm rounded-4">
                        <Card.Body className="d-flex flex-column justify-content-between p-3">

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="me-1">
                                    <div className="fw-semibold fs-5">{card.title}</div>
                                </div>

                                <div
                                    className={`d-inline-flex align-items-center justify-content-center rounded-3 ${card.iconBgClass}`}
                                    style={{ width: 46, height: 46 }}
                                >
                                    <IconifyIcon icon={card.icon} className="fs-3" />
                                </div>
                            </div>

                            {/* Value */}
                            <div className="mt-3">
                                <span className="fw-bold fs-3">{card.value}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default SupervisionStatsCards;
