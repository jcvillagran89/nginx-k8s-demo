import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllLeaflet from './components/AllLeaflet';

const LeafletMaps = () => {
    return (
        <MainLayout>
            <PageTitle title="Leaflet Maps" subTitle="Maps" />
            <AllLeaflet />
        </MainLayout>
    );
};

export default LeafletMaps;
