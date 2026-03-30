// react
import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
// bootstrap
import { Button, Card, CardFooter, Col, Row } from 'react-bootstrap';
// components
import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TestResultsSummary from '@/components/_test-results/TestResultsSummary';
import ConfirmModal from '@/components/_general/ConfirmModal';
import TestRequestFilters from "@/components/_test/TestRequestFilters";
import { getImageUrl } from '@/utils/image';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const truncateText = (value: string, max = 30) => {
  if (!value) return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

const TestResultsPage = () => {
  type TestResult = {
    id: number;
    created_at: string;
    finished_at: string | null;
    test_request: {
      number: string;
      style_id: string | number;
    };
  };

  type Paginated<T> = {
    data: T[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };

  const { testResults, filters, stats } = usePage().props as unknown as {
    testResults: Paginated<TestResult>;
    filters?: {
      q?: string;
      per_page?: number | string;
      status?: number | string;
      date_range?: string;
    };
    stats: {
      inAnalysis: number;
      pending: number;
      inProcess: number;
      completed: number;
    };
  };

  const [searchTerm, setSearchTerm] = useState(filters?.q ?? "");
  const [statusFilter, setStatusFilter] = useState(filters?.status ?? 1);
  const [dateRange, setDateRange] = useState(filters?.date_range ?? "");
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; testId: number | null }>({
    show: false,
    testId: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const rows = (testResults.data ?? []).map((item: any) => {
    const analystSet = new Set<string>();
    const technicianName = item.test_request?.technician?.name ?? '';
    let totalSectionsWithStatus = 0;
    let pendingSections = 0;
    (item.results ?? []).forEach((result: any) => {
      const content = result.content ?? {};

      Object.values(content).forEach((section: any) => {
        if (section && typeof section === 'object') {
          if ('user_name' in section && section.user_name) {
            analystSet.add(section.user_name as string);
          }
          if ('status' in section) {
            totalSectionsWithStatus++;
            const statusValue = Number(section.status);
            if (statusValue === 0 || statusValue === 1) {
              pendingSections++;
            }
          }
        }
      });
    });
    const analystNames = technicianName ? [technicianName] : Array.from(analystSet);
    return {
      id: item.id,
      folio: item.test_request?.number ?? '',
      fechaIngreso: formatDate(item.created_at),
      fechaSalida: item.finished_at ? formatDate(item.finished_at) : '--',
      sku: item.test_request?.item ?? 'DESCONOCIDO',
      image_id: item.test_request?.image_id ?? null,
      image: item.test_request?.image ?? null,
      styleDescription: item.test_request?.style?.description ?? '',
      styleId: item.test_request?.style?.id ?? null,
      notes: item.test_request?.notes ?? '',
      technician: analystNames,
      pruebasPendientes: pendingSections,
      totalPruebas: totalSectionsWithStatus
    };
  });

  const handleSendToReview = () => {
    if (!confirmModal.testId) return;
    setSubmitting(true);
    router.put(
      route('test-results.review', { id: confirmModal.testId }),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setSubmitting(false);
          setConfirmModal({ show: false, testId: null });
        },
      },
    );
  };

  return (
    <MainLayout>
      <PageTitle
        title="Análisis de Solicitudes"
        subTitle="Análisis"
      />
      <div className="mt-3">
        <p className="mb-0 text-muted">
          Gestiona y registra los resultados de las pruebas de laboratorio.
        </p>
        <br />
        <TestResultsSummary stats={stats} />
      </div>
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm rounded-4">
            <TestRequestFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              filters={filters}
              routeName="test-results"
              showCreate={false}
              searchPlaceholder="Buscar muestra (folio, sku, estilo, proveedor)"
            />

            {/* TABLA */}
            <div className="table-responsive mt-3">
              <table className="table table-nowrap mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Folio</th>
                    <th>Fecha Ingreso</th>
                    <th>SKU/ ESTILO</th>
                    <th>Analista</th>
                    <th>Pruebas Pendientes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((req) => (
                    <tr key={req.id}>
                      <td>{req.folio}</td>
                      <td>{req.fechaIngreso}</td>
                      <td>
                        {(() => {
                          const imageUrl = getImageUrl(req.image_id) ?? req.image;
                          if (!imageUrl) {
                            return req.sku;
                          }

                          return (
                          <div className="d-flex justify-content-start align-items-center gap-3">
                            <div className="avatar-md">
                              <img
                                src={imageUrl}
                                alt=" "
                                className="img-fluid rounded-2"
                              />
                            </div>
                            {req.sku}
                          </div>
                          );
                        })()}
                        {req.styleDescription && (
                          <p className="mb-0">
                            <span className="text-muted">
                              {truncateText((req.styleId !== 1 && req.styleDescription) ?? req.notes)}
                            </span>
                          </p>
                        )}
                      </td>
                      <td>
                        {(!req.technician || req.technician.length === 0) ? (
                          <span className="text-muted">Sin asignar</span>
                        ) : (
                          <div className="d-flex align-items-center gap-1">
                            {req.technician.map((name: string, index: number) => {
                              const parts = name.trim().split(' ');
                              const first = parts[0] ?? '';
                              const last = parts.length > 1 ? parts[parts.length - 1] : '';
                              const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

                              return (
                                <div
                                  key={index}
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: 28,
                                    height: 28,
                                    backgroundColor: '#0d6efd20',
                                    border: '1px solid #0d6efd55',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    cursor: 'default',
                                  }}
                                  title={name}
                                >
                                  {initials || '?'}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>
                        {(!req.totalPruebas || req.totalPruebas === 0) ? (
                          <span className="text-muted">--</span>
                        ) : (
                          <span
                            className={[
                              'badge rounded-pill',
                              req.pruebasPendientes > 0
                                ? 'bg-warning-subtle text-warning-emphasis'
                                : 'bg-success-subtle text-success-emphasis'
                            ].join(' ')}
                            style={{ fontSize: '0.8rem' }}
                          >
                            {req.pruebasPendientes}/{req.totalPruebas}
                          </span>
                        )}
                      </td>
                      <td>
                        <Link href={route('test-results.detail', { test: req.id })}>
                            <Button
                                variant="soft-primary"
                                size="sm"
                                className="btn-icon rounded-circle me-2"
                            >
                                <IconifyIcon icon="tabler:eye" className="fs-16" />
                            </Button>
                        </Link>
                        {req.pruebasPendientes === 0 && req.totalPruebas > 0 && (
                          <Button
                            type="button"
                            variant="soft-success"
                            size="sm"
                            className="btn-icon rounded-circle"
                            title="Enviar a revisión"
                            onClick={() =>
                              setConfirmModal({
                                show: true,
                                testId: req.id,
                              })
                            }
                          >
                            <IconifyIcon icon="tabler:send" className="fs-16" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CardFooter>
              <div className="d-flex align-items-center justify-content-between gap-3">
                {/* Selector de filas */}
                <div className="d-flex align-items-center gap-2">
                  <span>Filas:</span>
                  <select
                    value={filters?.per_page ?? 10}
                    onChange={(e) =>
                      router.get(
                        route("test-results"),
                        {
                          ...filters,
                          per_page: e.target.value,
                          q: searchTerm,
                          status: statusFilter,
                          date_range: dateRange,
                          page: 1,
                        },
                        { preserveState: true, preserveScroll: true }
                      )
                    }
                    className="form-select form-select-sm"
                    style={{ width: 80 }}
                  >
                    {[10, 15, 25, 50].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Paginación */}
                <ul className="pagination mb-0">
                  {testResults.links.map((link, i) => {
                    let label = link.label;

                    if (label.includes('Previous')) label = '&laquo;';
                    if (label.includes('Next')) label = '&raquo;';

                    return (
                      <li
                        key={i}
                        className={[
                          'page-item',
                          link.active ? 'active' : '',
                          !link.url ? 'disabled' : '',
                        ].join(' ')}
                      >
                        {link.url ? (
                          <Link
                            href={link.url}
                            className="page-link"
                            preserveState
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: label }}
                          />
                        ) : (
                          <span
                            className="page-link"
                            dangerouslySetInnerHTML={{ __html: label }}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <ConfirmModal
        show={confirmModal.show}
        title="Enviar a revisión"
        body="Se enviará la solicitud a revisión. ¿Deseas continuar?"
        confirmText="Enviar a revisión"
        confirmVariant="success"
        cancelText="Cancelar"
        loading={submitting}
        onConfirm={handleSendToReview}
        onClose={() => {
          if (!submitting) {
            setConfirmModal({ show: false, testId: null });
          }
        }}
      />
    </MainLayout>
  );
};

export default TestResultsPage;
