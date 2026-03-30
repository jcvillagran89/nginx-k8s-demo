import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AddPatients from './components/AddPatients';

const AddPatientsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Add Patients" subTitle="Hospital" />
            <AddPatients />
        </MainLayout>
    );
};

export default AddPatientsPage;
