import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllScatterChart from './components/AllScatterChart';

const ScatterChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Scatter Charts" subTitle="Apex" />
            <AllScatterChart />
        </MainLayout>
    );
};

export default ScatterChart;
