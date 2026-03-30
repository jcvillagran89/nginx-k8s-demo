import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import { Card } from 'react-bootstrap';
import EmailArea from './components/EmailArea';

const EmailPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Inbox" />
            <Card>
                <div className="d-flex">
                    <EmailArea />
                </div>
            </Card>
        </MainLayout>
    );
};

export default EmailPage;
