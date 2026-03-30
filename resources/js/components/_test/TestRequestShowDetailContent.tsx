import React, { useEffect, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
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
import AparienciaForm from '@/components/_test-results/forms/AparienciaForm';
import DensityForm from '@/components/_test-results/forms/DensityForm';
import type { SectionFormProps } from '@/components/_test-results/forms/types';
import { SECTION_CONFIG, SectionKey } from '@/components/_test-results/sectionConfig';

interface TestResultContentProps {
  result: any;
}

const TestRequestShowDetailContent: React.FC<TestResultContentProps> = ({ result }) => {
  const content = useMemo(() => {
    if (!result?.content) return {};
    if (typeof result.content === 'string') {
      try {
        return JSON.parse(result.content);
      } catch (error) {
        console.warn('No se pudo parsear el contenido del resultado', error);
        return {};
      }
    }
    return result.content;
  }, [result]);

  const sectionEntries = useMemo(
    () =>
      Object.entries(content)
        .filter(([key]) => key !== 'img')
        .map(([key, value]) => ({
          key,
          data: value,
        })),
    [content],
  );

  const [activeSection, setActiveSection] = useState(
    sectionEntries[0]?.key ?? '',
  );
  const [activeSectionData, setActiveSectionData] = useState<any>(
    sectionEntries[0]?.data ?? null,
  );

  useEffect(() => {
    if (!sectionEntries.length) {
      setActiveSection('');
      setActiveSectionData(null);
      return;
    }

    if (!activeSection || !content[activeSection]) {
      setActiveSection(sectionEntries[0].key);
      setActiveSectionData(sectionEntries[0].data ?? null);
      return;
    }

    const freshSectionData = content[activeSection];
    if (freshSectionData) {
      setActiveSectionData(freshSectionData);
    }
  }, [content, sectionEntries, activeSection]);

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

  const normalizedResult = useMemo(
    () => ({ ...result, content }),
    [result, content],
  );

  if (!sectionEntries.length) {
    return <div className="text-muted">Sin contenido disponible.</div>;
  }

  const normalizedSectionName =
    typeof activeSection === 'string' ? activeSection.trim() : activeSection;
  const PreviewForm = formRegistry[normalizedSectionName as SectionKey];
  const sectionConfig = SECTION_CONFIG[normalizedSectionName as SectionKey];
  const sectionStatus = Number(activeSectionData?.status ?? 0);
  const showPreviewForm =
    Boolean(PreviewForm) && Boolean(sectionConfig) && sectionStatus > 0;

  return (
    <Card className="border rounded-4">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="text-uppercase text-muted" style={{ fontSize: 12, letterSpacing: 0.4 }}>
              Resultado
            </div>
            <div className="fw-semibold">#{result?.id ?? '--'}</div>
          </div>
        </div>

        <TestStatusChips
          results={[normalizedResult]}
          activeKey={activeSection}
          onChange={(key, sectionData) => {
            setActiveSection(key);
            setActiveSectionData(sectionData);
          }}
        />

        <div className="mt-3">
          {activeSection &&
            (showPreviewForm && PreviewForm ? (
              <PreviewForm
                testId={result?.id}
                sectionName={normalizedSectionName}
                sectionData={activeSectionData}
                washType={result?.test_request?.wash_type ?? result?.testRequest?.wash_type ?? null}
                readOnly
              />
            ) : (
              <GenericSectionContent
                sectionName={normalizedSectionName as SectionKey}
                testId={result?.id}
                data={activeSectionData}
                readOnly
              />
            ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TestRequestShowDetailContent;
