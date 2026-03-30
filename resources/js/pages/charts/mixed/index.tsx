import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllMixedChart from './components/AllMixedChart';

const MixedChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Mixed Charts" subTitle="Apex" />
            <AllMixedChart />
        </MainLayout>
    );
};

export default MixedChart;
