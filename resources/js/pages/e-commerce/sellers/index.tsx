import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllSellers } from '@/helpers/data';
import { Link } from '@inertiajs/react';
import { Col, Row } from 'react-bootstrap';
import SellersCard from './components/SellersCard';

import { useFetchData } from '@/hooks/useFetchData';
import MainLayout from '@/layouts/MainLayout';

const SellersPage = () => {
    const SellersData = useFetchData(getAllSellers);
    return (
        <MainLayout>
            <PageTitle title="Sellers" subTitle="eCommerce" />
            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
                {SellersData?.map((item, idx) => (
                    <Col xl={4} lg={6} key={idx}>
                        <SellersCard {...item} />
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-end">
                <ul className="pagination justify-content-center">
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
        </MainLayout>
    );
};

export default SellersPage;
