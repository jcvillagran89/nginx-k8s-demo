import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import { Col, Row } from 'react-bootstrap';
import CheckUpFileCard from './components/CheckUpFileCard';
import MedicalHistoryCard from './components/MedicalHistoryCard';
import PatientDiet from './components/PatientDiet';
import PatientInformationCard from './components/PatientInformationCard';
import PatientProfile from './components/PatientProfileCard';
import TreatmentHistoryCard from './components/TreatmentHistoryCard';
import WaterChart from './components/WaterChart';

const PatientsDetailsPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Patient Details" subTitle="Hospital" />
            <Row>
                <Col xl={4} lg={12}>
                    <PatientProfile />
                    <CheckUpFileCard />
                    <WaterChart />
                </Col>
                <Col xl={8} lg={12}>
                    <PatientInformationCard />
                    <MedicalHistoryCard />
                    <PatientDiet />
                    <TreatmentHistoryCard />
                </Col>
            </Row>
        </MainLayout>
    );
};

export default PatientsDetailsPage;
