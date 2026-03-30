import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import PageTitle from '@/components/PageTitle';
import TestRequestForm from '@/components/_test/TestRequestForm';

const TestRequestCreate = () => {
    return (
        <MainLayout>
            <Head title="Nueva Solicitud de Análisis" />
            <PageTitle
                title="Nueva Solicitud de Análisis"
                subTitle="Registrar solicitud de prueba textil"
            />
            <TestRequestForm />
        </MainLayout>
    );
};

export default TestRequestCreate;
