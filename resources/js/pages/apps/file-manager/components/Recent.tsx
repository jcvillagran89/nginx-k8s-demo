import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllFiles } from '@/helpers/data';

import { useFetchData } from '@/hooks/useFetchData';
import avatar1 from '@/images/users/avatar-1.jpg';
import { Link } from '@inertiajs/react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

const Recent = () => {
    const recentData = useFetchData(getAllFiles);

    return (
        <div className="table-responsive">
            <table className="table table-centered table-nowrap border-top mb-0">
                <thead className="bg-light bg-opacity-25">
                    <tr>
                        <th className="ps-3">Name</th>
                        <th>Uploaded By</th>
                        <th>Size</th>
                        <th>Last Update</th>
                        <th>Members</th>
                        <th style={{ width: 80 }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {recentData?.map((item, idx) => (
                        <tr key={idx}>
                            <td className="ps-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className={`flex-shrink-0 avatar-md bg-${item.fileVariant}-subtle d-inline-flex align-items-center justify-content-center rounded-2`}
                                    >
                                        <IconifyIcon icon={item.icon} className={`fs-22 text-${item.fileVariant}`} />
                                    </div>
                                    <div>
                                        <span className="fw-semibold">
                                            <Link href="" className="text-reset">
                                                {item.title}
                                            </Link>
                                        </span>
                                        <p className="mb-0 fs-12">{item.file}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div>
                                        <Link href="">
                                            {item.user?.image && <img src={item.user.image} className="rounded-circle avatar-md" alt="friend" />}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="mb-0 text-dark fw-medium">{item.user?.name}</p>
                                        <span className="fs-12">{item.user?.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{item.size} MB</td>
                            <td>{item.date.toLocaleString('en-us', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                            <td id="tooltips-container">
                                <div className="avatar-group flex-nowrap">
                                    {item.members.map((member, idx) => (
                                        <div className="avatar avatar-sm" key={idx}>
                                            <span className={`avatar-title bg-${member.variant} rounded-circle fw-bold`}>{member.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <Dropdown className="flex-shrink-0 text-muted">
                                    <DropdownToggle
                                        as={'a'}
                                        className="drop-arrow-none fs-20 link-reset"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <IconifyIcon icon="tabler:dots-vertical" />
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
                                        <DropdownItem>
                                            <IconifyIcon icon="tabler:trash" className="me-1" /> Delete
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recent;
