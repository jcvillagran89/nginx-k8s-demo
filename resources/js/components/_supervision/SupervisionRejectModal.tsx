import React, { useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { router } from "@inertiajs/react";

const SupervisionRejectModal = ({ show, onHide, testData, testRequest }) => {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    const handleReject = () => {
        if (!notes.trim()) return alert("Debes escribir un motivo.");

        setLoading(true);

        router.post(
            route("supervision.reject.request"),
            {
                test_id: testRequest.test[0].id,
                notes,
            },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Rechazar solicitud</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-2">
                    ¿Por qué deseas rechazar la solicitud?
                </p>

                <strong>{testData.testName}</strong>

                <Form.Group className="mt-3">
                    <Form.Label>Motivo del rechazo</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Escribe el motivo..."
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    disabled={loading}
                    onClick={handleReject}
                >
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        "Rechazar"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SupervisionRejectModal;
