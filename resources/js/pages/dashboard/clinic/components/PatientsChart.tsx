import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap';

const PatientsChart = () => {
    const PatientsChartOpts: ApexOptions = {
        series: [
            {
                name: 'Out Patient',
                type: 'bar',
                data: [16, 19, 19, 16, 16, 14, 15, 15, 17, 17, 19, 19, 18, 18, 20, 20, 18, 18, 22, 22, 20, 20, 18, 18, 20, 20, 18, 20, 20, 22],
            },
            {
                name: 'In Patient',
                data: [21, 24, 24, 21, 21, 19, 20, 20, 22, 22, 24, 24, 23, 23, 25, 25, 23, 23, 27, 27, 25, 25, 23, 23, 25, 25, 23, 25, 25, 27],
            },
        ],
        chart: {
            type: 'area',
            height: 358,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            offsetX: 0,
            offsetY: 2,
        },
        stroke: {
            width: [0, 2],
            dashArray: [5, 0],
        },
        colors: ['#465dff', '#783bff'],
        grid: {
            strokeDashArray: 7,
            padding: {
                top: 0,
                right: -10,
                bottom: 15,
                left: -10,
            },
        },

        xaxis: {
            axisBorder: {
                show: false,
            },
            labels: {
                offsetY: 2,
            },
        },
        yaxis: {
            tickAmount: 3,
            min: 0,
            labels: {
                formatter: function (val) {
                    return val + 'k';
                },
                offsetX: -15,
            },
            axisBorder: {
                show: false,
            },
        },
        legend: {
            show: true,
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: 5,
            itemMargin: {
                horizontal: 5,
                vertical: 0,
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy',
            },
        },
        fill: {
            opacity: [1, 0.5],
            type: ['solid', 'gradient'],
            gradient: {
                type: 'vertical',
                inverseColors: false,
                opacityFrom: 0.35,
                opacityTo: 0,
                stops: [0, 80],
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
                barHeight: '70%',
                borderRadius: 3,
            },
        },
    };

    return (
        <Col lg={8}>
            <Card className="card-h-100">
                <CardHeader className="d-flex flex-wrap border-bottom border-dashed align-items-center gap-3">
                    <h4 className="header-title me-auto">
                        Patients Statistics <span className="text-muted fw-normal fs-14">(609.5k Patients)</span>
                    </h4>
                    <div className="d-flex flex-wrap gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                            All
                        </button>
                        <button type="button" className="btn btn-light active btn-sm">
                            1M
                        </button>
                        <button type="button" className="btn btn-light btn-sm">
                            6M
                        </button>
                        <button type="button" className="btn btn-light btn-sm">
                            1Y
                        </button>
                    </div>
                </CardHeader>
                <CardBody className="pt-1">
                    <div dir="ltr">
                        <ReactApexChart
                            height={358}
                            options={PatientsChartOpts}
                            series={PatientsChartOpts.series}
                            type="area"
                            className="apex-charts"
                        />
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

export default PatientsChart;
