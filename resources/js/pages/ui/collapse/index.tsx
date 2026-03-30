import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllCollapse from './components/AllCollapse';

const CollapsePage = () => {
    return (
        <MainLayout>
            <PageTitle title="Collapse" subTitle="Base UI" />
            <AllCollapse />
        </MainLayout>
    );
};

export default CollapsePage;
