import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import SparkChart from './components/SparkChart';

const SparkLinesChart = () => {
    return (
        <MainLayout>
            <PageTitle title="Sparklines Charts" subTitle="Apex" />
            <SparkChart />
        </MainLayout>
    );
};

export default SparkLinesChart;
