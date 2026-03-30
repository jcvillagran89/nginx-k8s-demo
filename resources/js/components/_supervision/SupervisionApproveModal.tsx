import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { router } from "@inertiajs/react";

const SupervisionApproveModal = ({ show, onHide, testData, testRequest }) => {
    const [loading, setLoading] = useState(false);

    const handleApprove = () => {
        setLoading(true);

        router.post(
            route("supervision.approve.request"),
            {
                test_id: testRequest.test[0].id,
                test_name: testData.testName,
            },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Aprobar solicitud</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-2">
                    ¿Estás seguro que deseas aprobar la solicitud?
                </p>
                <strong>{testData.testName}</strong>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Cancelar
                </Button>

                <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        "Aprobar"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SupervisionApproveModal;
