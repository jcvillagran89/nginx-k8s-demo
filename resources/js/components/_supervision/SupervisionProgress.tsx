import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

interface Props {
    testRequest: any;
}

const SupervisionProgress: React.FC<Props> = ({ testRequest }) => {
    const tests = testRequest.test?.[0]?.results?.[0]?.content ?? {};
    const groups = Object.keys(tests);

    const total = groups.length;
    const completed = groups.filter(
        (key) => tests[key]?.status_review === 2 // 2 = aprobado
    ).length;

    const percent = total > 0 ? (completed / total) * 100 : 0;

    return (
        <Card className="shadow-sm rounded-4 p-4 mt-4">
            <h2 className="text-2xl fw-bold mb-1">Progreso de Tests</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-4">
                    Progreso de todos los tests realizados a la muestra
                </p>
                <span className="text-muted fw-semibold">
                    {completed} de {total} completados
                </span>
            </div>

            <ProgressBar
                now={percent}
                className="rounded-pill"
                style={{ height: "14px" }}
            />
        </Card>
    );
};

export default SupervisionProgress;
