import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type TestResultsSummaryProps = {
  stats: {
    inAnalysis: number;
    pending: number;
    inProcess: number;
    completed: number;
  };
};

const TestResultsSummary: React.FC<TestResultsSummaryProps> = ({ stats }) => {
  const cards = [
    {
      key: 'inAnalysis',
      title: 'Solicitudes en Análisis',
      value: stats.inAnalysis,
      icon: 'tabler:test-pipe',
      iconBgClass: 'bg-primary-subtle',
    },
    {
      key: 'pending',
      title: 'Pruebas Pendientes',
      value: stats.pending,
      icon: 'tabler:clock',
      iconBgClass: 'bg-warning-subtle',
    },
    {
      key: 'inProcess',
      title: 'En Proceso',
      value: stats.inProcess,
      icon: 'tabler:test-pipe-2',
      iconBgClass: 'bg-secondary-subtle',
    },
    {
      key: 'completed',
      title: 'Completadas',
      value: stats.completed,
      icon: 'tabler:circle-check',
      iconBgClass: 'bg-success-subtle',
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
                  <div className="fw-semibold fs-5">
                    {card.title}
                  </div>
                </div>

                <div
                  className={`d-inline-flex align-items-center justify-content-center rounded-3 ${card.iconBgClass}`}
                  style={{ width: 46, height: 46 }}
                >
                  <IconifyIcon
                    icon={card.icon}
                    className="fs-3"
                  />
                </div>
              </div>

              {/* Valor */}
              <div>
                <span className="fw-bold fs-3">
                  {card.value}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TestResultsSummary;
