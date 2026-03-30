import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

const WaterChart = () => {
    const WaterChartOpts: ApexOptions = {
        chart: {
            type: 'bar',
            height: 200,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                borderRadius: 4,
            },
        },
        colors: ['#465dff'],
        series: [
            {
                data: [2, 3, 2, 7, 4, 2, 3],
            },
        ],
        xaxis: {
            categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            labels: {
                style: {
                    colors: ['#39afd1', '#ffbc00'],
                    fontSize: '14px',
                },
            },
        },
        legend: {
            offsetY: 7,
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
    };

    return (
        <Card>
            <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Water
                </CardTitle>
                <div>
                    <p className="mb-0 fs-15 text-dark fw-medium">Goal: 15/56</p>
                </div>
            </CardHeader>
            <CardBody>
                <div className="custom-progress rounded">
                    <div className="progress-info d-flex justify-content-between align-items-center">
                        <div>
                            <span className="align-middle fw-medium fs-16">Cups Tracked</span>
                        </div>
                        <span className="fw-medium text-muted float-end">56</span>
                    </div>
                    <div className="progress-data rounded bg-primary" style={{ width: '15%' }} />
                </div>
                <div id="booked-revenue-chart" data-colors="#465dff" className="mt-5" />
                <ReactApexChart height={200} options={WaterChartOpts} series={WaterChartOpts.series} type="bar" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default WaterChart;
