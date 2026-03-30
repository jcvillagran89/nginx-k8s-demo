import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllNotifications from './components/AllNotifications';

const Notifications = () => {
    return (
        <MainLayout>
            <PageTitle title="Notifications" subTitle="Base UI" />
            <AllNotifications />
        </MainLayout>
    );
};

export default Notifications;
