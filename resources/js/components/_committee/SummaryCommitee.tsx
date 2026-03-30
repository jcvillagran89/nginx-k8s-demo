import React, { useMemo, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { SummaryRow } from "@/components/_committee/TableDetail";
import { getImageUrl } from "@/utils/image";

type Props = {
  testResult: any;
  summaryRows: SummaryRow[];
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    return d.toLocaleDateString("es-MX");
  } catch {
    return "-";
  }
}

export default function SummaryCommitee({ testResult, summaryRows }: Props) {
  const styleNumber = testResult?.style?.number ?? "--";
  const styleDesc = testResult?.style?.description ?? "--";
  const providerName = testResult?.style?.provider?.name ?? "--";
  const ingreso = formatDate(testResult?.created_at);
  const src = getImageUrl(testResult?.image_id) ?? testResult?.image ?? "";


  const progress = useMemo(() => {
    const approved = summaryRows.filter(r => r.statusLabel === "Aprobada").length;
    const rejected = summaryRows.filter(r => r.statusLabel === "Rechazada").length;
    const pending = summaryRows.filter(r => r.statusLabel === "Pendiente").length;
    return { approved, rejected, pending };
  }, [summaryRows]);

  return (
    <Card className="border rounded-4">
      <Card.Body className="p-4">
        <div className="row g-4 align-items-stretch">
          {/* IZQUIERDA */}
          <div className="col-12 col-lg-9">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#e7f0ff" }}>
                    <IconifyIcon icon="tabler:box" className="fs-20" />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Folio / SKU</div>
                    <div className="fw-semibold">{testResult?.number ?? "--"}</div>
                    <Badge bg="light" text="dark" className="border mt-2">
                      {testResult?.item ?? "--"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#f3ecff" }}>
                    <IconifyIcon icon="tabler:file-description" className="fs-20" />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Descripción</div>
                    <div className="fw-semibold">{styleDesc}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>{styleNumber}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#e9f9ed" }}>
                    <IconifyIcon icon="tabler:building-store" className="fs-20" />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Proveedor</div>
                    <div className="fw-semibold">{providerName}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#fff2d9" }}>
                    <IconifyIcon icon="tabler:calendar" className="fs-20" />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Fecha de Ingreso</div>
                    <div className="fw-semibold">{ingreso}</div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                       style={{ width: 40, height: 40, background: "#e6fbf6" }}>
                    <IconifyIcon icon="tabler:circle-check" className="fs-20" />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Progreso de Revisión</div>
                    <div className="fw-semibold">
                      {progress.approved} aprobadas / {progress.rejected} rechazadas
                    </div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {progress.pending} pendientes
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DERECHA: imagen */}
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
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
