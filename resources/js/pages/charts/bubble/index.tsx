import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllBubbleChart from './components/AllBubbleChart';

const BubbleChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Bubble Charts" subTitle="Apex" />
            <AllBubbleChart />
        </MainLayout>
    );
};

export default BubbleChart;
