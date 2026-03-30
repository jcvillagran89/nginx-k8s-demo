import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { checkFilesData } from '../data';

const CheckUpFileCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-block">
                        <CardTitle as={'h4'} className="mb-0">
                            Check Up File
                        </CardTitle>
                    </div>
                    <div className="ms-auto">
                        <Button variant="soft-primary" size="sm">
                            View All
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                {checkFilesData.map((item, idx) => (
                    <div
                        className={`d-flex p-2 rounded align-items-center gap-2 bg-light-subtle border border-dashed ${idx != 0 && 'mt-2'}`}
                        key={idx}
                    >
                        <div className="avatar avatar-lg  d-flex align-items-center justify-content-center rounded-circle">
                            <IconifyIcon icon="solar:file-download-bold" className="text-primary fs-3" />
                        </div>
                        <div className="d-block">
                            <Link href="" className="text-dark fw-medium">
                                {item.name}
                            </Link>
                            <p className="text-muted mb-0 fs-13">{item.storage} MB</p>
                        </div>
                        <div className="ms-auto text-end">
                            <Dropdown align={'end'}>
                                <DropdownToggle as={'a'} className="drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <IconifyIcon icon="tabler:dots-vertical" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem>Download</DropdownItem>
                                    <DropdownItem>Share</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

export default CheckUpFileCard;
