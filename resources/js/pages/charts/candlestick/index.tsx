import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllCandlestick from './components/AllCandlestick';

const Candlestick = () => {
    return (
        <MainLayout>
            <PageTitle title="Candlestick Charts" subTitle="Apex" />
            <AllCandlestick />
        </MainLayout>
    );
};

export default Candlestick;
