import { useLayoutContext } from '@/context/useLayoutContext';
import Dashboard from '@/pages/dashboard/sales/index';
import { useEffect } from 'react';

const Page = () => {
    const { changeLayoutOrientation } = useLayoutContext();
    useEffect(() => {
        changeLayoutOrientation('horizontal');

        return () => changeLayoutOrientation('vertical');
    }, []);
    return <Dashboard />;
};

export default Page;
