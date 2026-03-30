import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Link } from '@inertiajs/react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';

const Stat = () => {
    const incomeOpts: ApexOptions = {
        chart: {
            type: 'area',
            height: 50,
            sparkline: {
                enabled: true,
            },
        },
        series: [
            {
                data: [25, 28, 32, 38, 43, 55, 60, 48, 42, 51, 35],
            },
        ],
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        markers: {
            size: 0,
        },
        colors: ['#6ac75a'],
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },

            marker: {
                show: false,
            },
        },
        fill: {
            opacity: [1],
            type: ['gradient'],
            gradient: {
                type: 'vertical',
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
    };

    const expenseOpts: ApexOptions = {
        chart: {
            type: 'bar',
            height: 60,
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
                data: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82],
            },
        ],
        // labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        xaxis: {
            crosshairs: {
                width: 1,
            },
        },
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },
            marker: {
                show: false,
            },
        },
    };
    return (
        <Row>
            <Col xl={4}>
                <Card>
                    <div className="d-flex card-header justify-content-between align-items-center">
                        <h4 className="header-title">Total Balance</h4>
                        <Dropdown>
                            <DropdownToggle
                                as={'a'}
                                className="bg-light-subtle rounded drop-arrow-none card-drop"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <IconifyIcon icon="tabler:dots-vertical" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem>Sales Report</DropdownItem>
                                <DropdownItem>Export Report</DropdownItem>
                                <DropdownItem>Profit</DropdownItem>
                                <DropdownItem>Action</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <CardBody className="pt-0">
                        <h2 className="fw-bold">
                            {currency}92,652.36{' '}
                            <Link href="" className="text-muted icons-center">
                                <IconifyIcon icon="tabler:eye" />
                            </Link>
                        </h2>
                        <Row className="g-2 mt-2 pt-1">
                            <Col>
                                <Button variant="primary" className="w-100">
                                    <IconifyIcon icon="tabler:coin" className=" me-1" /> Transfer
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="info" className="w-100">
                                    <IconifyIcon icon="tabler:coin" className=" me-1" /> Request
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col xl={4}>
                <Card>
                    <CardBody>
                        <Row className="justify-content-between">
                            <Col sm={4}>
                                <IconifyIcon icon="solar:money-bag-bold-duotone" className="fs-36 text-muted" />
                                <h3 className="mb-0 fw-bold mt-2 mb-2">{currency}105.3k</h3>
                                <p className="text-muted">Total Income</p>
                                <span className="badge fs-12 badge-soft-danger">
                                    <IconifyIcon icon="tabler-arrow-badge-down" /> 0.93%
                                </span>
                            </Col>
                            <Col sm={7} className="text-end d-flex flex-column">
                                <Link href="" className="link-reset text-decoration-underline link-offset-2 fw-medium pb-2">
                                    View Details
                                </Link>
                                <div className="text-end mt-auto">
                                    <ReactApexChart height={50} options={incomeOpts} series={incomeOpts.series} type="area" className="apex-charts" />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col xl={4}>
                <Card>
                    <CardBody>
                        <Row className="justify-content-between">
                            <Col sm={4}>
                                <IconifyIcon icon="solar:hand-money-bold-duotone" className="fs-36 text-muted" />
                                <h3 className="mb-0 fw-bold mt-2 mb-2">{currency}78.32k</h3>
                                <p className="text-muted">Total Expense</p>
                                <span className="badge fs-12 badge-soft-success">
                                    <IconifyIcon icon="tabler:arrow-badge-up" /> 8.72%
                                </span>
                            </Col>
                            <Col sm={7} className="text-end d-flex flex-column">
                                <Link href="" className="link-reset text-decoration-underline link-offset-2 fw-medium pb-2">
                                    View Details
                                </Link>
                                <div className="text-end mt-auto">
                                    <div id="expenses-chart" data-colors="#465dff" />
                                    <ReactApexChart
                                        height={60}
                                        options={expenseOpts}
                                        series={expenseOpts.series}
                                        type="bar"
                                        className="apex-charts"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Stat;
