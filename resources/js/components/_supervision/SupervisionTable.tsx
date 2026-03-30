import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  Badge,
  Button,
  Collapse,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getImageUrl } from '@/utils/image';

type Props = {
  test_requests: any;
  test_results: any;
};

const truncateText = (value: string, max = 30) => {
  if (!value) return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

const TestRequestsTable: React.FC<Props> = ({ test_requests }) => {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const toggleRow = (rowId: number) => {
    setOpenRowId((prev) => (prev === rowId ? null : rowId));
  };

  const getStatusBadge = (status: number | string) => {
    const s = Number(status);
    switch (s) {
      case 0:
        return <Badge bg="primary">Creado</Badge>;
      case 1:
        return <Badge bg="secondary">En Progreso</Badge>;
      case 2:
        return <Badge bg="warning">Revisión pendiente</Badge>;
      case 3:
        return <Badge bg="info">Revisión completada</Badge>;
      case 4:
        return <Badge bg="success">Aprobado</Badge>;
      case 5:
        return <Badge bg="danger">Rechazado</Badge>;
      default:
        return (
          <Badge bg="light" text="dark">
            Desconocido
          </Badge>
        );
    }
  };

  const getCommitteeBadge = (in_committee: number | string) => {
    const ic = Number(in_committee);
    switch (ic) {
      case 0:
        return <Badge bg="danger">No enviado</Badge>;
      case 1:
        return <Badge bg="success">Enviado</Badge>;
      default:
        return (
          <Badge bg="light" text="dark">
            Desconocido
          </Badge>
        );
    }
  };

  const renderTooltip = (id: string, text: string) => (
    <Tooltip id={id}>{text}</Tooltip>
  );

  // Para el modal: obtener contentKeys del selectedRequest
  const modalContentKeys = (() => {
    if (!selectedRequest?.test?.[0]?.results?.[0]?.content) return [];
    return Object.keys(selectedRequest.test[0].results[0].content);
  })();

  return (
    <>
      <div className="table-responsive mt-3">
        <table className="table table-nowrap mb-0">
          <thead className="bg-light-subtle">
            <tr>
              <th>Folio</th>
              <th>Fecha Ingreso</th>
              <th>SKU / ESTILO</th>
              <th>Proveedor</th>
              <th>Pruebas Completadas</th>
              <th>Estado</th>
              <th>Comité</th>
              <th className="text-center" style={{ width: 160 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {test_requests?.data?.length ? (
              test_requests.data.map((item: any, idx: number) => {
                const rowId = item.id ?? idx;
                const content = item.test?.[0]?.results?.[0]?.content ?? null;
                const contentKeys = content ? Object.keys(content) : [];
                const styleDescription = (item.style?.id !== 1 && item.style?.description) ?? item.notes ?? '';

                return (
                  <React.Fragment key={rowId}>
                    <tr>
                      <td>{item.number}</td>

                      <td>
                        {item.created_at
                          ? new Date(
                            item.created_at
                          ).toLocaleString()
                          : 'Sin fecha'}
                      </td>

                      <td>
                        {(getImageUrl(item.image_id) || item.image) ? (
                          <div className="d-flex justify-content-start align-items-center gap-3">
                            <div className="avatar-md">
                              <img
                                src={getImageUrl(item.image_id) ?? item.image ?? ''}
                                alt=" "
                                className="img-fluid rounded-2"
                              />
                            </div>
                            {item.item}
                          </div>
                        ) : (
                          item.item
                      )}
                      {item.style?.description && (
                        <p className="mb-0">
                          <span className="text-muted">{truncateText(styleDescription)}</span>
                        </p>
                      )}
                    </td>

                      <td>{item.style?.provider?.name ? truncateText(item.style?.provider?.name) : 'S/N'}</td>

                      <td>{item.completed_tests}/{item.total_tests}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{getCommitteeBadge(item.in_committee)}</td>

                      <td className="pe-3 text-center">
                        <div className="hstack gap-1 justify-content-center">

                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip(
                              `tooltip-view-${rowId}`,
                              'Ver detalle'
                            )}
                          >
                            <Link href={route('supervision.show', item.id)}>
                              <Button
                                variant="soft-secondary"
                                size="sm"
                                className="btn-icon rounded-circle"
                              >
                                <IconifyIcon
                                  icon="tabler:eye"
                                  className="fs-16"
                                />
                              </Button>
                            </Link>
                          </OverlayTrigger>

                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={8} className="bg-light-subtle p-0">
                        <Collapse in={openRowId === rowId}>
                          <div className="p-2">
                            {contentKeys.length > 0 ? (
                              <table className="table table-sm mb-0 mt-2">
                                <thead>
                                  <tr>
                                    <th>Pruebas solicitadas</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {contentKeys.map((key) => (
                                    <tr key={key}>
                                      <td>{key}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <span className="text-muted">
                                Sin pruebas registradas
                              </span>
                            )}
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No hay solicitudes registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </>
  );
};

export default TestRequestsTable;
