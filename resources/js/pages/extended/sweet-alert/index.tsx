import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllAlert from './components/AllAlert';

const SweetAlert = () => {
    return (
        <MainLayout>
            <PageTitle title="Sweet Alert 2" subTitle="Extended UI" />
            <AllAlert />
        </MainLayout>
    );
};

export default SweetAlert;
