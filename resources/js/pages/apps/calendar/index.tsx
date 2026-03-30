import PageTitle from '@/components/PageTitle';

import MainLayout from '@/layouts/MainLayout';
import { Row } from 'react-bootstrap';
import CalendarPage from './components/CalendarPage';

const Schedule = () => {
    return (
        <MainLayout>
            <PageTitle title="Calendar" />
            <Row>
                <CalendarPage />
            </Row>
        </MainLayout>
    );
};

export default Schedule;
