import PageTitle from '@/components/PageTitle';

import MainLayout from '@/layouts/MainLayout';
import AllPagination from './components/AllPagination';

const Pagination = () => {
    return (
        <MainLayout>
            <PageTitle title="Pagination" subTitle="Base UI" />
            <AllPagination />
        </MainLayout>
    );
};

export default Pagination;
