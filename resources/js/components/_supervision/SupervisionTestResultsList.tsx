import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import SupervisionTestResultModal from "./SupervisionTestResultModal";

const SupervisionTestResultsList = ({ testRequest }) => {
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const testResults = testRequest?.test?.[0]?.results ?? [];

    if (!Array.isArray(testResults) || testResults.length === 0) {
        return (
            <div className="mt-10 bg-white rounded-4 p-6 shadow">
                <p className="text-danger fw-bold">
                    No hay resultados disponibles para esta solicitud.
                </p>
            </div>
        );
    }
    const statusLabels = {
        0: { label: "Pendiente", variant: "warning", icon: "tabler:clock" },
        1: { label: "En progreso", variant: "info", icon: "tabler:progress" },
        2: { label: "Completado", variant: "success", icon: "tabler:circle-check" },
    };
    const resultBadge = (approved) => {
        if (approved === true)
            return (
                <Badge bg="success" className="rounded-3">
                    <IconifyIcon icon="tabler:circle-check" className="me-1" height={15} />
                    Aprobado
                </Badge>
            );

        if (approved === false)
            return (
                <Badge bg="danger" className="rounded-3">
                    <IconifyIcon icon="tabler:circle-x" className="me-1" height={15} />
                    Rechazado
                </Badge>
            );

        if (approved === null)
            return (
                <Badge bg="secondary" className="rounded-3">
                    <IconifyIcon icon="tabler:eye" className="me-1" height={15} />
                    Sin revisión
                </Badge>
            );
    };

    return (
        <Card className="shadow-sm rounded-4 p-4">
                <h2 className="text-2xl fw-bold mb-1">Resultados de Tests</h2>
                <p className="text-muted mb-4">
                    Detalle de todos los tests realizados a la muestra
                </p>

                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-muted border-bottom">
                        <th className="py-3">Test</th>
                        <th>Estado</th>
                        <th>Resultado</th>
                        <th>Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {testResults.map((result, idx) => {
                        const test = Object.entries(result.content || {});

                        return test.map(([testName, testData], i) => {
                            const status = testData?.status_review ?? 0;
                            const approved = testData?.approved ?? null; // true/false/null

                            const s = statusLabels[status] || {};

                            return (
                                <tr key={`${idx}-${i}`} className="border-bottom align-middle">
                                    {/* Nombre del test */}
                                    <td className="py-4 fw-semibold text-gray-800">
                                        {testName}
                                    </td>

                                    {/* Badge de ESTADO */}
                                    <td className="py-4">
                                        <Badge bg={s.variant} className="rounded-3">
                                            <IconifyIcon icon={s.icon} className="me-1" height={15} />
                                            {s.label}
                                        </Badge>
                                    </td>

                                    {/* Resultado */}
                                    <td className="py-4">
                                        {resultBadge(approved)}
                                    </td>

                                    {/* Botón de detalle */}
                                    <td className="py-4">
                                        <Button
                                            variant="soft-secondary"
                                            size="sm"
                                            className="btn-icon rounded-circle"
                                            onClick={() => {
                                                setSelected({ ...result, testName, testData });
                                                setShowModal(true);
                                            }}
                                        >
                                            <IconifyIcon icon="tabler:eye" className="fs-16" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        });
                    })}
                    </tbody>
                </table>

                {/* Modal */}
                {selected && (
                    <SupervisionTestResultModal
                        show={showModal}
                        testResult={selected}
                        washType={testRequest?.wash_type}
                        onClose={() => {
                            setShowModal(false);
                            setSelected(null);
                        }}
                    />
                )}

        </Card>
    );
};

export default SupervisionTestResultsList;
