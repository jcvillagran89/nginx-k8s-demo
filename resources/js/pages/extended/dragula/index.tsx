import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllDragula from './components/AllDragula';

const Dragula = () => {
    return (
        <MainLayout>
            <PageTitle title="Dragula" subTitle="Extended UI" />
            <AllDragula />
        </MainLayout>
    );
};

export default Dragula;
