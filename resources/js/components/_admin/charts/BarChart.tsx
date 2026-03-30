import React, { useMemo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Button, ButtonGroup, Form } from "react-bootstrap";

const BarChart = ({ data }) => {
    const years = data?.years ?? [];
    const monthOptions = useMemo(
        () => [
            { value: 1, label: "Enero" },
            { value: 2, label: "Febrero" },
            { value: 3, label: "Marzo" },
            { value: 4, label: "Abril" },
            { value: 5, label: "Mayo" },
            { value: 6, label: "Junio" },
            { value: 7, label: "Julio" },
            { value: 8, label: "Agosto" },
            { value: 9, label: "Septiembre" },
            { value: 10, label: "Octubre" },
            { value: 11, label: "Noviembre" },
            { value: 12, label: "Diciembre" },
        ],
        []
    );

    const defaultYear = years.length ? Math.max(...years) : new Date().getFullYear();
    const defaultMonth = new Date().getMonth() + 1;

    const [mode, setMode] = useState("year");
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

    useEffect(() => {
        if (!years.length) {
            const currentYear = new Date().getFullYear();
            if (selectedYear !== currentYear) {
                setSelectedYear(currentYear);
            }
            return;
        }

        if (!years.includes(selectedYear)) {
            setSelectedYear(Math.max(...years));
        }
    }, [years.join("|"), selectedYear]);

    const yearData = data?.yearly?.[selectedYear] ?? [];
    const monthData = data?.monthly?.[selectedYear]?.[selectedMonth] ?? [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const yearDataSafe = yearData.length
        ? yearData
        : monthOptions.map((month) => ({
            month: month.label,
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
        }));

    const monthDataSafe = monthData.length
        ? monthData
        : Array.from({ length: daysInMonth }, (_, index) => ({
            day: index + 1,
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
        }));

    const source = mode === "year" ? yearDataSafe : monthDataSafe;
    const categories = mode === "year"
        ? source.map((item) => item.month)
        : source.map((item) => String(item.day));

    const series = [
        {
            name: "Total",
            type: "bar",
            data: source.map((item) => item.total ?? 0),
        },
        {
            name: "Pendientes",
            type: "bar",
            data: source.map((item) => item.pending ?? 0),
        },
        {
            name: "Canceladas",
            type: "bar",
            data: source.map((item) => item.cancelled ?? 0),
        },
        {
            name: "Completadas",
            type: "bar",
            data: source.map((item) => item.completed ?? 0),
        },
    ];

    const options = {
        chart: {
            height: 300,
            type: "line",
            toolbar: { show: false },
        },
        stroke: {
            curve: "smooth",
            width: [0, 0, 0, 0],
            dashArray: [0, 0, 0, 0],
        },
        fill: {
            opacity: [1, 1, 1, 1],
            type: ["solid", "solid", "solid", "solid"],
        },
        markers: {
            size: [0, 0, 0, 4],
            strokeWidth: 2,
            hover: { size: 6 }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                rotate: mode === "month" ? -45 : 0,
            },
        },
        yaxis: {
            labels: {
                offsetX: -10,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 4,
            }
        },
        legend: {
            show: true,
            horizontalAlign: "center",
            itemMargin: { horizontal: 10 },
        },
        colors: ["#859fe3", "#ffdc79", "#e0666e", "#71bb87"],
        tooltip: {
            shared: true,
        },
    };

    return (

        <div className="border-0 rounded-4 bg-white p-4 shadow-lg">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="text-lg font-semibold mb-1">Resumen de Pruebas</h2>
                    <div className="text-muted small">
                        {mode === "month" ? "Vista diaria por mes" : "Vista anual por mes"}
                    </div>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <ButtonGroup size="sm">
                        <Button
                            variant={mode === "month" ? "primary" : "outline-primary"}
                            onClick={() => setMode("month")}
                        >
                            Por mes
                        </Button>
                        <Button
                            variant={mode === "year" ? "primary" : "outline-primary"}
                            onClick={() => setMode("year")}
                        >
                            Por año
                        </Button>
                    </ButtonGroup>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {mode === "month" && (
                            <Form.Select
                                size="sm"
                                className="w-auto"
                                style={{ minWidth: 160 }}
                                value={selectedMonth}
                                onChange={(event) => setSelectedMonth(Number(event.target.value))}
                            >
                                {monthOptions.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </Form.Select>
                        )}

                        <Form.Select
                            size="sm"
                            className="w-auto"
                            style={{ minWidth: 120 }}
                            value={selectedYear}
                            onChange={(event) => setSelectedYear(Number(event.target.value))}
                        >
                            {years.length ? (
                                years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))
                            ) : (
                                <option value={selectedYear}>{selectedYear}</option>
                            )}
                        </Form.Select>
                    </div>
                </div>
            </div>

            <ReactApexChart
                height={500}
                options={options}
                series={series}
                type="line"
            />
        </div>
    );
};

export default BarChart;
