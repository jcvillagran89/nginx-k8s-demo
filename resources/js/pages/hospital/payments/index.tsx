import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import PaymentList from './components/PaymentList';
import PaymentStat from './components/PaymentStat';

const PaymentsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Payments" subTitle="Hospital" />
            <PaymentStat />
            <PaymentList />
        </MainLayout>
    );
};

export default PaymentsPage;
