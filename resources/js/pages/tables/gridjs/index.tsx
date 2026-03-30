import PageTitle from '@/components/PageTitle';
import { getAllDataTableRecords } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';

import MainLayout from '@/layouts/MainLayout';
import AllDataTable from './components/AllDataTable';

const GridJs = () => {
    const dataTableRecords = useFetchData(getAllDataTableRecords);
    return (
        <MainLayout>
            <PageTitle title="Grid Js Tables" subTitle="Tables" />
            {dataTableRecords && <AllDataTable dataTableRecords={dataTableRecords} />}
        </MainLayout>
    );
};

export default GridJs;
