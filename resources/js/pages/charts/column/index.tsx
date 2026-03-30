import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllColumnChart from './Components/AllColumnChart';

const ColumnChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Candlestick Charts" subTitle="Apex" />
            <AllColumnChart />
        </MainLayout>
    );
};

export default ColumnChart;
