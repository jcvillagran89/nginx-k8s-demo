import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllBarChart from './components/AllBarChart';

const BarChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Bar Charts" subTitle="Apex" />
            <AllBarChart />
        </MainLayout>
    );
};

export default BarChart;
