import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import FIleManager from './components/FIleManager';

const FileManagerPage = () => {
    return (
        <MainLayout>
            <PageTitle title="File Manager" subTitle="Apps" />
            <FIleManager />
        </MainLayout>
    );
};

export default FileManagerPage;
