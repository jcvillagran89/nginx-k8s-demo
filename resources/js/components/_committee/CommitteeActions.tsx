import React, { useMemo, useState } from "react";
import { Button, Card, Form, Badge } from "react-bootstrap";
import { Link } from "@inertiajs/react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type Props = {
  initialComment?: string;
  status: number; // 👈 status del testRequest
  onReject?: (comment: string) => void;
  onApprove?: (comment: string) => void;
};

const LOCKED_STATUSES = new Set([7, 8, 9]); // Aprobado, Rechazado, Reingreso

function statusMeta(status: number) {
  if (status === 7) return { label: "Aprobada", cls: "bg-success-subtle text-success-emphasis border" };
  if (status === 8) return { label: "Rechazada", cls: "bg-danger-subtle text-danger-emphasis border" };
  if (status === 9) return { label: "Reingreso", cls: "bg-secondary-subtle text-secondary-emphasis border" };
  return { label: "Pendiente", cls: "bg-warning-subtle text-warning-emphasis border" };
}

export default function CommitteeActions({
  initialComment = "",
  status,
  onReject,
  onApprove,
}: Props) {
  const [comment, setComment] = useState(initialComment);
  const [touched, setTouched] = useState(false);

  const trimmed = useMemo(() => comment.trim(), [comment]);
  const isValid = trimmed.length > 0;

  const isLocked = LOCKED_STATUSES.has(status);
  const showError = touched && !isValid && !isLocked;

  const requireComment = () => {
    if (!isValid) {
      setTouched(true);
      return false;
    }
    return true;
  };

  const handleReject = () => {
    if (isLocked) return;
    if (!requireComment()) return;
    onReject?.(trimmed);
  };

  const handleApprove = () => {
    if (isLocked) return;
    if (!requireComment()) return;
    onApprove?.(trimmed);
  };

  const meta = statusMeta(status);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Comentarios */}
      <Card className="border rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="tabler:message" className="fs-18" />
              <div className="fw-semibold">Comentarios del Comité</div>
            </div>

            <Badge pill className={meta.cls} style={{ fontSize: 12 }}>
              {meta.label}
            </Badge>
          </div>

          <div className="text-muted" style={{ fontSize: 13 }}>
            {isLocked
              ? "Esta solicitud ya fue dictaminada. El comentario es solo de lectura."
              : "Agrega observaciones o comentarios que se incluirán en la decisión final."}
            {!isLocked && <span className="ms-1 text-danger fw-semibold">*</span>}
          </div>

          <Form.Group className="mt-3">
            <Form.Control
              as="textarea"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Escribe comentarios sobre la muestra..."
              isInvalid={showError}
              disabled={isLocked}
              readOnly={isLocked}
              style={{
                background: isLocked ? "#fff" : "#f5f6f7",
                border: "1px solid #eef0f2",
                resize: "none",
              }}
            />

            {showError && (
              <div className="invalid-feedback d-block">
                El comentario es obligatorio para aprobar o rechazar.
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Acciones */}
      <div className="d-flex justify-content-end gap-2">
        <Link href={route("committee.index")} className="text-decoration-none">
          <Button variant="outline-secondary" className="rounded-pill px-4">
            Cancelar
          </Button>
        </Link>

        <Button
          variant="outline-danger"
          className="rounded-pill px-4"
          disabled={isLocked || !isValid}
          onClick={handleReject}
        >
          <IconifyIcon icon="tabler:x" className="me-2" />
          Rechazar
        </Button>

        <Button
          variant="success"
          className="rounded-pill px-4"
          disabled={isLocked || !isValid}
          onClick={handleApprove}
        >
          <IconifyIcon icon="tabler:check" className="me-2" />
          Aprobar
        </Button>
      </div>
    </div>
  );
}
