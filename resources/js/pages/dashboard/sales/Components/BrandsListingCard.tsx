import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getBrandsList } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Link } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

const BrandsListingCard = () => {
    const brandListData = useFetchData(getBrandsList);
    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="header-title">Brands Listing</h4>
                <Button variant="light" size="sm">
                    Add Brand <IconifyIcon icon="tabler:plus" className="ms-1" />
                </Button>
            </CardHeader>
            <CardBody className="p-0">
                <div className="bg-light bg-opacity-50 py-1 text-center">
                    <p className="m-0">
                        <b>69</b> Active brands out of <span className="fw-medium">102</span>
                    </p>
                </div>
                <div className="table-responsive">
                    <table className="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
                        <tbody>
                            {brandListData?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-md flex-shrink-0 me-2">
                                                <span className="avatar-title bg-primary-subtle rounded-circle">
                                                    <img src={item.image} alt="products-Img" height={22} />
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted fs-12">{item.category}</span> <br />
                                                <h5 className="fs-14 mt-1">{item.name}</h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-muted fs-12">Established</span>
                                        <h5 className="fs-14 mt-1 fw-normal">Since {item.since}</h5>
                                    </td>
                                    <td>
                                        <span className="text-muted fs-12">Stores</span> <br />
                                        <h5 className="fs-14 mt-1 fw-normal">{item.Stores}</h5>
                                    </td>
                                    <td>
                                        <span className="text-muted fs-12">Products</span>
                                        <h5 className="fs-14 mt-1 fw-normal">{item.products}</h5>
                                    </td>
                                    <td>
                                        <span className="text-muted fs-12">Status</span>
                                        <h5 className="fs-14 mt-1 fw-normal">
                                            <IconifyIcon icon="tabler:circle-filled" className="fs-12 text-success" /> Active
                                        </h5>
                                    </td>
                                    <td style={{ width: 30 }}>
                                        <Dropdown>
                                            <DropdownToggle
                                                as={'a'}
                                                className="text-muted drop-arrow-none card-drop p-0"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <IconifyIcon icon="tabler:dots-vertical" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem>Refresh Report</DropdownItem>
                                                <DropdownItem>Export Report</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
            <CardFooter>
                <div className="align-items-center justify-content-between row text-center text-sm-start">
                    <div className="col-sm">
                        <div className="text-muted">
                            Showing <span className="fw-semibold">5</span> of <span className="fw-semibold">15</span> Results
                        </div>
                    </div>
                    <Col sm={'auto'} className="mt-3 mt-sm-0">
                        <ul className="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
                            <li className="page-item disabled">
                                <Link href="" className="page-link">
                                    <IconifyIcon icon="tabler:chevron-left" />
                                </Link>
                            </li>
                            <li className="page-item active">
                                <Link href="" className="page-link">
                                    1
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link href="" className="page-link">
                                    2
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link href="" className="page-link">
                                    3
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link href="" className="page-link">
                                    <IconifyIcon icon="tabler:chevron-right" />
                                </Link>
                            </li>
                        </ul>
                    </Col>
                </div>
            </CardFooter>
        </Card>
    );
};

export default BrandsListingCard;
