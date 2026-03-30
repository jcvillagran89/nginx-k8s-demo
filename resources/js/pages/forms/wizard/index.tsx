import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllWizard from './components/AllWizard';

const WizardPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Form Wizard" subTitle="Forms" />
            <AllWizard />
        </MainLayout>
    );
};

export default WizardPage;
