import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import PageTitle from '@/components/PageTitle';
import { Button, Col, Row, Modal } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

// Componentes de supervisión
import SupervisionInfoCard from '@/components/_supervision/SupervisionInfoCard';
import SupervisionProgress from '@/components/_supervision/SupervisionProgress';
import SupervisionTestResultsList from '@/components/_supervision/SupervisionTestResultsList';

// MODALES
import SupervisionApproveModal from '@/components/_supervision/SupervisionApproveModal';
import SupervisionRejectModal from '@/components/_supervision/SupervisionRejectModal';

const TestShow = () => {
  const { testRequest } = usePage().props as { testRequest: any };

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showSendToCommittee, setShowSendToCommittee] = useState(false);
  const [sending, setSending] = useState(false);
  const [returning, setReturning] = useState(false);

  const results = testRequest?.test?.[0]?.results ?? [];

  const allTestsReviewed = results.every((result: any) => {
    const content = result.content ?? {};

    return Object.values(content).every((test: any) => {
      if (!test || typeof test !== "object") return true;
      if (!("approved" in test)) return true;

      return test.approved !== null;
    });
  });

  const canDecide =
    testRequest.in_committee != 1 && allTestsReviewed;

  const canSendToCommittee =
    allTestsReviewed && testRequest.in_committee == 0;

  const returnAnalist = (testRequestId: number) => {
    setReturning(true);

    router.post(
      '/supervision/return',
      {
        test_request_id: testRequestId,
      },
      {
        preserveScroll: true,
        onFinish: () => {
          setReturning(false);
        },
      }
    );
  };

  const handleSendToCommittee = () => {
    setSending(true);

    router.post(
      route('supervision.send', testRequest.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setSending(false);
          setShowSendToCommittee(false);
        },
      }
    );
  };

  return (
    <MainLayout>
      <Head title={`Solicitud #${testRequest.number}`} />

      <PageTitle title={`Solicitud #${testRequest.number}`} />

      <Row className="mt-3">
        <Col>
          <div className="d-flex justify-content-end gap-2 mb-3">

            <Button
              variant="soft-info"
              disabled={returning}
              onClick={() => returnAnalist(testRequest.id)}
            >
              <IconifyIcon icon="tabler:arrow-back-up" className="me-1" />
              {returning ? 'Regresando...' : 'Regresar a análisis'}
            </Button>

            <Button
              variant={canSendToCommittee ? "soft-info" : "primary"}
              disabled={!canSendToCommittee}
              onClick={() => setShowSendToCommittee(true)}
            >
              <IconifyIcon icon="tabler:send" className="me-1" />
              Enviar a comité
            </Button>

            <Button
              variant={canDecide ? "soft-danger" : "primary"}
              disabled={!canDecide}
              onClick={() => setShowReject(true)}
            >
              <IconifyIcon icon="tabler:x" className="me-1" />
              Rechazar solicitud
            </Button>

            <Button
              variant={canDecide ? "soft-success" : "primary"}
              disabled={!canDecide}
              onClick={() => setShowApprove(true)}
            >
              <IconifyIcon icon="tabler:check" className="me-1" />
              Aprobar solicitud
            </Button>

            <Link href={route('supervision.index')}>
              <Button variant="soft-secondary">
                <IconifyIcon icon="tabler:arrow-left" className="me-1" />
                Regresar
              </Button>
            </Link>
          </div>

        </Col>
      </Row>

      <SupervisionInfoCard testRequest={testRequest} />

      <SupervisionProgress testRequest={testRequest} />

      <SupervisionTestResultsList testRequest={testRequest} />

      <SupervisionApproveModal
        show={showApprove}
        onHide={() => setShowApprove(false)}
        testRequest={testRequest}
        testData={{
          testName: "Aprobación total de la muestra. Sin enviar a comité"
        }}
      />

      <SupervisionRejectModal
        show={showReject}
        onHide={() => setShowReject(false)}
        testRequest={testRequest}
        testData={{
          testName: "Rechazo total de la muestra."
        }}
      />

      <Modal
        show={showSendToCommittee}
        onHide={() => !sending && setShowSendToCommittee(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enviar a Comité de Análisis</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            ¿Está seguro que desea enviar la solicitud{' '}
            <strong>#{testRequest.number}</strong> al Comité de Análisis?
          </p>
          <p className="text-muted mb-0">
            Esta acción moverá la muestra al módulo de comité para su evaluación final.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger"
            disabled={sending}
            onClick={() => setShowSendToCommittee(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="success"
            disabled={sending}
            onClick={handleSendToCommittee}
          >
            <IconifyIcon icon="tabler:send" className="me-1" />
            {sending ? 'Enviando...' : 'Enviar a comité'}
          </Button>
        </Modal.Footer>
      </Modal>

    </MainLayout>
  );
};

export default TestShow;