import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllPieChart from './components/AllPieChart';

const PieChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Pie Charts" subTitle="Apex" />
            <AllPieChart />
        </MainLayout>
    );
};

export default PieChart;
