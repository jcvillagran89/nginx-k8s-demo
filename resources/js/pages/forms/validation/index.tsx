import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllValidation from './components/AllValidation';

const ValidationPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Form Validation" subTitle="Forms" />
            <AllValidation />
        </MainLayout>
    );
};

export default ValidationPage;
