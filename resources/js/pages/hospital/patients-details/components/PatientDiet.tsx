import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { dietData } from '../data';

const PatientStatisticCard = () => {
    const PatientStatisticChartOpts: ApexOptions = {
        chart: {
            height: 232,
            type: 'donut',
        },
        series: [4, 7],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 7,
        },
        labels: ['Analysis 4', 'Visits 7'],
        colors: ['#39afd1', '#ffbc00'],
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 240,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-block">
                        <CardTitle as={'h4'} className="mb-0">
                            Patient Statistic
                        </CardTitle>
                    </div>
                    <div className="ms-auto">
                        <Dropdown align={'end'}>
                            <DropdownToggle
                                as={'a'}
                                className="btn btn-sm btn-soft-primary drop-arrow-none"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                This Month
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem>Download</DropdownItem>
                                <DropdownItem>Export</DropdownItem>
                                <DropdownItem>Import</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <ReactApexChart
                    height={232}
                    options={PatientStatisticChartOpts}
                    series={PatientStatisticChartOpts.series}
                    type="donut"
                    className="apex-charts"
                />
                <div className="mt-4">
                    <p className="text-primary mb-0 fw-medium fs-16">Total Visit 11</p>
                </div>
            </CardBody>
        </Card>
    );
};

const DietCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-block">
                        <CardTitle as={'h4'} className="mb-0">
                            Diet
                        </CardTitle>
                    </div>
                    <div className="ms-auto">
                        <Button variant="soft-primary" size="sm">
                            Add Note
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <Row className="g-2">
                    <Col lg={6}>
                        <div className="d-flex p-2 rounded align-items-center gap-2 border">
                            <div className="avata d-flex align-items-center justify-content-center rounded-circle">
                                <IconifyIcon icon="solar:wineglass-bold-duotone" className="text-primary fs-3" />
                            </div>
                            <div>
                                <p className="text-muted fw-medium mb-0 fs-14">
                                    <span className="fw-medium text-dark">8 Glass Water -</span>Per day
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="d-flex p-2 rounded align-items-center gap-2 border">
                            <div className="avata d-flex align-items-center justify-content-center rounded-circle">
                                <IconifyIcon icon="solar:cup-hot-bold-duotone" className="text-primary fs-3" />
                            </div>
                            <div>
                                <p className="text-muted fw-medium mb-0 fs-14">
                                    <span className="fw-medium text-dark">3 Black Tea -</span>Per day
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
                {dietData.map((item, idx) => (
                    <div className="d-flex p-2 rounded align-items-center gap-2 border mt-2" key={idx}>
                        <div className="avata d-flex align-items-center justify-content-center rounded-circle">
                            <IconifyIcon icon={item.icon} className="text-primary fs-3" />
                        </div>
                        <div>
                            <p className="text-dark fw-medium mb-0 fs-14">{item.title}</p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

const PatientDiet = () => {
    return (
        <Row>
            <Col lg={6}>
                <PatientStatisticCard />
            </Col>
            <Col lg={6}>
                <DietCard />
            </Col>
        </Row>
    );
};

export default PatientDiet;
