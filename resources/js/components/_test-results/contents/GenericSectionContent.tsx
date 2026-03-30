import React from 'react';
import { router } from '@inertiajs/react';
import { SECTION_CONFIG, SectionKey } from '@/components/_test-results/sectionConfig';
import SectionImageGrid from '@/components/_test-results/SectionImageGrid';

type Props = {
  sectionName: SectionKey;
  testId: number;
  data: any;
  readOnly?: boolean;
};

const GenericSectionContent: React.FC<Props> = ({
  sectionName,
  testId,
  data = {},
  readOnly,
}) => {
  const config = SECTION_CONFIG[sectionName];
  const status = Number(data?.status ?? 0);
  const isReadOnly = Boolean(readOnly);

  const startSection = () => {
    if (isReadOnly) return;
    router.get(
      route('test-results.section.start', {
        test: testId,
        section: config.routeSection,
      }),
    );
  };

  const finishSection = () => {
    if (isReadOnly) return;
    router.post(
      route('test-results.section.finish', {
        test: testId,
        section: config.routeSection,
      }),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const goToForm = () => {
    if (isReadOnly) return;
    router.get(
      route('test-results.section.start', {
        test: testId,
        section: config.routeSection,
      }),
    );
  };

  if (status === 0) {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{config.title}</h5>

          {!isReadOnly && (
            <button
              type="button"
              className="btn btn-dark rounded-pill d-flex align-items-center gap-2 px-3"
              onClick={startSection}
            >
              <span className="fw-semibold">+</span>
              {config.startButtonLabel}
            </button>
          )}
        </div>

        <div
          className="alert rounded-4 px-3 py-3 d-flex align-items-center"
          style={{
            background: '#fdf7f2',
            borderColor: '#f4e3d7',
            color: '#b3541e',
          }}
        >
          <i className="bi bi-exclamation-circle me-2" />
          {config.pendingMessage}
        </div>
      </div>
    );
  }

  const entries = Object.entries(data).filter(
    ([key]) => !['img', 'status', 'user_id', 'user_name', 'approved'].includes(key),
  );

  const hasImages = Array.isArray(data.img) && data.img.length > 0;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">{config.title}</h5>

        {!isReadOnly && (
          <div className="d-flex align-items-center gap-2">
            {/* Terminar test SOLO si status === 1 */}
            {status === 1 && (
              <button
                type="button"
                onClick={finishSection}
                className="btn btn-success rounded-pill px-3"
              >
                Terminar test
              </button>
            )}

            {/* Editar mientras no esté cerrado (status !== 2) */}
            {status !== 2 && (
              <button
                type="button"
                onClick={goToForm}
                className="btn btn-outline-dark rounded-pill px-3"
              >
                {config.editButtonLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          {/* Si tiene campos */}
          {entries.length > 0 && (
            <div className="row g-3">
              {entries.map(([key, field]: any) => (
                <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3" key={key}>
                  <div className="fw-semibold">{field?.display_name ?? field?.label ?? key}</div>
                  <div className="fw-bold text-success">
                    {field?.value ?? '--'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Si solo tiene imágenes (caso AATCC61 o similar) */}
          {entries.length === 0 && hasImages && (
            <SectionImageGrid
              images={data.img}
              label="Evidencia fotográfica cargada:"
            />
          )}

          {/* Sin campos ni imágenes */}
          {entries.length === 0 && !hasImages && (
              <div className="text-muted small">
                Sin datos capturados en esta sección.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GenericSectionContent;
