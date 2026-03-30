import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getProducts } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';

const ProductsPage = () => {
    const productsData = useFetchData(getProducts);
    return (
        <MainLayout>
            <PageTitle title="Products" subTitle="eCommerce" />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="border-bottom border-light">
                            <div className="d-flex flex-wrap justify-content-between gap-2">
                                <div className="position-relative">
                                    <input type="text" className="form-control ps-4" placeholder="Search Company" />
                                    <IconifyIcon icon="tabler:search" className="position-absolute top-50 translate-middle-y ms-2" />
                                </div>
                                <div>
                                    <Link href="/e-commerce/add-products" className="btn btn-primary">
                                        <IconifyIcon icon="tabler:plus" className="me-1" />
                                        Add Products
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="table-responsive">
                            <table className="table table-hover text-nowrap mb-0">
                                <thead className="bg-light-subtle">
                                    <tr>
                                        <th className="ps-3" style={{ width: 50 }}>
                                            <input type="checkbox" className="form-check-input" id="customCheck1" />
                                        </th>
                                        <th>Product ID</th>
                                        <th>Name</th>
                                        <th>Description </th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th className="text-center" style={{ width: 120 }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsData?.map((product, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-3">
                                                <input type="checkbox" className="form-check-input" id="customCheck2" />
                                            </td>
                                            <td>PRD00{product.id}</td>
                                            <td>
                                                <div className="d-flex justify-content-start align-items-center gap-3">
                                                    <div className="avatar-md">
                                                        <img src={product.image} alt="Product-1" className="img-fluid rounded-2" />
                                                    </div>
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td>{product.description}</td>
                                            <td>${product.price}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${product.status == 'Inactive' ? 'danger' : 'success'}-subtle text-${product.status == 'Inactive' ? 'danger' : 'success'} fs-12 p-1`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="pe-3">
                                                <div className="hstack gap-1 justify-content-end">
                                                    <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:eye" />
                                                    </Button>
                                                    <Button variant="soft-success" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:edit" className="fs-16" />{' '}
                                                    </Button>
                                                    <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle">
                                                        {' '}
                                                        <IconifyIcon icon="tabler:trash" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <CardFooter>
                            <div className="d-flex justify-content-end">
                                <ul className="pagination justify-content-center mb-0">
                                    <li className="page-item disabled">
                                        <Link href="" className="page-link">
                                            <IconifyIcon icon="tabler:chevrons-left" />
                                        </Link>
                                    </li>
                                    <li className="page-item">
                                        <Link href="" className="page-link">
                                            1
                                        </Link>
                                    </li>
                                    <li className="page-item active">
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
                                            <IconifyIcon icon="tabler:chevrons-right" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default ProductsPage;
