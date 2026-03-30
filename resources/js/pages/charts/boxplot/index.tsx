import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllBoxplotChart from './components/AllBoxplotChart';

const BoxplotChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Boxplot Charts" subTitle="Apex" />
            <AllBoxplotChart />
        </MainLayout>
    );
};

export default BoxplotChart;
