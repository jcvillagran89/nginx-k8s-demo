import React, { useMemo } from "react";
import { Badge, Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  onHide: () => void;
  row: {
    name: string;
    statusLabel: "Aprobada" | "Rechazada" | "Pendiente";
    reviewer: string;
    date: string;
    section: any;
  } | null;
};

function statusToBadge(statusLabel: Props["row"]["statusLabel"]) {
  if (statusLabel === "Aprobada") return "bg-success-subtle text-success-emphasis border";
  if (statusLabel === "Rechazada") return "bg-danger-subtle text-danger-emphasis border";
  return "bg-warning-subtle text-warning-emphasis border";
}

export default function TestDetailModal({ show, onHide, row }: Props) {
  const section = row?.section ?? {};

  const testCode =
    section?.code ??
    section?.codigo ??
    section?.test_code ??
    section?.testCode ??
    "—";

  const resultText =
    row?.statusLabel === "Aprobada" ? "Aprobado" :
    row?.statusLabel === "Rechazada" ? "Rechazado" :
    "Pendiente";

  // Observaciones: tu JSON a veces trae REJECTED: { "LAVADO": { observations: "..." } }
  const supervisorComment =
    section?.REJECTED?.[row?.name ?? ""]?.observations ??
    section?.observations ??
    section?.comment ??
    section?.comments ??
    "—";

  // Campos de la prueba: keys numéricas => { display_name, value }
  const fields = useMemo(() => {
    if (!section || typeof section !== "object") return [];
    return Object.entries(section)
      .filter(([k, v]: any) => /^\d+$/.test(String(k)) && v && typeof v === "object" && "display_name" in v)
      .map(([k, v]: any) => ({
        key: k,
        label: v.display_name ?? v.label ?? k,
        value: v.value ?? null,
      }));
    
  }, [section]);
  const pairedFields = useMemo(() => {
    const pairs: Array<[any, any | null]> = [];

    for (let i = 0; i < fields.length; i += 2) {
      pairs.push([
        fields[i],
        fields[i + 1] ?? null,
      ]);
    }

    return pairs;
  }, [fields]);

  if (!row) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <div>
          <div className="fw-semibold" style={{ fontSize: 18 }}>
            Detalle de Prueba: {row.name}
          </div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Información detallada de la prueba
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="border rounded-4 p-2 mt-1" style={{ background: "#fafafa" }}>
          <div className="d-flex flex-column gap-2">
            <div><span className="fw-semibold">Resultado:  </span> 
            <Badge pill className={statusToBadge(row.statusLabel)} style={{ fontSize: 12 }}>
              {row.statusLabel}
            </Badge>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-3">
          <div className="fw-semibold mb-2">Comentarios del Supervisor</div>
          <div className="border rounded-4 p-3" style={{ background: "#fff" }}>
            {supervisorComment}
          </div>
        </div>

        <div className="mt-4">
          <div className="fw-semibold mb-2">Datos de la Prueba</div>

          {fields.length === 0 ? (
            <div className="text-muted">Sin datos adicionales</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle d-none d-md-table">
                <thead className="bg-light-subtle">
                  <tr>
                    <th style={{ width: "25%" }}>Campo</th>
                    <th style={{ width: "25%" }}>Valor</th>
                    <th style={{ width: "25%" }}>Campo</th>
                    <th style={{ width: "25%" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {pairedFields.map(([left, right], idx) => (
                    <tr key={idx}>
                      {/* Columna izquierda */}
                      <td className="text-muted">{left.label}</td>
                      <td className="fw-semibold">{left.value ?? "—"}</td>

                      {/* Columna derecha */}
                      {right ? (
                        <>
                          <td className="text-muted">{right.label}</td>
                          <td className="fw-semibold">{right.value ?? "—"}</td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-end">
        <Button variant="outline-secondary" className="rounded-pill px-4" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
