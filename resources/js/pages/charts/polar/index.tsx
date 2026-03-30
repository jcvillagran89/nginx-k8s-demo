import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllPolarChart from './components/AllPolarChart';

const PolarChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Polar Area Charts" subTitle="Apex" />
            <AllPolarChart />
        </MainLayout>
    );
};

export default PolarChart;
