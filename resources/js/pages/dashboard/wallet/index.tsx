import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import { Col, Row } from 'react-bootstrap';
import BalanceCard from './components/BalanceCard';
import QuickTransferCard from './components/QuickTransferCard';
import Stat from './components/Stat';
import TransactionsCard from './components/TransactionsCard';
import WalletOverviewChart from './components/WalletOverviewChart';

const WalletPage = () => {
    return (
        <MainLayout>
            <PageTitle title="E-Wallet" subTitle="Dashboard" />
            <Row>
                <Col xxl={9}>
                    <Stat />
                    <WalletOverviewChart />
                </Col>
                <Col xxl={3}>
                    <Row>
                        <Col md={6} xxl={12}>
                            <BalanceCard />
                        </Col>
                        <Col md={6} xxl={12}>
                            <QuickTransferCard />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <TransactionsCard />
                </Col>
            </Row>
        </MainLayout>
    );
};

export default WalletPage;
