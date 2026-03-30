import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Col, Row } from 'react-bootstrap';
import CategoryMenu from './components/CategoryMenu';
import Products from './components/Products';
import Stat from './components/Stat';

const ProductsGridPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Products Grid" subTitle="eCommerce" />
            <Row>
                <CategoryMenu />
                <Col xxl={9}>
                    <Stat />
                    <Products />
                    <Row className="mb-4 align-items-center">
                        <div className="col-sm">
                            <div className="text-muted">
                                Showing <span className="fw-semibold">10</span> of <span className="fw-semibold">35</span> Results
                            </div>
                        </div>
                        <Col sm={'auto'} className="mt-3 mt-sm-0">
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className="page-item disabled">
                                        <Link className="page-link" href="" tabIndex={-1} aria-disabled="true">
                                            Previous
                                        </Link>
                                    </li>
                                    <li className="page-item">
                                        <Link className="page-link" href="">
                                            1
                                        </Link>
                                    </li>
                                    <li className="page-item active" aria-current="page">
                                        <Link className="page-link" href="">
                                            2
                                        </Link>
                                    </li>
                                    <li className="page-item">
                                        <Link className="page-link" href="">
                                            3
                                        </Link>
                                    </li>
                                    <li className="page-item">
                                        <Link className="page-link" href="">
                                            Next
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default ProductsGridPage;
