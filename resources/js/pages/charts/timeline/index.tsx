import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllTimeLineChart from './components/AllTimeLineChart';

const TimelineChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Timeline Charts" subTitle="Apex" />
            <AllTimeLineChart />
        </MainLayout>
    );
};

export default TimelineChart;
