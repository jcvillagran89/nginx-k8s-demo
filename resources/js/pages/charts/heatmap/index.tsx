import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllHeatmapChart from './components/AllHeatmapChart';

const HeatmapChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Heatmap Charts" subTitle="Apex" />
            <AllHeatmapChart />
        </MainLayout>
    );
};

export default HeatmapChart;
