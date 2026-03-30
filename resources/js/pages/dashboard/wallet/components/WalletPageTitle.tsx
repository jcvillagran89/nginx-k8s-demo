import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';

const WalletPageTitle = () => {
    return (
        <div className="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
            <div className="flex-grow-1">
                <h4 className="fs-18 fw-semibold mb-0">E-Wallet</h4>
            </div>
            <div className="text-end">
                <ol className="breadcrumb m-0 py-0">
                    <li className="breadcrumb-item">
                        <Link href="">Osen</Link>
                    </li>{' '}
                    <IconifyIcon icon="tabler:chevron-right" />
                    <li className="breadcrumb-item">
                        <Link href="">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">E-Wallet</li>
                </ol>
            </div>
        </div>
    );
};

export default WalletPageTitle;
