import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';

const TrafficSourceChart = () => {
    const TrafficChartOpts: ApexOptions = {
        chart: {
            height: 286,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                track: {
                    margin: 17,
                    background: 'rgba(170,184,197, 0.2)',
                },
                hollow: {
                    size: '1%',
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    },
                },
            },
        },
        stroke: {
            lineCap: 'round',
        },
        colors: ['#465dff', '#6ac75a', '#783bff', '#f7577e'],
        series: [44, 55, 67, 22],
        labels: ['Completed', 'In Progress', 'Yet to Start', 'Cancelled'],
        responsive: [
            {
                breakpoint: 380,
                options: {
                    chart: {
                        height: 260,
                    },
                },
            },
        ],
    };
    return (
        <Col xxl={4}>
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-center border-bottom border-dashed">
                    <h4 className="header-title">Top Traffic by Source</h4>
                    <Dropdown align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler:dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Refresh Report</DropdownItem>
                            <DropdownItem>Export Report</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <CardBody>
                    <ReactApexChart
                        height={286}
                        options={TrafficChartOpts}
                        series={TrafficChartOpts.series}
                        type="radialBar"
                        className="apex-charts"
                    />
                    <Row className="mt-2">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center p-1">
                                <div>
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-12 align-middle me-1 text-primary" />
                                    <span className="align-middle fw-semibold">Direct</span>
                                </div>
                                <span className="fw-semibold text-muted float-end">
                                    <IconifyIcon icon="tabler:arrow-badge-down" className="text-danger" /> 965
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1">
                                <div>
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-12 text-success align-middle me-1" />
                                    <span className="align-middle fw-semibold">Social</span>
                                </div>
                                <span className="fw-semibold text-muted float-end">
                                    <IconifyIcon icon="tabler:arrow-badge-up" className="text-success" /> 75
                                </span>
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex justify-content-between align-items-center p-1">
                                <div>
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-12 text-secondary align-middle me-1" />
                                    <span className="align-middle fw-semibold"> Marketing</span>
                                </div>
                                <span className="fw-semibold text-muted float-end">
                                    <IconifyIcon icon="tabler:arrow-badge-up" className="text-success" /> 102
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1">
                                <div>
                                    <IconifyIcon icon="tabler:circle-filled" className="fs-12 text-danger align-middle me-1" />
                                    <span className="align-middle fw-semibold">Affiliates</span>
                                </div>
                                <span className="fw-semibold text-muted float-end">
                                    <IconifyIcon icon="tabler:arrow-badge-down" className="text-danger" /> 96
                                </span>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
};

export default TrafficSourceChart;
