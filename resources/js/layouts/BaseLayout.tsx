import FallbackLoading from '@/components/FallbackLoading';
import { ChildrenType } from '@/types/component-props';
import { Suspense } from 'react';

const BaseLayout = ({ children }: ChildrenType) => {
    return <Suspense fallback={<FallbackLoading />}>{children}</Suspense>;
};

export default BaseLayout;
