import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useToggle from '@/hooks/useToggle';
import avatar1 from '@/images/users/avatar-1.jpg';
import { Link } from '@inertiajs/react';
import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Offcanvas, ProgressBar, Row } from 'react-bootstrap';
import { quickAccessData, QuickAccessType } from '../data';
import SideBarFile from './SideBarFile';

const QuickAccessCard = ({ files, icon, progress, storage, title, variant }: QuickAccessType) => {
    const { isTrue, toggle } = useToggle();
    return (
        <Card className="border border-light">
            <CardBody>
                <div className="d-flex align-items-start justify-content-between gap-2">
                    <div className={`flex-shrink-0 avatar-md bg-${variant}-subtle d-inline-flex align-items-center justify-content-center rounded-2`}>
                        <IconifyIcon icon={icon} className="fs-18" />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span data-toggler="on" onClick={toggle}>
                            {isTrue ? (
                                <Link href="" data-toggler-on>
                                    <IconifyIcon icon="tabler:star-filled" className="text-warning fs-16" />
                                </Link>
                            ) : (
                                <Link href="" data-toggler-off>
                                    <IconifyIcon icon="tabler:star-filled" className="text-muted fs-16" />
                                </Link>
                            )}
                        </span>
                        <Dropdown align={'end'} className="flex-shrink-0 text-muted">
                            <DropdownToggle
                                as={'a'}
                                href="#"
                                className="drop-arrow-none fs-20 link-reset p-0"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <IconifyIcon icon="tabler-dots-vertical" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem>
                                    <IconifyIcon icon="tabler:share" className="me-1" /> Share
                                </DropdownItem>
                                <DropdownItem>
                                    <IconifyIcon icon="tabler:link" className="me-1" /> Get Sharable Link
                                </DropdownItem>
                                <DropdownItem href={avatar1} download className="dropdown-item">
                                    <IconifyIcon icon="tabler:download" className="me-1" /> Download
                                </DropdownItem>
                                <DropdownItem>
                                    <IconifyIcon icon="tabler:pin" className="me-1" /> Pin
                                </DropdownItem>
                                <DropdownItem>
                                    <IconifyIcon icon="tabler:edit" className="me-1" /> Edit
                                </DropdownItem>
                                <DropdownItem data-dismissible="#googleMedia">
                                    <IconifyIcon icon="tabler:trash" className="me-1" /> Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex-grow-1 mt-3">
                    <h5 className="mb-1">
                        <Link href="" className="link-reset">
                            {title}
                        </Link>
                    </h5>
                    <p className="text-muted mb-0">{files} Files</p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 mb-1">
                    <p className="fs-14 mb-0">{storage}GB</p>
                    <p className="fs-14 mb-0">50GB</p>
                </div>
                <ProgressBar striped animated variant={variant} className={`progress-sm bg-${variant}-subtle`} role="progressbar" now={progress} />
            </CardBody>
        </Card>
    );
};

const QuickAccess = () => {
    const { isTrue, toggle } = useToggle();
    return (
        <>
            <div className="p-3">
                <div className="d-flex align-items-center gap-1 mb-3">
                    <div className="flex-shrink-0 d-xl-none d-inline-flex">
                        <button
                            onClick={toggle}
                            className="btn btn-sm btn-icon btn-soft-primary align-items-center p-0"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#fileManagerSidebar"
                            aria-controls="fileManagerSidebar"
                        >
                            <IconifyIcon icon="tabler:menu-2" className="fs-20" />
                        </button>
                    </div>
                    <h4 className="header-title">Quick Access</h4>
                </div>
                <Row>
                    {quickAccessData.map((item, idx) => (
                        <Col md={6} xxl={3} id="googleMedia" key={idx}>
                            <QuickAccessCard {...item} />
                        </Col>
                    ))}
                </Row>
            </div>
            {
                <Offcanvas
                    show={isTrue}
                    onHide={toggle}
                    className="offcanvas-xl offcanvas-start file-manager"
                    tabIndex={-1}
                    id="fileManagerSidebar"
                    aria-labelledby="fileManagerSidebarLabel"
                >
                    <SideBarFile toggle={toggle} />
                </Offcanvas>
            }
        </>
    );
};

export default QuickAccess;
