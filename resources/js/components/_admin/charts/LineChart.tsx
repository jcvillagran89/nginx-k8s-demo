import React from "react";
import Chart from "react-apexcharts";

const LineChart = ({ data }) => {

    const testTypes = Object.keys(data[0]?.tests || {});

    const series = testTypes.map(type => ({
        name: type,
        data: data.map(m => m.tests[type]),
    }));

    return (
        <div className="border-0 rounded-4 bg-white p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tendencia de Pruebas por Mes</h2>

            <Chart
                type="line"
                height={350}
                series={series}
                options={{
                    stroke: { curve: "smooth", width: 3 },
                    xaxis: { categories: data.map(m => m.month) },
                    chart: { toolbar: { show: false } },
                    markers: { size: 4 },
                    legend: { position: "top" },
                }}
            />
        </div>
    );
};

export default LineChart;
