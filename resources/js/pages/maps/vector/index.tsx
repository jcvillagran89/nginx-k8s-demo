import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllVectorMaps from './components/AllVectorMaps';

const VectorMaps = () => {
    return (
        <MainLayout>
            <PageTitle title="Vector Maps" subTitle="Maps" />
            <AllVectorMaps />
        </MainLayout>
    );
};

export default VectorMaps;
