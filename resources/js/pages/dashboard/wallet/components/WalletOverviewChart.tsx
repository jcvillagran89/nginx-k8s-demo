import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

const WalletOverviewChart = () => {
    const overviewChartOpts: ApexOptions = {
        series: [
            {
                name: 'Total Income',
                type: 'bar',
                data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57],
            },
            {
                name: 'Total Expense',
                type: 'area',
                data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
            },
            {
                name: 'Investment',
                type: 'bar',
                data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
            },
        ],
        chart: {
            height: 375,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            dashArray: [0, 6, 0],
            width: [0, 2, 0],
            curve: 'smooth',
        },
        fill: {
            opacity: [1, 0.1, 1],
        },
        markers: {
            size: [0, 0, 0, 0],
            strokeWidth: 2,
            hover: {
                size: 4,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            min: 0,
            labels: {
                formatter: function (val) {
                    return val + 'k';
                },
            },
            axisBorder: {
                show: false,
            },
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10,
            },
        },
        legend: {
            show: true,
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: -5,
            markers: {
                // width: 9,
                // height: 9,
                // radius: 6,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '30%',
                barHeight: '70%',
                borderRadius: 3,
            },
        },
        colors: ['#465dff', '#6ac75a', '#f9c45c'],
        tooltip: {
            shared: true,
            y: [
                {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return '$' + y.toFixed(2) + 'k';
                        }
                        return y;
                    },
                },
                {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return '$' + y.toFixed(2) + 'k';
                        }
                        return y;
                    },
                },
                {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return '$' + y.toFixed(2) + 'k';
                        }
                        return y;
                    },
                },
                {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return '$' + y.toFixed(2) + 'k';
                        }
                        return y;
                    },
                },
            ],
        },
    };

    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <CardHeader className="d-flex flex-wrap align-items-center gap-2">
                        <h4 className="header-title me-auto mb-0">Overview</h4>
                        <Button variant="soft-primary">
                            Export <IconifyIcon icon="tabler:file-export" className="ms-1" />
                        </Button>
                        <div>
                            <div className="input-group">
                                <CustomFlatpickr
                                    className="form-control border-0 shadow"
                                    options={{
                                        defaultDate: ['2016-10-10', '2016-10-20'],
                                        dateFormat: 'Y-m-d',
                                        mode: 'range',
                                        enableTime: false,
                                    }}
                                />
                                <span className="input-group-text bg-primary border-primary text-white">
                                    <IconifyIcon icon="tabler:calendar" className="fs-15" />
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="bg-light bg-opacity-50">
                            <Row className="text-center">
                                <Col xs={6} className="col-md">
                                    <p className="text-muted mt-3 mb-1">Revenue</p>
                                    <h4 className="mb-3">
                                        <IconifyIcon icon="tabler:square-rounded-arrow-down" className="text-success me-1" />
                                        &nbsp;
                                        <span className="fw-semibold">{currency}29.5k</span>
                                    </h4>
                                </Col>
                                <Col xs={6} className="col-md">
                                    <p className="text-muted mt-3 mb-1">Expenses</p>
                                    <h4 className="mb-3">
                                        <IconifyIcon icon="tabler:square-rounded-arrow-up" className="text-danger me-1" />
                                        &nbsp;
                                        <span className="fw-semibold">{currency}15.07k</span>
                                    </h4>
                                </Col>
                                <Col xs={6} className="col-md">
                                    <p className="text-muted mt-3 mb-1">Investment</p>
                                    <h4 className="mb-3">
                                        <IconifyIcon icon="tabler:chart-infographic" className="me-1" />
                                        &nbsp;
                                        <span className="fw-semibold">{currency}3.6k</span>
                                    </h4>
                                </Col>
                                <Col xs={6} className="col-md">
                                    <p className="text-muted mt-3 mb-1">Savings</p>
                                    <h4 className="mb-3">
                                        <IconifyIcon icon="tabler:pig" className="me-1" />
                                        &nbsp;
                                        <span className="fw-semibold">{currency}6.9k</span>
                                    </h4>
                                </Col>
                            </Row>
                        </div>
                        <div dir="ltr" className="p-2">
                            <ReactApexChart
                                height={375}
                                options={overviewChartOpts}
                                series={overviewChartOpts.series}
                                type="line"
                                className="apex-charts"
                            />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default WalletOverviewChart;
