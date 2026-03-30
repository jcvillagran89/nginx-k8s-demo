import { router } from "@inertiajs/react";
import { CardHeader, Button, Dropdown } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const SupervisionFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  filters,
}) => {
  const applyFilters = (next = {}) => {
    router.get(
      route("supervision.index"),
      {
        ...filters,
        q: searchTerm,
        status: statusFilter,
        date_range: dateRange,
        page: 1,
        ...next,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") applyFilters({ q: searchTerm });
  };

  const handleSearch = () => {
    applyFilters({ q: searchTerm });
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyFilters({ status: newStatus });
  };

  const handleDateRangeChange = (dates, dateStr) => {
    setDateRange(dateStr);
    if (!dateStr) {
      applyFilters({ date_range: "" });
      return;
    }
    if (Array.isArray(dates) && dates.length < 2) return;
    applyFilters({ date_range: dateStr });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(6);
    setDateRange("");

    router.get(
      route("supervision.index"),
      {
        q: "",
        status: 6,
        date_range: "",
        per_page: filters?.per_page ?? 10,
        page: 1,
      },
      { preserveState: false, preserveScroll: true }
    );
  };

  const statusLabel = (() => {
    switch (Number(statusFilter)) {
      case 1:
        return "En progreso";
      case 2:
        return "Revisión pendiente";
      case 3:
        return "Revisión completada";
      case 4:
        return "Aprobado";
      case 5:
        return "Rechazado";
      default:
        return "Todos";
    }
  })();

  return (
    <CardHeader className="border-0 pb-0">
      <div className="d-flex align-items-stretch gap-3 flex-wrap">
        {/* Buscar input */}
        <div style={{ flex: "1 1 320px", minWidth: 200 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            &nbsp;
          </div>

          <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-2 h-50">
            <IconifyIcon icon="tabler:search" className="me-2 text-muted fs-3" />
            <input
              type="search"
              className="form-control border-0 bg-transparent"
              placeholder="Buscar solicitud (folio, sku, estilo, proveedor)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        {/* Fecha */}
        <div style={{ width: 260, minWidth: 220 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            &nbsp;
          </div>

          <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-2 h-50">
            <IconifyIcon icon="tabler:calendar" className="me-2 text-muted fs-5" />

            <CustomFlatpickr
              className="form-control border-0 bg-transparent"
              placeholder="Rango de fechas"
              options={{
                mode: "range",
                enableTime: false,
                dateFormat: "d/m/Y",
                closeOnSelect: false,
              }}
              value={dateRange || undefined}
              onChange={handleDateRangeChange}
            />

            {dateRange && (
              <button
                type="button"
                className="btn p-0 ms-2 d-flex align-items-center"
                style={{ lineHeight: 1 }}
                onClick={() => {
                  setDateRange("");
                  handleDateRangeChange([], "");
                }}
                title="Limpiar rango de fechas"
              >
                <IconifyIcon
                  icon="tabler:x"
                  className="text-muted"
                  style={{ fontSize: 18 }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Botón Buscar */}
        <div style={{ width: 130, minWidth: 120 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            &nbsp;
          </div>

          <Button
            type="button"
            variant="dark"
            className="w-100 px-3 d-flex align-items-center justify-content-center rounded-4"
            style={{ padding: "10px 14px" }}
            onClick={handleSearch}
          >
            <IconifyIcon icon="tabler:search" className="me-2" />
            Buscar
          </Button>
        </div>

        {/* Filtro Estado */}
        <div style={{ width: 260, minWidth: 220 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            Filtrar por Estado
          </div>

          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              className="w-100 d-flex justify-content-between align-items-center border rounded-4"
              style={{ padding: "10px 14px" }}
            >
              <span className="d-flex align-items-center gap-2">
                <IconifyIcon icon="tabler:adjustments" className="text-muted" />
                {statusLabel}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item onClick={() => handleStatusChange(6)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Todos</span>
                  {Number(statusFilter) === 6 && <span>✓</span>}
                </div>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleStatusChange(1)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>En progreso</span>
                  {Number(statusFilter) === 1 && <span>✓</span>}
                </div>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleStatusChange(2)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Revisión pendiente</span>
                  {Number(statusFilter) === 2 && <span>✓</span>}
                </div>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleStatusChange(3)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Revisión completada</span>
                  {Number(statusFilter) === 3 && <span>✓</span>}
                </div>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleStatusChange(4)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Aprobado</span>
                  {Number(statusFilter) === 4 && <span>✓</span>}
                </div>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleStatusChange(5)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Rechazado</span>
                  {Number(statusFilter) === 5 && <span>✓</span>}
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </CardHeader>
  );
};

export default SupervisionFilters;
