import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AppointmentStat from './components/AppointmentStat';
import AppointmentsList from './components/AppointmentsList';

const AppointmentsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Appointments" subTitle="Hospital" />
            <AppointmentStat />
            <AppointmentsList />
        </MainLayout>
    );
};

export default AppointmentsPage;
