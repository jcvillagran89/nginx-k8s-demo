import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

const GenderChart = () => {
    const GenderChartOpts: ApexOptions = {
        chart: {
            height: 234,
            type: 'donut',
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            showAlways: true,
                            show: true,
                        },
                    },
                },
            },
        },
        series: [159.5, 148.56, 45.2],
        labels: ['Male', 'Female', 'Child'],
        colors: ['#465dff', '#6ac75a', '#67baf1'],
        dataLabels: {
            enabled: false,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
    };

    return (
        <Col xxl={'4'}>
            <Card>
                <CardHeader className="d-flex justify-content-between border-bottom border-dashed align-items-center">
                    <h4 className="header-title">Gender</h4>
                    <Button variant="soft-primary" size="sm">
                        Generate Report <IconifyIcon icon="tabler:file-export" className="ms-1" />
                    </Button>
                </CardHeader>
                <CardBody>
                    <ReactApexChart height={234} options={GenderChartOpts} series={GenderChartOpts.series} type="donut" className="apex-charts" />
                    <Row className="mt-3">
                        <Col sm={'4'} className="text-start">
                            <p className="text-muted mb-1">Male Patient</p>
                            <h4 className="mb-2">
                                <IconifyIcon icon="tabler:man" className="text-primary" />
                                &nbsp;
                                <span>159.5k</span>
                            </h4>
                            <span className="badge fs-12 badge-soft-danger">
                                <IconifyIcon icon="tabler:arrow-badge-down" /> 3.91%
                            </span>
                        </Col>
                        <Col sm={'4'} className="text-center">
                            <p className="text-muted mb-1">Female Patient</p>
                            <h4 className="mb-2">
                                <IconifyIcon icon="tabler:woman" className="text-success" />
                                &nbsp;
                                <span>148.56k</span>
                            </h4>
                            <span className="badge fs-12 badge-soft-success">
                                <IconifyIcon icon="tabler:arrow-badge-up" /> 8.72%
                            </span>
                        </Col>
                        <Col sm={'4'} className="text-end">
                            <p className="text-muted mb-1">Child Patient</p>
                            <h4 className="mb-2">
                                <IconifyIcon icon="tabler:baby-carriage" className="text-info" />
                                &nbsp;
                                <span>45.2k</span>
                            </h4>
                            <span className="badge fs-12 badge-soft-success">
                                <IconifyIcon icon="tabler:arrow-badge-up" /> 1.05%
                            </span>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
};

export default GenderChart;
