import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllRadarChart from './components/AllRadarChart';

const RadarChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Radar Charts" subTitle="Apex" />
            <AllRadarChart />
        </MainLayout>
    );
};

export default RadarChart;
