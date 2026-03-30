import { useLayoutContext } from '@/context/useLayoutContext';
import Dashboard from '@/pages/dashboard/sales/index';
import { useEffect } from 'react';

const Page = () => {
    const { changeLayoutMode } = useLayoutContext();
    useEffect(() => {

        changeLayoutMode('detached');

        return () => changeLayoutMode('fluid');
    }, []);
    return <Dashboard />;
};

export default Page;
