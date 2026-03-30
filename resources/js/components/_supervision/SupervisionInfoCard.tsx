import React, { useMemo } from "react";
import { Card, Badge } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getImageUrl } from "@/utils/image";

const statusLabels: Record<number, { label: string; variant: string }> = {
  0: { label: "Creado", variant: "primary" },
  1: { label: "En progreso", variant: "secondary" },
  2: { label: "Revisión pendiente", variant: "warning" },
  3: { label: "Revisión completada", variant: "info" },
  4: { label: "Aprobada", variant: "success" },
  5: { label: "Rechazada", variant: "danger" },
};

interface Props {
  testRequest: any;
}

const SupervisionInfoCard: React.FC<Props> = ({ testRequest }) => {
  const status = Number(testRequest.status);

  const src = useMemo(
    () => getImageUrl(testRequest?.image_id) ?? testRequest?.image ?? "",
    [testRequest?.image_id, testRequest?.image]
  );

  const ingreso = (() => {
    try {
      return new Date(testRequest.created_at).toLocaleDateString("es-MX");
    } catch {
      return "--";
    }
  })();

  const Item = ({
    icon,
    label,
    value,
    bg,
  }: {
    icon: string;
    label: string;
    value: React.ReactNode;
    bg: string;
  }) => (
    <div className="col-12 col-md-6">
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40, background: bg }}
        >
          <IconifyIcon icon={icon} className="fs-20" />
        </div>
        <div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {label}
          </div>
          <div className="fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border rounded-4">
      <Card.Body className="p-4">
        <div className="row g-4 align-items-stretch">
          {/* IZQUIERDA */}
          <div className={src ? "col-12 col-lg-9" : "col-12"}>
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Información general
                </div>
                <h4 className="fw-bold mb-1">Folio #{testRequest.number}</h4>

                <Badge bg={statusLabels[status]?.variant}>
                  <IconifyIcon icon="tabler:circle-check" className="me-1" />
                  {statusLabels[status]?.label}
                </Badge>

                <div className="text-muted mt-3">
                  {testRequest.style?.description ?? "S/D"}
                </div>
              </div>
            </div>

            <div className="row g-4">
              <Item
                icon="tabler:tag"
                label="Estilo"
                value={testRequest.style?.number ?? "S/D"}
                bg="#f3ecff"
              />

              <Item
                icon="tabler:file-description"
                label="Descripción"
                value={testRequest.style?.description ?? "S/D"}
                bg="#e7f0ff"
              />

              <Item
                icon="tabler:user"
                label="Analista"
                value={testRequest.analyst?.name ?? "Sin asignar"}
                bg="#e9f9ed"
              />

              <Item
                icon="tabler:calendar"
                label="Fecha de ingreso"
                value={ingreso}
                bg="#fff2d9"
              />

              <Item
                icon="tabler:notes"
                label="Notas adicionales"
                value={testRequest.notes ?? "Sin notas"}
                bg="#e6fbf6"
              />

              {testRequest.cancelation_notes ? (
                <Item
                  icon="tabler:circle-x"
                  label="Motivo de rechazo"
                  value={testRequest.cancelation_notes}
                  bg="#fdecec"
                />
              ) : null}
            </div>
          </div>

          {/* DERECHA: imagen */}
          {src ? (
            <div className="col-12 col-lg-3">
              <div
                className="border rounded-4 d-flex align-items-center justify-content-center"
                style={{ height: "100%", minHeight: 220, background: "#fafafa" }}
              >
                <img
                  src={src}
                  alt="Producto"
                  className="img-fluid rounded-4"
                  style={{ maxHeight: 240, objectFit: "contain" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SupervisionInfoCard;
