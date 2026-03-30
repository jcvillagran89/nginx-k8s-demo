import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import PageTitle from '@/components/PageTitle';
import TestRequestShowDetail from '@/components/_test/TestRequestShowDetail';
import TestRequestShowDetailContent from '@/components/_test/TestRequestShowDetailContent';
import { Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getImageUrl } from '@/utils/image';

const TestRequestShow = () => {
  const { testRequest } = usePage().props as { testRequest: any };

  const imageUrl = getImageUrl(testRequest.image_id) ?? testRequest.image;

  const createdAt = (() => {
    try {
      return new Date(testRequest.created_at).toLocaleString('es-MX');
    } catch {
      return '--';
    }
  })();

  return (
    <MainLayout>
      <Head title={`Solicitud #${testRequest.number}`} />

      <PageTitle
          title={`Solicitud de Prueba`}
          subTitle="Detalle de pruebas asociadas"
      />

      <Row className="mt-3">
        <Col xs={12}>
          <TestRequestShowDetail
            title={`Solicitud #${testRequest.number}`}
            image={imageUrl}
            description={
              <div className="row g-4">
                {/* Estilo */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#f3ecff' }}
                    >
                      <IconifyIcon icon="tabler:tag" className="fs-20" />
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Estilo
                      </div>
                      <div className="fw-semibold">
                        {testRequest.style?.number ?? '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departamento */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#e6fbf6' }}
                    >
                      <IconifyIcon icon="tabler:building" className="fs-20" />
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Departamento
                      </div>
                      <div className="fw-semibold">
                        {testRequest.style?.department?.description ?? '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creado */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#fff2d9' }}
                    >
                      <IconifyIcon icon="tabler:calendar" className="fs-20" />
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Creado
                      </div>
                      <div className="fw-semibold">
                        {createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            {testRequest.test?.length ? (
              <>
                {testRequest.test.map((t: any) => (
                  <React.Fragment key={t.id}>
                    {t.results?.length ? (
                      <>
                        {t.results.map((r: any) => (
                          <div key={r.id} className="mb-3">
                            <TestRequestShowDetailContent result={r} />
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-muted">
                        No hay resultados para este test.
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <div className="text-muted">No hay pruebas asociadas.</div>
            )}
          </TestRequestShowDetail>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default TestRequestShow;
