import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { SpecialtyData } from '../data';

const SpecialtyCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Specialty
                </CardTitle>
            </CardHeader>
            <CardBody>
                {SpecialtyData.map((item, idx) => (
                    <div className={`d-flex align-items-center gap-2 ${idx != 0 && 'mt-3'} `} key={idx}>
                        <div className="avatar-lg bg-light d-flex align-items-center justify-content-center rounded">
                            <IconifyIcon icon={item.icon} className="fs-28 text-primary" />
                        </div>
                        <div>
                            <p className="fs-15 mb-0">{item.title}</p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

const SkillsChart = () => {
    const SkillsChartOpts: ApexOptions = {
        chart: {
            height: 338,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                track: {
                    margin: 20,
                    background: 'rgba(170,184,197, 0.2)',
                },
                hollow: {
                    size: '5%',
                },
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    },
                },
            },
        },

        stroke: {
            lineCap: 'round',
        },

        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false,
            },
        },

        colors: ['#313a46', '#f9c45c', '#465dff', '#6ac75a'],
        series: [44, 60, 70, 80],
        labels: ['Patient Visit', 'Patient Care', 'Endoscopic', 'Operations'],
        responsive: [
            {
                breakpoint: 380,
                options: {
                    chart: {
                        height: 210,
                    },
                },
            },
        ],
    };

    return (
        <Row>
            <Col lg={6}>
                <Card>
                    <CardHeader className="border-bottom border-dashed">
                        <CardTitle as={'h4'} className="mb-0">
                            Skills
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactApexChart
                            height={338}
                            options={SkillsChartOpts}
                            series={SkillsChartOpts.series}
                            type="radialBar"
                            className="apex-charts"
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col lg={6}>
                <SpecialtyCard />
            </Col>
        </Row>
    );
};

export default SkillsChart;
