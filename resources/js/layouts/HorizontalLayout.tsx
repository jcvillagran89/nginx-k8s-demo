import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import HorizontalNavBar from '@/components/layout/HorizontalNav/page';
import TopNavigationBarPage from '@/components/layout/TopNavigationBar/page';
import { getHorizontalMenuItems } from '@/helpers/menu';
import { ChildrenType } from '@/types/component-props';
import { Suspense } from 'react';

const HorizontalLayout = ({ children }: ChildrenType) => {
    const menuItems = getHorizontalMenuItems();
    return (
        <div className="wrapper">
            <Suspense fallback={<FallbackLoading />}>
                <TopNavigationBarPage />
            </Suspense>

            <Suspense fallback={<FallbackLoading />}>
                <HorizontalNavBar menuItems={menuItems} />
            </Suspense>

            <div className="page-content">
                <div className="page-container">{children}</div>
            </div>
        </div>
    );
};

export default HorizontalLayout;
