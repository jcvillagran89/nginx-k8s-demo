import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimpleBar from 'simplebar-react';
import { useChatContext } from '@/context/useChatContext';
import avatar1 from '@/images/users/avatar-1.jpg';
import { UserType } from '@/types/data';
import { getFirstTwoLetters } from '@/utils/change-casing';

import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

type ChatUsersProps = {
    onUserSelect: (value: UserType) => void;
    users: UserType[];
    selectedUser: UserType;
};

const Chat = ({ onUserSelect, users, selectedUser }: ChatUsersProps) => {
    const { chatSetting } = useChatContext();
    return (
        <div className="chat-user-list border-end">
            <CardBody className="py-2 px-3 border-bottom">
                <div className="d-flex align-items-center gap-2 py-1">
                    <div className="chat-users">
                        <div className="avatar-lg chat-avatar-online">
                            <img src={avatar1} className="img-fluid rounded-circle" alt="Chris Keller" />
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        <h5 className="mb-0">
                            <Link href="" className="text-reset lh-base">
                                Dhanoo K.
                            </Link>
                        </h5>
                        <p className="mb-0 text-muted">Admin</p>
                    </div>
                    <Dropdown className=" lh-1" align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon width={20} height={20} icon="solar:settings-outline" className="align-middle" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>
                                <IconifyIcon icon="tabler:user-plus" className="me-1 fs-17 align-middle" />
                                <span className="align-middle">New Contact</span>
                            </DropdownItem>
                            <DropdownItem>
                                <IconifyIcon icon="tabler:users-plus" className="me-1 fs-17 align-middle" />
                                <span className="align-middle">New Group</span>
                            </DropdownItem>
                            <DropdownItem>
                                <IconifyIcon icon="tabler:star" className="me-1 fs-17 align-middle" />
                                <span className="align-middle">Favorites</span>
                            </DropdownItem>
                            <DropdownItem>
                                <IconifyIcon icon="tabler:archive" className="me-1 fs-17 align-middle" />
                                <span className="align-middle">Archive Contacts</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <button
                        onClick={chatSetting.toggle}
                        type="button"
                        className="flex-grow-0 btn btn-sm btn-icon btn-soft-danger d-xl-none"
                        data-bs-dismiss="offcanvas"
                        data-bs-target="#chatUserList"
                        aria-label="Close"
                    >
                        <IconifyIcon icon="tabler:x" className="fs-20" />
                    </button>
                </div>
            </CardBody>
            <div className="d-flex flex-column chat">
                <SimpleBar className="users-list position-relative list-scroll">
                    <div className="px-3 py-2">
                        <div className="app-search py-1">
                            <input
                                type="text"
                                className="form-control border-light bg-light bg-opacity-50 rounded-2"
                                placeholder="Search something here..."
                            />
                            <IconifyIcon icon="tabler:search" className="app-search-icon text-muted fs-16" />
                        </div>
                    </div>
                    <div className="d-flex align-items-center px-3 py-2 bg-body-secondary position-sticky top-0 z-1">
                        <IconifyIcon icon="solar:pin-bold-duotone" className="fs-18 text-muted" />
                        <h5 className="mb-0 ms-1 fw-semibold fs-14">Pinned</h5>
                    </div>
                    {users?.map((item, idx) => (
                        <Fragment key={idx}>
                            <Link href="" className="text-body d-block">
                                <div
                                    className={`chat-users ${selectedUser?.id === item.id && 'active'}`}
                                    onClick={() => {
                                        onUserSelect(item);
                                    }}
                                >
                                    <div className="avatar-md chat-avatar-offline">
                                        {item.image && <img src={item.image} className="img-fluid rounded-circle" alt="Brandon Smith" />}
                                        {!item.image &&
                                            (item.icon ? (
                                                <div
                                                    className={`h-100 w-100 rounded-circle bg-${item.iconColor} text-white d-flex align-items-center justify-content-center`}
                                                >
                                                    <IconifyIcon icon={item.icon} className="fs-20" />
                                                </div>
                                            ) : (
                                                <div className="h-100 w-100 rounded-circle bg-info text-white d-flex align-items-center justify-content-center">
                                                    <span className="fw-semibold">{getFirstTwoLetters(item.name)}</span>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="mt-0 mb-0 fs-13">
                                            <span className="float-end text-muted fs-12">
                                                {item.date.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {item.name}
                                        </h5>
                                        <p className="mt-1 mb-0 text-muted lh-1">
                                            {item.unRead && (
                                                <span className="w-25 float-end text-end">
                                                    <span className="badge bg-danger-subtle text-danger">{item.unRead}</span>
                                                </span>
                                            )}
                                            {!item.unRead &&
                                                (item.isSend ? (
                                                    <span className="w-25 text-end float-end text-success">
                                                        <IconifyIcon icon="tabler-checks" />
                                                    </span>
                                                ) : (
                                                    <span className="w-25 text-end float-end text-muted">
                                                        <IconifyIcon icon="tabler-checks" />
                                                    </span>
                                                ))}

                                            {selectedUser?.activeOffline === 'Typing,,,,' && selectedUser.id === item.id ? (
                                                <span className="w-75 d-inline-block text-primary fs-12 fw-semibold">typing...</span>
                                            ) : (
                                                <>
                                                    <span className="w-75 d-inline-block text-truncate overflow-hidden">{item.message}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {item.allMessage && (
                                <div className="d-flex align-items-center px-3 py-2 bg-body-secondary position-sticky top-0 z-1">
                                    <IconifyIcon icon="solar:chat-line-bold-duotone" className="fs-18 text-muted" />
                                    <h5 className="mb-0 ms-1 fw-semibold fs-14">All Messages</h5>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </SimpleBar>
            </div>
        </div>
    );
};

export default Chat;
