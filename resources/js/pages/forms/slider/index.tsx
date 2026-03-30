import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import AllSlider from './components/AllSlider';

const RangeSlider = () => {
    return (
        <MainLayout>
            <PageTitle title="Range Slider" subTitle="Forms" />
            <AllSlider />
        </MainLayout>
    );
};

export default RangeSlider;
