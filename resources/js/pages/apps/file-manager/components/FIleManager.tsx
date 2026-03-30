import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Card } from 'react-bootstrap';
import QuickAccess from './QuickAccess';
import Recent from './Recent';
import SideBarFile from './SideBarFile';

const FIleManager = () => {
    return (
        <Card>
            <div className="d-flex">
                <div className="d-none d-xl-block">
                    <SideBarFile />
                </div>
                <div className="w-100 border-start">
                    <QuickAccess />
                    <div className="px-3 d-flex align-items-center justify-content-between mb-3">
                        <h4 className="header-title">Recent</h4>
                        <Link href="" className="link-reset fw-semibold text-decoration-underline link-offset-2">
                            View All <IconifyIcon icon="tabler:arrow-right" />
                        </Link>
                    </div>
                    <Recent />
                </div>
            </div>
        </Card>
    );
};

export default FIleManager;
