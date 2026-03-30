import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllTabs from './components/AllTabs';

const Tabs = () => {
    return (
        <MainLayout>
            <PageTitle title="Tabs" subTitle="Base UI" />
            <AllTabs />
        </MainLayout>
    );
};

export default Tabs;
