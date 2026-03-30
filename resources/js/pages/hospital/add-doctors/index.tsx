import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AddDoctors from './components/AddDoctors';

const AddDoctorsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Add Doctors" subTitle="Hospital" />
            <AddDoctors />
        </MainLayout>
    );
};

export default AddDoctorsPage;
