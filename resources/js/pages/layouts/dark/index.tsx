import { useLayoutContext } from '@/context/useLayoutContext';
import Dashboard from '@/pages/dashboard/sales/index';
import { useEffect } from 'react';

const Page = () => {
    const { changeTheme } = useLayoutContext();
    useEffect(() => {
        changeTheme('dark');

        return () => changeTheme('light');
    }, []);
    return <Dashboard />;
};

export default Page;
