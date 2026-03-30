import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import CardStats from "@/components/_admin/cards/CardStats";
import RecentActivity from "@/components/_admin/cards/RecentActivity";
import BarChart from "@/components/_admin/charts/BarChart";
import LineChart from "@/components/_admin/charts/LineChart";
import { Col, Row } from 'react-bootstrap';

const IndexDashboard = ({ cards, barChart, lineChart, recentActivities }) => {
    return (
        <MainLayout>
            <PageTitle title="Dashboard" subTitle="CCP Textil Lab" />
            <Row>
                <Col>
                    <CardStats cards={cards} />
                    <Row xxl={4}>
                        <Col lg={8}>
                            <BarChart data={barChart} />
                        </Col>
                        <Col lg={4}>
                            <RecentActivity activities={recentActivities} />
                        </Col>
                    </Row>
                    <Row>
                        &nbsp;
                        <Col lg={12}>
                            <LineChart data={lineChart} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default IndexDashboard;
