import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import ProductDetails from './components/ProductDetails';
import ProductDetailsDescription from './components/ProductDetailsDescription';

const ProductDetailsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Product Details" subTitle="eCommerce" />
            <ProductDetails />
            <ProductDetailsDescription />
        </MainLayout>
    );
};

export default ProductDetailsPage;
