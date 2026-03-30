import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import mastercardImg from '@/images/cards/mastercard.svg';
import visaImg from '@/images/cards/visa.svg';

import MainLayout from '@/layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Col, Row } from 'react-bootstrap';
import InvoicesCard from './components/InvoicesCard';
import InvoicesStat from './components/InvoicesStat';

const InvoicesPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Invoices" subTitle="Invoice" />
            <InvoicesStat />
            <div className="d-flex flex-wrap flex-lg-nowrap align-items-center gap-2 mb-3">
                <div className="d-inline-flex align-items-center gap-2 me-auto">
                    <h5 className="mb-0 fs-14 text-muted">Last Updated a minute ago</h5>
                    <Link href="">
                        <IconifyIcon icon="tabler:refresh" className="align-middle fs-16" />
                    </Link>
                </div>
                <div className="d-inline-flex flex-wrap align-items-center gap-1">
                    <Link href="">
                        <img src={mastercardImg} alt="master card img" height={24} />
                    </Link>
                    <Link href="">
                        <img src={visaImg} alt="vis card img" height={24} />
                    </Link>
                    <p className="mb-0">
                        Invoice get paid 3x faster with online payments,{' '}
                        <Link href="" className="fw-medium">
                            Turn On Payments
                        </Link>
                    </p>
                </div>
            </div>
            <Row>
                <Col xs={12}>
                    <InvoicesCard />
                </Col>
            </Row>
        </MainLayout>
    );
};

export default InvoicesPage;
