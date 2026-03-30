// components
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Link } from "@inertiajs/react";
import { Button, CardFooter } from "react-bootstrap";

type Row = {
  id: number;
  folio: string;
  fechaIngreso: string;
  fechaSalida: string;
  sku: string;
  analista: string[];
  pruebasPendientes: number;
  totalPruebas: number;
};

export default function TestResultsTable({rows, testResults, perPage, handlePerPageChange, setConfirmModal,}: {
    rows: Row[];
    testResults: any;
    perPage: number;
    handlePerPageChange: (value: string) => void;
    setConfirmModal: (state: { show: boolean; testId: number | null }) => void;
  }) {
    return (
      <>
        <div className="table-responsive mt-3">
          <table className="table table-nowrap mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th>Folio</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Salida</th>
                <th>SKU/ ESTILO</th>
                <th>Analista</th>
                <th>Pruebas Pendientes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((req) => (
                <tr key={req.id}>
                  <td>{req.folio}</td>
                  <td>{req.fechaIngreso}</td>
                  <td>{req.fechaSalida}</td>
                  <td>
                      <span
                        className="badge bg-light text-muted border rounded-pill"
                        style={{ fontSize: "12px" }}
                      >
                        {req.sku}
                      </span>
                  </td>
                  <td>
                    {(!req.analista || req.analista.length === 0) ? (
                      <span className="text-muted">--</span>
                    ) : (
                      <div className="d-flex align-items-center gap-1">
                        {req.analista.map((name: string, index: number) => {
                          const parts = name.trim().split(" ");
                          const first = parts[0] ?? "";
                          const last = parts.length > 1 ? parts[parts.length - 1] : "";
                          const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
                          return (
                            <div
                              key={index}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: 28,
                                height: 28,
                                backgroundColor: "#0d6efd20",
                                border: "1px solid #0d6efd55",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                              }}
                              title={name}
                            >
                              {initials || "?"}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td>
                    {(!req.totalPruebas || req.totalPruebas === 0) ? (
                      <span className="text-muted">--</span>
                    ) : (
                      <span
                        className={[
                          "badge rounded-pill",
                          req.pruebasPendientes > 0
                            ? "bg-warning-subtle text-warning-emphasis"
                            : "bg-success-subtle text-success-emphasis",
                        ].join(" ")}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {req.pruebasPendientes}/{req.totalPruebas}
                      </span>
                      )}
                  </td>
                  <td>
                    <Link href={route("test-results.detail", { test: req.id })}>
                      <Button
                        variant="soft-primary"
                        size="sm"
                        className="btn-icon rounded-circle me-2"
                      >
                        <IconifyIcon icon="tabler:eye" className="fs-16" />
                      </Button>
                    </Link>
                    {req.pruebasPendientes === 0 && req.totalPruebas > 0 && (
                      <Button
                        type="button"
                        variant="soft-success"
                          size="sm"
                          className="btn-icon rounded-circle"
                          title="Enviar a revisión"
                          onClick={() =>
                              setConfirmModal({ show: true, testId: req.id })
                          }
                      >
                        <IconifyIcon icon="tabler:send" className="fs-16" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER --- */}
        <CardFooter>
            <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                    <span>Filas:</span>
                    <select
                        value={perPage}
                        onChange={(e) => handlePerPageChange(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ width: 80 }}
                    >
                        {[10, 15, 25, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>

                <ul className="pagination mb-0">
                    {testResults.links.map((link: any, i: number) => {
                        let label = link.label;

                        if (label.includes("Previous")) label = "&laquo;";
                        if (label.includes("Next")) label = "&raquo;";

                        return (
                            <li
                                key={i}
                                className={[
                                    "page-item",
                                    link.active ? "active" : "",
                                    !link.url ? "disabled" : "",
                                ].join(" ")}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className="page-link"
                                        preserveState
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                ) : (
                                    <span
                                        className="page-link"
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </CardFooter>
      </>
    );
}
