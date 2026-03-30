import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  Badge,
  Button,
  Collapse,
  Modal,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getImageUrl } from '@/utils/image';

type Props = {
  test_requests: any;
  test_results: any;
  analysts: any;
};

const truncateText = (value: string, max = 30) => {
  if (!value) return value;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

const TestRequestsTable: React.FC<Props> = ({ test_requests, test_results, analysts }) => {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [assignatedTo, setAssignatedTo] = useState<number | null>(analysts[0]?.id);

  const toggleRow = (rowId: number) => {
    setOpenRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleOpenModal = (item: any) => {
    setSelectedRequest(item);
    setImageUrl(getImageUrl(item.image_id) ?? item.image ?? undefined);
    setImageLoadError(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleImageError = () => {
    setImageLoadError(true);
    setImageUrl(undefined);
  };

  const handleSelectChange = (e) => {
    setAssignatedTo(e.target.value);
  }

  const handleSendRequest = () => {
    if (!selectedRequest) return;

    router.post(
      route('test.request.send', selectedRequest.id),
      { assignated_to: assignatedTo },
      {
        onFinish: () => setShowModal(false),
        preserveScroll: true,
      }
    );
  };

  const handleCancelRequest = () => {
    if (!selectedRequest) return;

    router.post(
      route('test.request.cancel', selectedRequest.id),
      {},
      {
        onFinish: () => setShowModal(false),
        preserveScroll: true,
      }
    );
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
      case 7:
        return <Badge bg="danger">Aprobado por comite</Badge>;
      case 8:
        return <Badge bg="danger">Rechazado por comite</Badge>;
      case 9:
        return <Badge bg="danger">En reingreso</Badge>;
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

  const reEntryRowStyle: React.CSSProperties = {
    backgroundColor: "rgba(220, 53, 69, 0.08)",
    borderLeft: "4px solid rgba(220, 53, 69, 0.35)",
  };

  return (
    <>
      <table className="table table-nowrap mb-0 align-middle">
        <thead className="bg-light-subtle">
          <tr>
            <th>Folio</th>
            <th>Fecha Ingreso</th>
            <th>Analista</th>
            <th>SKU / ESTILO</th>
            <th>Proveedor</th>
            <th>Pruebas</th>
            <th>Status</th>
            <th className="text-center" style={{ width: 160 }}>
              Acción
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
              let initials = "";
              if (item.technician) {
                const parts = item.technician?.name.trim().split(" ");
                const first = parts[0] ?? "";
                const last = parts.length > 1 ? parts[parts.length - 1] : "";
                initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
              }

              return (
                <React.Fragment key={rowId}>
                  <tr style={item.is_re_entry == '1' ? reEntryRowStyle : undefined}>
                    <td>{item.number}</td>

                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : 'Sin fecha'}
                    </td>

                    <td>
                      {item.technician ? (<div
                        key={`ava-${rowId}`}
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 28,
                          height: 28,
                          backgroundColor: "#0d6efd20",
                          border: "1px solid #0d6efd55",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                        title={item.technician?.name}
                      >
                        {initials || "?"}
                      </div>) : 'Sin asignar'}
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

                    <td>
                      {item.test?.[0]?.results?.[0]?.content
                        ? Object.keys(
                          item.test[0].results[0].content
                        ).length
                        : 0}
                    </td>

                    <td>{getStatusBadge(item.status)}</td>

                    <td className="pe-3 text-center">
                      <div className="hstack gap-1 justify-content-center">
                        {/* Botón modal resumen (enviar/cancelar) */}
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip(
                            `tooltip-summary-${rowId}`,
                            'Ver resumen / acciones'
                          )}
                        >
                          <Button
                            variant={item.status == 0 ? "soft-success" : "primary"}
                            size="sm"
                            disabled={item.status != 0}
                            className="btn-icon rounded-circle"
                            onClick={() => handleOpenModal(item)}
                          >
                            <IconifyIcon
                              icon="tabler:send"
                              className="fs-16"
                            />
                          </Button>
                        </OverlayTrigger>

                        {/* Ver detalle */}
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip(
                            `tooltip-view-${rowId}`,
                            'Ver detalle'
                          )}
                        >
                          <Link href={route('test.request.show', item.id)}>
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

                        {/* Editar */}
                        {item.status == 0 && (
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip(
                              `tooltip-edit-${rowId}`,
                              'Editar solicitud'
                            )}
                          >
                            <Link href={route('test.request.edit', item.id)}>
                              <Button
                                variant="soft-warning"
                                size="sm"
                                className="btn-icon rounded-circle"
                              >
                                <IconifyIcon
                                  icon="tabler:edit"
                                  className="fs-16"
                                />
                              </Button>
                            </Link>
                          </OverlayTrigger>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={9} className="bg-light-subtle p-0">
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
              <td colSpan={9} className="text-center text-muted py-4">
                No hay solicitudes registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL RESUMEN */}
      {selectedRequest && (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Solicitud #{selectedRequest.number ?? selectedRequest.id}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-md-5 d-flex flex-column align-items-center">
                  {!imageLoadError && imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=" "
                      style={{ maxHeight: '300px' }}
                      className="img-fluid mt-2 rounded"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-100 d-flex align-items-center justify-content-center border rounded py-4 text-muted">
                      Sin imagen disponible
                    </div>
                  )}
                </div>

                <div className="col-md-7">
                  <div className="mb-2">
                    <strong>SKU / Estilo:</strong>{' '}
                    {selectedRequest.item}
                  </div>
                  <div className="mb-2">
                    <strong>Descripción:</strong>{' '}
                    {selectedRequest.style?.description ?? 'S/N'}
                  </div>
                  <div className="mb-2">
                    <strong>Proveedor:</strong>{' '}
                    {selectedRequest.style?.provider?.name ?? 'S/N'}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong>{' '}
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="mb-2">
                    <strong>Notas:</strong>{' '}
                    {selectedRequest.notes || (
                      <span className="text-muted">Sin notas</span>
                    )}
                  </div>

                  <hr />

                  <div>
                    <strong>Pruebas solicitadas:</strong>
                    {modalContentKeys.length > 0 ? (
                      <ul className="mt-2 mb-0">
                        {modalContentKeys.map((name: string) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-2 text-muted">
                        Sin pruebas registradas
                      </div>
                    )}
                  </div>

                  <br />

                  <div>
                    <strong>Asignar a:</strong>
                    <select className='form-select' id="lab_technician" name="lab_technician" onChange={handleSelectChange}>
                      {analysts.length > 0 ? (
                        analysts.map((technician: any) => (
                          <option key={technician.id} value={technician.id}>{technician.name}</option>
                        ))
                      ) : (
                        <option>No analysts available</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="soft-danger"
              onClick={handleCancelRequest}
            >
              <IconifyIcon icon="tabler:x" className="me-1" />
              Cancelar solicitud
            </Button>
            <Button
              variant="soft-success"
              onClick={handleSendRequest}
            >
              <IconifyIcon icon="tabler:send" className="me-1" />
              Enviar solicitud
            </Button>
          </Modal.Footer>
        </Modal>

      )}
    </>
  );
};

export default TestRequestsTable;
