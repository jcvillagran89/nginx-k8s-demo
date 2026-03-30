import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllSelect from './components/AllSelect';

const SelectForm = () => {
    return (
        <MainLayout>
            <PageTitle title="Form Select" subTitle="Forms" />
            <AllSelect />
        </MainLayout>
    );
};

export default SelectForm;
