import logoDark from '@/images/logo-dark.png';
import logoSm from '@/images/logo-sm.png';
import logo from '@/images/logo.png';
import logoMY from '@/images/my-logo.png';

import { Link } from '@inertiajs/react';

const LogoBox = () => {
    return (
        <Link href="/" className="logo">
            <span className="logo-light">
                <span className="logo-lg">
                    <img src={logo} width={50} height={70} alt="logo" />
                </span>
                <span className="logo-sm">
                    <img src={logoSm} width={20} height={20} alt="small logo" />
                </span>
            </span>
            <span className="logo-dark">
                <span className="logo-lg">
                    <img src={logoDark} width={50} height={80} alt="dark logo" />
                </span>
                <span className="logo-sm">
                    <img src={logoSm} width={20} height={20} alt="small logo" />
                </span>
            </span>
        </Link>
    );
};

export default LogoBox;
