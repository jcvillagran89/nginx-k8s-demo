import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllEditors from './components/AllEditors';

const EditorsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Editors" subTitle="Forms" />
            <AllEditors />
        </MainLayout>
    );
};

export default EditorsPage;
