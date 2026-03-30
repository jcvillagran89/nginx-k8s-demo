import React, { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "@inertiajs/react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import TestDetailModal from "@/components/_committee/TestDetailModal";

export type SummaryRow = {
  name: string;
  statusLabel: "Aprobada" | "Rechazada" | "Pendiente";
  reviewer: string;
  date: string;
  href?: string;
  section: any; // <--- clave para el modal
};

function statusToBadge(statusLabel: SummaryRow["statusLabel"]) {
  if (statusLabel === "Aprobada") return "bg-success-subtle text-success-emphasis border";
  if (statusLabel === "Rechazada") return "bg-danger-subtle text-danger-emphasis border";
  return "bg-warning-subtle text-warning-emphasis border";
}

export default function TableDetail({ rows }: { rows: SummaryRow[] }) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<SummaryRow | null>(null);

  const openModal = (row: SummaryRow) => {
    setSelected(row);
    setShow(true);
  };
  return (
    <>
      <Card className="border rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="bg-light-subtle">
                <tr>
                  <th className="ps-3">Prueba</th>
                  <th>Estado de Revisión</th>
                  <th>Fecha de Registro</th>
                  <th>Revisado Por</th>
                  <th className="text-end pe-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      Sin pruebas para mostrar
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={`${row.name}-${idx}`}>
                      <td className="ps-3">{row.name}</td>
                      <td>
                        <Badge pill className={statusToBadge(row.statusLabel)} style={{ fontSize: 12 }}>
                          {row.statusLabel}
                        </Badge>
                      </td>
                      <td>{row.date}</td>
                      <td className="text-muted">{row.reviewer}</td>
                      <td className="text-end pe-3">
                        {row.href ? (
                          <Button
                            variant="soft-primary"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => openModal(row)}
                            title="Ver Detalle"
                          >
                            <IconifyIcon icon="tabler:eye" className="fs-16" />
                          </Button>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
      <TestDetailModal show={show} onHide={() => setShow(false)} row={selected} />
    </>
  );
}
