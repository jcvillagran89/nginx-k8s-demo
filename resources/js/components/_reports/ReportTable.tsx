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

type Props = {
    test_requests: any;
    test_results: any;
};

const ReportTable: React.FC<Props> = ({ test_requests }) => {
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
            case 7:
                return <Badge bg="success">Aprobado Comite</Badge>;
            case 8:
                return <Badge bg="danger">Rechazado Comite</Badge>;
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
                            <th>SKU</th>
                            <th>Descripción</th>
                            <th>Proveedor</th>
                            <th>Analista</th>
                            <th>Pruebas Completadas</th>
                            <th>Estado</th>
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

                                            {item.style?.number?.length > 0 ? (
                                                <td>{item.style.number}</td>
                                            ) : (
                                                <td>{item.item}</td>
                                            )}

                                            <td>{item.style?.description ?? 'S/N'}</td>
                                            <td>{item.style?.provider?.name ?? 'S/N'}</td>
                                            <td>{item.analyst?.name ?? 'S/N'}</td>

                                            <td>{item.completed_tests}/{item.total_tests}</td>
                                            <td>{getStatusBadge(item.status)}</td>

                                            <td className="pe-3 text-center">
                                                <div className="hstack gap-1 justify-content-center">

                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={renderTooltip(
                                                            `tooltip-view-${rowId}`,
                                                            'Previsualizar reporte'
                                                        )}
                                                    >
                                                        <a
                                                            href={route('reports.preview', item.id)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button
                                                                variant="soft-secondary"
                                                                size="sm"
                                                                className="btn-icon rounded-circle"
                                                            >
                                                                <IconifyIcon icon="tabler:eye" className="fs-16" />
                                                            </Button>
                                                        </a>
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={renderTooltip(
                                                            `tooltip-download-${rowId}`,
                                                            'Descargar PDF'
                                                        )}
                                                    >
                                                        <a
                                                            href={route('reports.preview', item.id) + '?download=true'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button
                                                                variant="soft-success"
                                                                size="sm"
                                                                className="btn-icon rounded-circle"
                                                            >
                                                                <IconifyIcon icon="tabler:download" className="fs-16" />
                                                            </Button>
                                                        </a>
                                                    </OverlayTrigger>


                                                    {Number(item.report_sent) === 0 && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={renderTooltip(
                                                                `tooltip-send-${rowId}`,
                                                                'Enviar reporte al proveedor'
                                                            )}
                                                        >
                                                            <Button
                                                                variant="soft-primary"
                                                                size="sm"
                                                                className="btn-icon rounded-circle"
                                                                onClick={() => {
                                                                    router.post(route('reports.send', item.id));
                                                                }}
                                                            >
                                                                <IconifyIcon icon="tabler:mail-forward" className="fs-16" />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    )}

                                                    {Number(item.report_sent) === 1 && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={renderTooltip(
                                                                `tooltip-sent-${rowId}`,
                                                                'Reporte enviado al proveedor'
                                                            )}
                                                        >
                                                            <span className="text-success fs-18">
                                                                <IconifyIcon icon="tabler:mail-check" />
                                                            </span>
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

            </div>
        </>
    );
};

export default ReportTable;
