import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { SellersType } from '@/types/data';
import { ApexOptions } from 'apexcharts';

import { Link } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';

const SellersCard = ({ title, image, brand, description, email, location, rating, revenue, sells, series, stock }: SellersType) => {
    const sellersChartOpts: ApexOptions = {
        chart: { type: 'area', height: 100, sparkline: { enabled: !0 } },
        series: series,
        stroke: { width: 2, curve: 'smooth' },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        markers: { size: 0 },
        colors: ['#465dff'],
        tooltip: {
            fixed: { enabled: !1 },
            x: { show: !1 },
            y: {
                title: {
                    formatter: function () {
                        return '';
                    },
                },
            },
            marker: { show: !1 },
        },
    };
    return (
        <Card>
            <CardBody>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                    <div className="avatar-xl bg-light d-flex align-items-center justify-content-center rounded-circle flex-shrink-0">
                        <img src={image} alt="seller" className="avatar-lg h-auto w-auto flex-shrink-0" />
                    </div>
                    <div>
                        <h4 className="text-dark fw-semibold">{title}</h4>
                        <div className="flex-grow-1 d-inline-flex align-items-center fs-18">
                            {Array(Math.floor(rating.star))
                                .fill(0)
                                .map((_star, idx) => (
                                    <li className="icons-center" key={idx}>
                                        <IconifyIcon icon="tabler:star-filled" className="text-warning" />
                                    </li>
                                ))}
                            {!Number.isInteger(rating.star) && (
                                <li className="icons-center">
                                    <IconifyIcon icon="tabler:star-half-filled" className="text-warning" />{' '}
                                </li>
                            )}
                            {rating.star < 5 &&
                                Array(5 - Math.ceil(rating.star))
                                    .fill(0)
                                    .map((_star, idx) => (
                                        <li className="icons-center" key={idx}>
                                            <IconifyIcon icon="tabler:star" className="text-warning" />
                                        </li>
                                    ))}
                            <span className="ms-1 fs-14 fw-medium">{rating.review}k</span>
                        </div>
                    </div>
                    <div className="ms-lg-auto">
                        <Button variant="primary" size="sm">
                            Message
                        </Button>
                    </div>
                </div>
                <p className="my-3 fw-medium">&quot; {description} &quot;</p>
                <p className="mb-1 fw-medium  d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:map-point-search-bold" className="fs-20 text-danger" /> : <span className="fw-medium">{location},</span>
                </p>
                <p className="mb-3 text-dark fw-medium  d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:letter-bold" className="fs-20 text-danger" /> :{' '}
                    <Link href="" className="link-primary fw-medium">
                        {email}
                    </Link>
                </p>
                <div className="border border-end-0 border-start-0 border-dashed p-2 mx-n3">
                    <Row className="text-center g-2">
                        <Col lg={4} xs={4} className="border-end">
                            <h4 className="mb-1">{stock}</h4>
                            <p className="text-muted mb-0">Item Stock</p>
                        </Col>
                        <Col lg={4} xs={4} className="border-end">
                            <h4 className="mb-1">+{sells}k</h4>
                            <p className="text-muted mb-0">Sells</p>
                        </Col>
                        <Col lg={4} xs={4}>
                            <h4 className="mb-1">{brand}</h4>
                            <p className="text-muted mb-0">Brand</p>
                        </Col>
                    </Row>
                </div>
                <Row className="align-items-center justify-content-between my-4 text-center">
                    <Col lg={8} className="border-end">
                        <ReactApexChart
                            height={100}
                            options={sellersChartOpts}
                            series={sellersChartOpts.series}
                            type="area"
                            className="apex-charts pe-lg-3"
                        />
                    </Col>
                    <Col lg={4}>
                        <h3 className="mb-1 fw-semibold">${revenue}</h3>
                        <p className="text-muted mb-0 fs-14">Revenue</p>
                    </Col>
                </Row>
                <div className="gap-1 hstack">
                    <Button variant="primary" className="w-100">
                        Show Profile
                    </Button>
                    <Button variant="light" className="w-100">
                        Edit Profile
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default SellersCard;
