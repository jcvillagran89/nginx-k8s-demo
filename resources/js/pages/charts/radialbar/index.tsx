import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllRadialBarChart from './components/AllRadialBarChart';

const RadialBar = () => {
    return (
        <MainLayout>
            <PageTitle title="RadialBar Charts" subTitle="Apex" />
            <AllRadialBarChart />
        </MainLayout>
    );
};

export default RadialBar;
