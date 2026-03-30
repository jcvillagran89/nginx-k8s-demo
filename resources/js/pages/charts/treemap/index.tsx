import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllTreemap from './components/AllTreemap';

const index = () => {
    return (
        <MainLayout>
            <PageTitle title="Treemap Charts" subTitle="Apex" />
            <AllTreemap />
        </MainLayout>
    );
};

export default index;
