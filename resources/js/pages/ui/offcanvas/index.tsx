import PageTitle from '@/components/PageTitle';

import MainLayout from '@/layouts/MainLayout';
import AllOffcanvas from './components/AllOffcanvas';

const Offcanvas = () => {
    return (
        <MainLayout>
            <PageTitle title="Offcanvas" subTitle="Base UI" />
            <AllOffcanvas />
        </MainLayout>
    );
};

export default Offcanvas;
