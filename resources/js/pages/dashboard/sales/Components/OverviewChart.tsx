import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { overViewChartData } from '../data';

const OverviewChart = () => {
    const OverViewOpts: ApexOptions = {
        series: [
            {
                name: 'Total Income',
                type: 'bar',
                data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57],
            },
            {
                name: 'Total Expenses',
                type: 'bar',
                data: [22.25, 24.58, 36.74, 22.87, 19.54, 25.03, 29.24, 10.57, 24.57, 35.36, 20.51, 17.57],
            },
            {
                name: 'Investments',
                type: 'area',
                data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
            },
            {
                name: 'Savings',
                type: 'line',
                data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
            },
        ],
        chart: {
            height: 300,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            dashArray: [0, 0, 0, 8],
            width: [0, 0, 2, 2],
            curve: 'smooth',
        },
        fill: {
            opacity: [1, 1, 0.1, 1],
            type: ['gradient', 'solid', 'solid', 'solid'],
            gradient: {
                type: 'vertical',
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 70],
            },
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
            stepSize: 25,
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
                right: -15,
                bottom: 15,
                left: -15,
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
                columnWidth: '50%',
                barHeight: '70%',
                borderRadius: 3,
            },
        },
        colors: ['#6ac75a', '#465dff', '#783bff', '#f7577e'],
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
        <Col xxl={8}>
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                    <h4 className="header-title">Overview</h4>
                    <Dropdown align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler:dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Sales Report</DropdownItem>
                            <DropdownItem>Export Report</DropdownItem>
                            <DropdownItem>Profit</DropdownItem>
                            <DropdownItem>Action</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <div className="bg-light bg-opacity-50">
                    <Row className="text-center">
                        {overViewChartData.map((item, idx) => (
                            <Col md={3} xs={6} key={idx}>
                                <p className="text-muted mt-3 mb-1">{item.title}</p>
                                <h4 className="mb-3 icons-center">
                                    <IconifyIcon icon={item.icon} className={`text-${item.variant} me-1`} /> &nbsp;
                                    <span>${item.count}k</span>
                                </h4>
                            </Col>
                        ))}
                    </Row>
                </div>
                <CardBody className="pt-0">
                    <div dir="ltr">
                        <ReactApexChart
                            height={300}
                            options={OverViewOpts}
                            series={OverViewOpts.series}
                            type="line"
                            className="apex-charts"
                            data-colors="#6ac75a,#465dff,#783bff,#f7577e"
                        />
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

export default OverviewChart;
