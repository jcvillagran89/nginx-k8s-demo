import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { router } from "@inertiajs/react";
import { getImageUrl } from "@/utils/image";

const SupervisionTestResultModal = ({ show, testResult, washType, onClose }) => {
    const testName = testResult?.testName ?? "";
    const testData = testResult?.testData ?? {};

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(testData.img || []);

    useEffect(() => {
        setImages(testResult?.testData?.img || []);
        setComment("");
    }, [show, testResult?.test_id, testName]);

    if (!testResult) return null;

    const excluded = [
        "img",
        "status",
        "user_id",
        "user_name",
        "approved",
        "REJECTED",
        "status_review"
    ];

    const toggleImage = (imageId) => {
        const updated = images.map((img) =>
            img.id === imageId
                ? { ...img, is_selected: !img.is_selected }
                : img
        );

        setImages(updated);

        router.post('/supervision/image/select', {
            test_id: testResult.test_id,
            test_name: testResult.testName,
            images: updated
        });
    };

    const handleApprove = async () => {
        setLoading(true);

        router.post(
            route("supervision.approve"),
            {
                test_id: testResult.test_id,
                test_name: testResult.testName,
            },
            {
                onFinish: () => setLoading(false),
            }
        );

        setLoading(false);
        onClose();
    };

    const handleReject = () => {
        if (comment.trim() === "") {
            alert("El motivo de rechazo es obligatorio");
            return;
        }

        setLoading(true);

        router.post(
            route("supervision.reject"),
            {
                test_id: testResult.test_id,
                test_name: testName,
                observations: comment,
            },
            {
                onFinish: () => setLoading(false),
            }
        );

        setLoading(false);
        onClose();
    };

    const rejectedBlock = testData.REJECTED ?? {};

    const visibleFields = Object.entries(testData).filter(([key, field]) => {
        if (excluded.includes(key)) return false;

        const displayName = field?.display_name?.toString().trim();
        const rawValue = field?.value;

        if (!displayName) return false;
        if (rawValue === null || rawValue === undefined) return false;

        const value = rawValue.toString().trim();

        if (value === "" || value === "-" || value === "—") return false;

        return true;
    });

    const testsWithWashType = new Set([
        "APARIENCIA",
        "ESTABILIDAD EN TELA",
        "ESTABILIDAD EN PRENDA",
    ]);
    const shouldShowWashType = testsWithWashType.has((testName ?? "").toString().trim().toUpperCase());

    return (
        <Modal show={show} onHide={onClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="bg-light rounded">
                        {testResult.testName}
                    </span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* TABLA DE CAMPOS */}
                {(visibleFields.length > 0 || shouldShowWashType) && (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Campo</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shouldShowWashType && (
                                <tr>
                                    <td className="fw-semibold">Tipo de lavado</td>
                                    <td>{washType ?? "—"}</td>
                                </tr>
                            )}
                            {visibleFields.map(([key, field]) => (
                                <tr key={key}>
                                    <td className="fw-semibold">{field.display_name}</td>
                                    <td>{field.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* SECCIÓN DE RECHAZOS ANTERIORES */}
                {/*
                <div className="mt-4">
                    <h5 className="fw-bold">Historial de Rechazos</h5>

                    {Object.keys(rejectedBlock).length === 0 ? (
                        <p className="text-muted">No hay rechazos previos.</p>
                    ) : (
                        <table className="table table-sm table-striped">
                            <thead>
                                <tr>
                                    <th>Prueba</th>
                                    <th>Intentos</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(rejectedBlock).map(([testName, data], i) => (
                                    <tr key={i}>
                                        <td className="fw-semibold">{testName}</td>
                                        <td>{data.intentos ?? 0}</td>
                                        <td>{data.observations ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                */}

                {images.length > 0 && (
                    <div className="mt-3">
                        <h5 className="fw-bold">Imágenes</h5>
                        <span>Selecciona las imágenes que quieras incluir en tu reporte de resultados.</span>

                        <div className="d-flex gap-3 flex-wrap">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`border rounded p-2 ${img.is_selected ? 'border-success border-2 bg-success bg-opacity-10' : ''}`}
                                >Historial de Rechazos
                                    <img
                                        src={getImageUrl(img.id)}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            objectFit: "cover",
                                            borderRadius: 6,
                                        }}
                                    />

                                    <Form.Check
                                        className="mt-2"
                                        label="Seleccionar"
                                        checked={!!img.is_selected}
                                        onChange={() => toggleImage(img.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COMENTARIOS */}
                <Form.Group className="mt-4">
                    <Form.Label>Comentarios de Rechazo</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Group>

                {/* BOTONES */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                        variant="outline-danger"
                        disabled={loading}
                        onClick={handleReject}
                    >
                        Rechazar Prueba
                    </Button>

                    <Button
                        variant="success"
                        disabled={testData.approved}
                        onClick={handleApprove}
                    >
                        Aprobar Prueba
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SupervisionTestResultModal;
