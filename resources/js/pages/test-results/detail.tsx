import React, {useState, useEffect} from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageTitle from '@/components/PageTitle';
import TestResultInfoCard from '@/components/_test-results/TestResultInfoCard';
import TestStatusChips from '@/components/_test-results/TestStatusChips';
import GenericSectionContent from '@/components/_test-results/contents/GenericSectionContent';
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
import DensityForm from '@/components/_test-results/forms/DensityForm';
import AparienciaForm from '@/components/_test-results/forms/AparienciaForm';
import type { SectionFormProps } from '@/components/_test-results/forms/types';
import { SECTION_CONFIG, SectionKey } from '@/components/_test-results/sectionConfig';
import { Button } from 'react-bootstrap';
import { getImageUrl } from '@/utils/image';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const TestResultDetailPage: React.FC = () => {
  const testResult = usePage().props.testResult as any;
  let totalSectionsWithStatus = 0;
  let pendingSections = 0;

  (testResult.results ?? []).forEach((result: any) => {
    const content = result.content ?? {};

    Object.values(content).forEach((section: any) => {
      if (section && typeof section === 'object') {
        if ('status' in section) {
          totalSectionsWithStatus++;

          const statusValue = Number(section.status);
          if (statusValue === 0 || statusValue === 1) {
            pendingSections++;
          }
        }
      }
    });
  });
  const firstResult = testResult.results?.[0];
  const content = firstResult?.content ?? {};

  const sectionEntries = Object.entries(content).map(([key, value]) => ({
    key,
    data: value,
  }));

  const [activeSection, setActiveSection] = useState(
    sectionEntries[0]?.key ?? ''
  );
  const [activeSectionData, setActiveSectionData] = useState<any>(
    sectionEntries[0]?.data ?? null
  );
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
  useEffect(() => {
    const result = testResult.results?.[0];
    const freshContent = result?.content ?? {};
    const freshSectionData = freshContent[activeSection];

    if (freshSectionData) {
      setActiveSectionData(freshSectionData);
    }
  }, [testResult, activeSection]);

  const adapted = {
    folio: testResult.test_request?.number ?? '',
    estilo: testResult.test_request?.style_id ?? '',
    sku: testResult.test_request?.item ?? '',
    notes: testResult.test_request?.notes ?? '',
    solicitado: testResult.test_request?.user?.name ?? '',
    fechaIngreso: formatDate(testResult.created_at),
    fechaSalida: formatDate(testResult.finished_at),
    pruebasPendientes: totalSectionsWithStatus
      ? `${pendingSections}/${totalSectionsWithStatus}`
      : '--',
    image: getImageUrl(testResult.test_request?.image_id) ?? testResult.test_request?.image ?? '',
  };

  const normalizedSectionName =
    typeof activeSection === 'string' ? activeSection.trim() : activeSection;
  const PreviewForm = formRegistry[normalizedSectionName as SectionKey];
  const sectionConfig = SECTION_CONFIG[normalizedSectionName as SectionKey];
  const sectionStatus = Number(activeSectionData?.status ?? 0);
  const showPreviewForm =
    Boolean(PreviewForm) && Boolean(sectionConfig) && sectionStatus > 0;

  const handleFinishSection = () => {
    if (!sectionConfig) return;
    router.post(
      route('test-results.section.finish', {
        test: testResult.id,
        section: sectionConfig.routeSection,
      }),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const handleGoToForm = () => {
    if (!sectionConfig) return;
    router.get(
      route('test-results.section.start', {
        test: testResult.id,
        section: sectionConfig.routeSection,
      }),
    );
  };

  return (
    <MainLayout>
      <PageTitle
        title={`Análisis de Muestra - ${adapted.folio}`}
        subTitle="Análisis"
      />

      {/* Header */}
      <div className="mb-3 border-bottom pb-3">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 text-muted">
            Registra los resultados de las pruebas de laboratorio
          </p>
          <Link href={route('test-results')}>
            <Button variant="soft-secondary">
                <IconifyIcon icon="tabler:arrow-left" className="me-1" /> Regresar
            </Button>
           </Link>
        </div>
      </div>

      {/* Datos generales */}
      <div className="mt-3">
        <TestResultInfoCard data={adapted} />
        <TestStatusChips
          results={testResult.results ?? []}
          activeKey={activeSection}
          onChange={(key, sectionData) => {
            setActiveSection(key);
            setActiveSectionData(sectionData);
          }}
        />
        {/* Secciones de las tabs */}
        <div className="mt-4">
          {activeSection && (
            showPreviewForm && PreviewForm ? (
              <>
                <div className="d-flex justify-content-end align-items-center mb-3 flex-wrap gap-2">
                  {sectionStatus === 1 && (
                    <button
                      type="button"
                      onClick={handleFinishSection}
                      className="btn btn-success rounded-pill px-3"
                    >
                      Terminar test
                    </button>
                  )}

                  {sectionStatus !== 2 && (
                    <button
                      type="button"
                      onClick={handleGoToForm}
                      className="btn btn-outline-dark rounded-pill px-3"
                    >
                      {sectionConfig.editButtonLabel}
                    </button>
                  )}
                </div>
                <PreviewForm
                  testId={testResult.id}
                  sectionName={normalizedSectionName}
                  sectionData={activeSectionData}
                  washType={testResult.test_request?.wash_type ?? null}
                  readOnly
                />
              </>
            ) : (
              <GenericSectionContent
                sectionName={activeSection as SectionKey}
                testId={testResult.id}
                data={activeSectionData}
              />
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TestResultDetailPage;
