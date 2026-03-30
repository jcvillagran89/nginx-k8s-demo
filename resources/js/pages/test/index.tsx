import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardFooter, Col, Row } from "react-bootstrap";

import PageTitle from "@/components/PageTitle";
import MainLayout from "@/layouts/MainLayout";

import TestRequestStatsCards from "@/components/_test/TestRequestStatsCard";
import TestRequestTable from "@/components/_test/TestRequestTable";
import TestRequestFilters from "@/components/_test/TestRequestFilters";

const TestRequestIndex = () => {
  const { test_requests, stats, filters, analysts } = usePage().props as unknown as {
    test_requests: any;
    stats: any;
    filters: { q?: string; per_page?: number; status?: number; date_range?: string };
    analysts: any;
  };

  const [searchTerm, setSearchTerm] = useState(filters?.q ?? "");
  const [statusFilter, setStatusFilter] = useState(filters?.status ?? 6);
  const [dateRange, setDateRange] = useState(filters?.date_range ?? "");

  return (
    <MainLayout>
      <PageTitle
        title="Solicitudes de Análisis"
        subTitle="Solicitudes de Pruebas Textiles"
      />

      <div className="mt-0">
        <TestRequestStatsCards stats={stats} />
      </div>

      <Row>
        <Col xs={12}>
          <Card>
            <TestRequestFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              filters={filters}
            />

            <TestRequestTable test_requests={test_requests} test_results={undefined} analysts={analysts} />

            <CardFooter>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span>Filas:</span>

                  <select
                    value={filters?.per_page ?? 10}
                    onChange={(e) =>
                      router.get(
                        route("test.request.index"),
                        {
                          ...filters,
                          per_page: e.target.value,
                          q: searchTerm,
                          status: statusFilter,
                          date_range: dateRange,
                          page: 1,
                        },
                        { preserveState: true, preserveScroll: true }
                      )
                    }
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
                  {test_requests?.links?.map((link: any, i: number) => {
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
                          <a
                            href={link.url}
                            className="page-link"
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
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default TestRequestIndex;
