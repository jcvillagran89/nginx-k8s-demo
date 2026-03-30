import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllRating from './components/AllRating';

const Ratings = () => {
    return (
        <MainLayout>
            <PageTitle title="Ratings" subTitle="Extended UI" />
            <AllRating />
        </MainLayout>
    );
};

export default Ratings;
