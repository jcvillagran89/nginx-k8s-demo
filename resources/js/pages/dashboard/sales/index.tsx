import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import { Card, Col, Row } from 'react-bootstrap';
import Activity from './Components/Activity';
import BrandsListingCard from './Components/BrandsListingCard';
import EstimatedCard from './Components/EstimatedCard';
import Orders from './Components/Orders';
import OverviewChart from './Components/OverviewChart';
import SalesPageTitle from './Components/SalesPageTitle';
import SellingProductsCard from './Components/SellingProductsCard';
import Stat from './Components/Stat';
import TrafficSourceChart from './Components/TrafficSourceChart';

const SalesPage = () => {
    return (
        <MainLayout>
            <SalesPageTitle />
            <Row>
                <Col>
                    <Stat />
                    <Row>
                        <OverviewChart />
                        <TrafficSourceChart />
                    </Row>
                    <Row>
                        <Col xxl={6}>
                            <BrandsListingCard />
                        </Col>
                        <Col xxl={6}>
                            <SellingProductsCard />
                        </Col>
                    </Row>
                </Col>
                <Col xs={'auto'} className="info-sidebar">
                    <div className="alert alert-primary d-flex align-items-center">
                        <IconifyIcon icon="solar:help-bold-duotone" className="fs-24 me-1" /> <b>Help line:</b>{' '}
                        <span className="fw-medium ms-1">+(012) 123 456 78</span>
                    </div>
                    <EstimatedCard />
                    <Card>
                        <Orders />
                        <Activity />
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default SalesPage;
