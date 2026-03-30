import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllAreaChart from './components/AllAreaChart';

const Area = () => {
    return (
        <MainLayout>
            <PageTitle title="Area Charts" subTitle="Apex" />
            <AllAreaChart />
        </MainLayout>
    );
};

export default Area;
