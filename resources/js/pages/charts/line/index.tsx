import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllLineChart from './components/AllLineChart';

const LineChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Line Charts" subTitle="Apex" />
            <AllLineChart />
        </MainLayout>
    );
};

export default LineChart;
