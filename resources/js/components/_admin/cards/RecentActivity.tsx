import React from "react";
import { Card } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const RecentActivity = ({ activities }) => {

    const isEmpty = !activities || activities.length === 0;

    return (
        <Card className="border-0 shadow-sm rounded-4 h-100 shadow-lg">
            <Card.Body className="position-relative">

                {!isEmpty && (
                    <div
                        style={{
                            position: "absolute",
                            left: "22px",
                            top: "60px",
                            bottom: "40px",
                            width: "3px",
                            background: "#e5e7eb",
                            borderRadius: "10px",
                            zIndex: 0
                        }}
                    />
                )}
                <h5 className="fw-bold mb-4">Actividad Reciente</h5>

                {isEmpty ? (
                    <div className="text-center text-muted py-5">
                        <IconifyIcon icon="tabler:clipboard-x" className="fs-1 mb-2" />
                        <div className="fw-semibold">Sin registros aún</div>
                    </div>
                ) : (

                    <div
                        className="ps-4"
                        style={{
                            maxHeight: "500px",
                            overflowY: "auto",
                            paddingRight: "10px",
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        {activities.map((item, i) => (
                            <div key={i} className="d-flex mb-4">

                                <div className="me-3">
                                    <div
                                        className={`d-flex align-items-center justify-content-center rounded-circle bg-${item.type ?? 'primary'}-subtle`}
                                        style={{ width: 40, height: 40 }}
                                    >
                                        <IconifyIcon icon={item.icon} className={`fs-4 text-${item.type}`} />
                                    </div>
                                </div>

                                <div>
                                    <strong className="d-block">{item.title}</strong>

                                    <small className="text-muted d-block">
                                        {item.description}
                                    </small>

                                    <small className="text-muted d-block">
                                        Creado por: <span className="fw-semibold">{item.user}</span>
                                    </small>

                                    <small className="text-muted">
                                        {new Date(item.created_at).toLocaleString("es-MX", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit"
                                        })}
                                    </small>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </Card.Body>
        </Card>
    );
};

export default RecentActivity;
