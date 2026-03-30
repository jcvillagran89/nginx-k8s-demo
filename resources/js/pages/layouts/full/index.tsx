import { useLayoutContext } from '@/context/useLayoutContext';
import Dashboard from '@/pages/dashboard/sales/index';
import { useEffect } from 'react';

const Page = () => {
    const { changeMenu } = useLayoutContext();
    useEffect(() => {

        changeMenu.size('full');

        return () => changeMenu.size('default');
    }, []);
    return <Dashboard />;
};

export default Page;
