import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CardStats = ({ cards }) => {

    const safeCards = cards ?? {};

    const cardList = [
        {
            key: 'tests',
            title: "Total Pruebas",
            value: safeCards.total_tests,
            icon: "tabler:clipboard",
            iconBgClass: "bg-success-subtle text-success",
            details: [
                { title: "En proceso", value: safeCards.tests_in_progress },
                { title: "Pendientes revisión", value: safeCards.tests_pending_review },
                { title: "En comité", value: safeCards.tests_in_committee },
                { title: "Reingresos", value: safeCards.tests_reentry },
            ],
        },
        {
            key: 'tests_month',
            title: "Pruebas este Mes",
            value: safeCards.tests_this_month,
            icon: "tabler:calendar-month",
            iconBgClass: "bg-secondary-subtle text-secondary",
            details: [
                { title: "Aprobadas", value: safeCards.tests_approved_this_month },
                { title: "Rechazadas", value: safeCards.tests_rejected_this_month },
                { title: "En comité", value: safeCards.tests_in_committee_this_month },
                { title: "Reingresos", value: safeCards.tests_reentry_this_month },
            ],
        },
        {
            key: 'tests_week',
            title: "Pruebas esta Semana",
            value: safeCards.tests_this_week,
            icon: "tabler:calendar-week",
            iconBgClass: "bg-info-subtle text-info",
            details: [
                { title: "En proceso", value: safeCards.tests_in_progress_this_week },
                { title: "Pendientes revisión", value: safeCards.tests_pending_review_this_week },
            ],
        },
        {
            key: 'users',
            title: "Total Usuarios",
            value: safeCards.total_users,
            icon: "tabler:user",
            iconBgClass: "bg-primary-subtle text-primary",
            details: [
                { title: "Verificados", value: safeCards.users_verified },
                { title: "Nuevos (mes)", value: safeCards.new_users_this_month },
            ],
        },
    ];

    return (
        <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1 g-3">
            {cardList.map((card) => {
                const details = (card.details ?? []).filter((detail) => detail.value !== undefined && detail.value !== null && detail.value !== "");

                return (
                <Col key={card.key} xs={12} md={6} xl={3}>
                    <Card className="h-100 border-0 shadow-sm rounded-4">
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="flex-grow-1">
                                    <h5 className="text-muted fs-13 text-uppercase mb-1">
                                        {card.title}
                                    </h5>
                                    <h3 className="mb-0 fw-bold">
                                        {card.value ?? 0}
                                    </h3>
                                </div>

                                <div className="avatar-md flex-shrink-0">
                                    <span className={`avatar-title rounded fs-22 ${card.iconBgClass}`}>
                                        <IconifyIcon icon={card.icon} />
                                    </span>
                                </div>
                            </div>

                            {details.length > 0 && (
                                <div className="mt-3">
                                    {details.map((detail, idx) => (
                                        <p className="mb-1" key={idx}>
                                            <span className="text-primary me-1">
                                                <IconifyIcon icon="tabler:minus" />
                                            </span>
                                            <span className="text-nowrap text-muted">{detail.title}</span>
                                            <span className="float-end">
                                                <b>{detail.value}</b>
                                            </span>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            );
            })}
            <br></br>
        </Row>
    );
};

export default CardStats;
