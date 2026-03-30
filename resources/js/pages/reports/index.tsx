import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardFooter, Col, Row } from "react-bootstrap";

import PageTitle from "@/components/PageTitle";
import MainLayout from "@/layouts/MainLayout";

import ReportStatsCards from "@/components/_reports/ReportStatsCards";
import ReportTable from "@/components/_reports/ReportTable";
import ReportFilters from "@/components/_reports/ReportFilters";

const ReportIndex = () => {
    const { tests, stats, filters } = usePage().props as unknown as {
        tests: any;
        stats: any;
        filters: { q?: string; per_page?: number; status?: number; date_range?: string };
    };

    const [searchTerm, setSearchTerm] = useState(filters?.q ?? "");
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? 6);
    const [dateRange, setDateRange] = useState(filters?.date_range ?? ""); // 🔹 nuevo

    return (
        <MainLayout>
            <PageTitle
                title="Informes de Solicitudes"
                subTitle="Informes"
            />

            <div className="mt-3">
                <p className="mb-0 text-muted">
                    Consulta los informes de las solicitudes.
                </p>
                <br />
                <ReportStatsCards stats={stats} />
            </div>


            <Row>
                {console.log(tests)}
                <Col xs={12}>
                    <Card>
                        <ReportFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            filters={filters}
                        />

                        <ReportTable test_requests={tests} test_results={undefined} />

                        <CardFooter>
                            <div className="d-flex align-items-center justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span>Filas:</span>

                                    <select
                                        value={filters?.per_page ?? 10}
                                        onChange={(e) =>
                                            router.get(
                                                route("reports.index"),
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
                                    {tests?.links?.map((link: any, i: number) => {
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

export default ReportIndex;
