// resources/js/Pages/test-results/section-form.tsx
import React from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import GenericSectionForm from '@/components/_test-results/forms/GenericSectionForm';
import EstabilidadEnTelaForm from '@/components/_test-results/forms/EstabilidadEnTelaForm';
import EstabilidadEnPrendaForm from '@/components/_test-results/forms/EstabilidadEnPrendaForm';
import AATCC207Form from '@/components/_test-results/forms/AATCC207Form';
import AATCC179Form from '@/components/_test-results/forms/AATCC179Form';
import ASTMD2261Form from '@/components/_test-results/forms/ASTMD2261Form';
import ASTMD5034Form from '@/components/_test-results/forms/ASTMD5034Form';
import PesoForm from '@/components/_test-results/forms/PesoForm';
import FroteForm from '@/components/_test-results/forms/FroteForm';
import PillingForm from '@/components/_test-results/forms/PillingForm';
import LavadoForm from '@/components/_test-results/forms/LavadoForm';
import AparienciaForm from '@/components/_test-results/forms/AparienciaForm';
import DensityForm from '@/components/_test-results/forms/DensityForm';
import type { SectionFormProps } from '@/components/_test-results/forms/types';
import { SectionKey } from '@/components/_test-results/sectionConfig';
import { Button } from 'react-bootstrap';

type PageProps = {
  test: {
    id: number;
    number?: string;
    item?: string;
    notes?: string;
    wash_type?: string | null;
    requested_by?: string;
  };
  sectionName: SectionKey;
  sectionData: any;
};

const SectionFormPage: React.FC = () => {
  const { test, sectionName, sectionData } = usePage<PageProps>().props;
  const normalizedSectionName =
    typeof sectionName === 'string' ? sectionName.trim() : sectionName;
  const formRegistry: Partial<Record<SectionKey, React.ComponentType<SectionFormProps>>> = {
    'ESTABILIDAD EN TELA': EstabilidadEnTelaForm,
    'ESTABILIDAD EN PRENDA': EstabilidadEnPrendaForm,
    PESO: PesoForm,
    FROTE: FroteForm,
    PILLING: PillingForm,
    SOLIDEZ: LavadoForm,
    APARIENCIA: AparienciaForm,
    'TORSION 207': AATCC207Form,
    TORSION: AATCC179Form,
    RASGADO: ASTMD2261Form,
    TRACCION: ASTMD5034Form,
    DENSIDAD: DensityForm,
  };
  const SectionForm = formRegistry[normalizedSectionName as SectionKey] ?? GenericSectionForm;

  return (
    <MainLayout>
      <PageTitle
        title={`Captura de ${normalizedSectionName}`}
        subTitle={`Muestra ${test.number ?? ''}`}
      />

      <div className="mb-3 border-bottom pb-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 text-muted">
            Registra la información de la sección {normalizedSectionName}.
          </p>
        </div>
      </div>
      <SectionForm
        testId={test.id}
        sectionName={normalizedSectionName}
        sectionData={sectionData}
        washType={test.wash_type ?? null}
      />
    </MainLayout>
  );
};

export default SectionFormPage;
