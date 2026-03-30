import IconifyIcon from '@/components/wrappers/IconifyIcon';
import panda from '@/images/panda.svg';
import avatar1 from '@/images/users/avatar-1.jpg';
import { Button, ListGroupItem } from 'react-bootstrap';

type CloseType = {
    toggle?: () => void;
};

const SideBarFile = ({ toggle }: CloseType) => {
    return (
        <div className="d-flex flex-column">
            <div className="py-2 px-3 flex-shrink-0 d-flex align-items-center gap-2 border-bottom border-dashed">
                <div className="avatar-md">
                    <img src={avatar1} alt="avatar" className="img-fluid rounded-circle" />
                </div>
                <div>
                    <h5 className="mb-1 fs-16 fw-semibold icons-center">
                        Chris K &nbsp;{' '}
                        <IconifyIcon
                            icon="tabler:rosette-discount-check-filled"
                            className="text-success"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="Pro User"
                        />
                    </h5>
                    <p className="fs-12 mb-0">Welcome!</p>
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="btn btn-sm btn-icon btn-soft-danger ms-auto d-xl-none"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#fileManagerSidebar"
                    aria-label="Close"
                >
                    <IconifyIcon icon="tabler:x" />
                </button>
            </div>
            <div className="p-3">
                <div className="d-flex flex-column">
                    <button type="button" className="btn fw-medium btn-success drop-arrow-none dropdown-toggle w-100 mb-3">
                        Create New <IconifyIcon icon="tabler:plus" className="ms-1" />
                    </button>
                    <div className="file-menu">
                        <ListGroupItem className=" active">
                            <IconifyIcon icon="tabler:folder" className="fs-18 align-middle me-2" />
                            My Files
                        </ListGroupItem>
                        <ListGroupItem>
                            <IconifyIcon icon="tabler:brand-google-drive" className="fs-18 align-middle me-2" />
                            Google Drive
                        </ListGroupItem>
                        <ListGroupItem>
                            <IconifyIcon icon="tabler:share-3" className="fs-18 align-middle me-2" />
                            Share with me
                        </ListGroupItem>
                        <ListGroupItem>
                            <IconifyIcon icon="tabler:clock" className="fs-18 align-middle me-2" />
                            Recent
                        </ListGroupItem>
                        <ListGroupItem>
                            <IconifyIcon icon="tabler:star" className="fs-18 align-middle me-2" />
                            Starred
                        </ListGroupItem>
                        <ListGroupItem>
                            <IconifyIcon icon="tabler:trash" className="fs-18 align-middle me-2" />
                            Deleted Files
                        </ListGroupItem>
                    </div>
                    <div className="mt-5 pt-5">
                        <div className="alert alert-secondary p-3 pt-0 text-center mb-0" role="alert">
                            <img src={panda} alt="panda" className="img-fluid mt-n5" style={{ maxWidth: 135 }} />
                            <div>
                                <h5 className="alert-heading fw-semibold fs-18 mt-2">Get more space for files</h5>
                                <p>We offer you unlimited storage space for all you needs</p>
                                <Button variant="secondary">Upgrade to Pro</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBarFile;
