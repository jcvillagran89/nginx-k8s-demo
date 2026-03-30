import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import TopNavigationBarPage from '@/components/layout/TopNavigationBar/page';
import VerticalNavigationBar from '@/components/layout/VerticalNavigationBar/page';
import Preloader from '@/components/Preloader';
import { ChildrenType } from '@/types/component-props';
import { Suspense } from 'react';

const VerticalLayout = ({ children }: ChildrenType) => {
    return (
        <div className="wrapper">
            <Suspense fallback={<FallbackLoading />}>
                <TopNavigationBarPage />
            </Suspense>

            <Suspense fallback={<FallbackLoading />}>
                <VerticalNavigationBar />
            </Suspense>

            <div className="page-content">
                <div className="container-fluid">
                    <Suspense fallback={<Preloader />}>{children}</Suspense>
                </div>
            </div>
        </div>
    );
};

export default VerticalLayout;
