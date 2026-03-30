import flagUs from '@/images/flags/us.svg';

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { countryData } from '../data';

const Country = () => {
    return (
        <div className="topbar-item">
            <Dropdown className="" align={'end'}>
                <DropdownToggle as={'button'} className="topbar-link content-none" data-bs-offset="0,25" aria-haspopup="false" aria-expanded="false">
                    <img src={flagUs} alt="user-image" className="w-100 rounded" height={18} id="selected-language-image" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-start">
                    {countryData.map((item, idx) => (
                        <DropdownItem key={idx}>
                            <img src={item.image} alt="user-image" className="me-1 rounded" height={18} data-translator-image />{' '}
                            <span className="align-middle">{item.language}</span>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default Country;
