import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllModal from './components/AllModal';

const Modals = () => {
    return (
        <MainLayout>
            <PageTitle title="Modals" subTitle="Base UI" />
            <AllModal />
        </MainLayout>
    );
};

export default Modals;
