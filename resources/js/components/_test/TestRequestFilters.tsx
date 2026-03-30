// src/components/_test/TestRequestFilters.tsx

import { Link, router } from "@inertiajs/react";
import { CardHeader, Button, Dropdown } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const TestRequestFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  filters,
  routeName = "test.request.index",
  createRouteName = "test.request.create",
  showCreate = true,
  searchPlaceholder = "Buscar solicitud (folio, sku, estilo, proveedor)",
}) => {
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      router.get(
        route(routeName),
        {
          ...filters,
          q: searchTerm,
          status: statusFilter,
          date_range: dateRange,
          page: 1,
        },
        { preserveState: true, preserveScroll: true }
      );
    }
  };

  const applyFilters = (next = {}) => {
    router.get(
      route(routeName),
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

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyFilters({ status: newStatus });
  };

  const handleDateRangeChange = (_dates, dateStr) => {
    setDateRange(dateStr);
    applyFilters({ date_range: dateStr });
  };

  const handleSearch = () => {
    applyFilters({ q: searchTerm });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(6);
    setDateRange("");

    router.get(
      route(routeName),
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
      case 0:
        return "Creada";
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
        <div style={{ minWidth: 120 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            &nbsp;
          </div>

          <div className="lab-input-shell d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-2 h-50">
            <IconifyIcon icon="tabler:search" className="me-2 text-muted fs-3" />
            <input
              type="search"
              className="form-control border-0 bg-transparent"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        </div>

        {/* Fecha */}
        <div style={{ width: 260, minWidth: 220 }}>
          <div className="text-muted mb-1" style={{ fontSize: 10 }}>
            &nbsp;
          </div>

          <div className="lab-input-shell d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-2 h-50">
            <IconifyIcon icon="tabler:calendar" className="me-2 text-muted fs-5" />

            <CustomFlatpickr
              className="form-control border-0 bg-transparent"
              placeholder="Rango de fechas"
              options={{
                mode: "range",
                enableTime: false,
                dateFormat: "d/m/Y",
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

        {/* Filtro Estado */}
        <div>
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

        {/* Nueva */}
        {showCreate && (
          <div>
            <div className="text-muted mb-1" style={{ fontSize: 10 }}>
              &nbsp;
            </div>

            <Link href={route(createRouteName)} className="w-100 d-block">
              <Button
                variant="success"
                className="w-100 d-flex align-items-center justify-content-center rounded-4"
                style={{ padding: "10px 14px" }}
              >
                <IconifyIcon icon="tabler:plus" className="me-2" />
                Nueva
              </Button>
            </Link>
          </div>
        )}
      </div>
    </CardHeader>

  );
};

export default TestRequestFilters;
