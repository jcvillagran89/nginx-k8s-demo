import React, { useEffect, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import CameraCapture from '@/components/_test-results/CameraCapture';
import SectionImageGrid from '@/components/_test-results/SectionImageGrid';
import { SECTION_CONFIG, SectionKey } from '@/components/_test-results/sectionConfig';
import type { SectionFormProps } from '@/components/_test-results/forms/types';

type Field = {
  label: string;
  display_name: string;
  value: string | null;
};

type SectionData = {
  [key: string]: Field | any;
};

type SavedImage = {
  id?: number | string;
  url?: string;
  path?: string;
  uploaded_at?: string;
};

type FormDataType = {
  fields: Record<string, string>;
  images: File[];
  deleted_images: string[];
};

type HeaderFieldDefinition = {
  id: string;
  label: string;
  candidates: string[];
};

type ColumnType = 'select' | 'textarea';

type ColumnDefinition = {
  id: string;
  label: string;
  candidates: string[];
  type: ColumnType;
  options?: string[];
};

const GRADE_OPTIONS = ['5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'];
const GRADE_OPTIONS_WITH_NA = ['No aplica', ...GRADE_OPTIONS];
const PRESENT_OPTIONS = ['Presenta', 'No presenta'];
const PRESENT_OPTIONS_WITH_NA = ['Presenta', 'No presenta', 'No aplica'];
const LEGIBILIDAD_OPTIONS = ['Legible', 'Parcialmente legible', 'Ilegible', 'No aplica'];

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'humedad_relativa',
    label: 'Humedad relativa (%)',
    candidates: ['humedad relativa (%)', 'humedad relativa %', 'humedad_relativa'],
  },
  {
    id: 'temperatura',
    label: 'Temperatura (ºC)',
    candidates: [
      'temperatura (ºc)',
      'temperatura (°c)',
      'temperatura ºc',
      'temperatura °c',
      'temperatura',
    ],
  },
   {
    id: 'tolerancea',
    label: 'Tolerancia',
    candidates: ['tolerance', 'tolerancia'],
  },
];

const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  {
    id: 'antes_color_tela_principal',
    label: 'Antes de lavar cambio de color tela principal',
    candidates: ['antes de lavar cambio de color tela principal', 'cambio de color tela principal'],
    type: 'select',
    options: GRADE_OPTIONS,
  },
  {
    id: 'despues_color_tela_principal',
    label: 'Después de lavar cambio de color tela principal',
    candidates: ['después de lavar cambio de color tela principal', 'despues de lavar cambio de color tela principal'],
    type: 'select',
    options: GRADE_OPTIONS,
  },
  {
    id: 'antes_color_bies',
    label: 'Antes de lavar cambio de color bies/cardigan',
    candidates: ['antes de lavar cambio de color en bies', 'bies/cardigan', 'bies cardigan'],
    type: 'select',
    options: GRADE_OPTIONS_WITH_NA,
  },
  {
    id: 'despues_color_bies',
    label: 'Después de lavar cambio de color bies/cardigan',
    candidates: ['después de lavar cambio de color en bies', 'despues de lavar cambio de color en bies'],
    type: 'select',
    options: GRADE_OPTIONS_WITH_NA,
  },
  {
    id: 'manchas',
    label: 'Manchas',
    candidates: ['manchas'],
    type: 'select',
    options: PRESENT_OPTIONS,
  },
  {
    id: 'cambio_color_estampado',
    label: 'Cambio de color en estampado',
    candidates: ['cambio de color en estampado', 'cambio de color estampado'],
    type: 'select',
    options: GRADE_OPTIONS_WITH_NA,
  },
  {
    id: 'cambios_estampado',
    label: 'Cambios en el estampado',
    candidates: ['cambios en estampado', 'cambios en el estampado', 'cambios en estampado'],
    type: 'textarea',
    options: GRADE_OPTIONS_WITH_NA,
  },
  {
    id: 'transferencia_color',
    label: 'Transferencia de color',
    candidates: ['transferencia de color', 'transferencia color'],
    type: 'select',
    options: GRADE_OPTIONS_WITH_NA,
  },
  {
    id: 'antes_pilling',
    label: 'Antes de lavar pilling',
    candidates: ['antes de lavar pilling', 'pilling inicial'],
    type: 'select',
    options: GRADE_OPTIONS,
  },
  {
    id: 'despues_pilling',
    label: 'Después de lavar pilling',
    candidates: ['después de lavar pilling', 'despues de lavar pilling', 'pilling grado'],
    type: 'select',
    options: GRADE_OPTIONS,
  },
  {
    id: 'suavidad',
    label: 'Suavidad',
    candidates: ['suavidad'],
    type: 'select',
    options: PRESENT_OPTIONS,
  },
  {
    id: 'rompimiento_costura',
    label: 'Rompimiento de la costura',
    candidates: ['rompimiento de la costura', 'rompimiento costura'],
    type: 'select',
    options: PRESENT_OPTIONS,
  },
  {
    id: 'danos_componentes',
    label: 'Daños/solturas de componentes',
    candidates: ['daños y solturas de componentes', 'daños de componentes', 'danos y solturas', 'danos componentes'],
    type: 'select',
    options: PRESENT_OPTIONS_WITH_NA,
  },
  {
    id: 'desprendimiento_componentes',
    label: 'Desprendimiento de componentes',
    candidates: ['desprendimiento de componentes', 'desprendimiento componentes'],
    type: 'select',
    options: PRESENT_OPTIONS_WITH_NA,
  },
  {
    id: 'legibilidad_etiqueta',
    label: 'Legibilidad de la etiqueta',
    candidates: ['legibilidad de la etiqueta', 'legibilidad etiqueta'],
    type: 'select',
    options: LEGIBILIDAD_OPTIONS,
  },
  {
    id: 'observaciones',
    label: 'Observaciones',
    candidates: ['observaciones', 'observacion', 'otros'],
    type: 'textarea',
  },
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const matchesCandidate = (value: string, candidates: string[]) => {
  const normalized = normalize(value);
  return candidates.some((candidate) => normalized.includes(normalize(candidate)));
};

const AparienciaForm: React.FC<SectionFormProps> = ({
  testId,
  sectionName,
  sectionData,
  washType,
  readOnly,
}) => {
  const config = SECTION_CONFIG[sectionName as SectionKey];
  const safeSection = (sectionData || {}) as SectionData;
  const isReadOnly = Boolean(readOnly);

  const fieldEntries = useMemo(
    () =>
      Object.entries(safeSection).filter(([key, value]) => {
        if (['img', 'status', 'user_id', 'user_name'].includes(key)) return false;
        return value && typeof value === 'object' && 'display_name' in value;
      }),
    [safeSection],
  );

  const headerFields = useMemo(() => {
    return HEADER_FIELD_DEFINITIONS.map((definition) => {
      const match = fieldEntries.find(([_, field]) => {
        const typedField = field as Field;
        const displayName = typedField.display_name || '';
        const label = typedField.label || '';
        return (
          matchesCandidate(displayName, definition.candidates) ||
          matchesCandidate(label, definition.candidates)
        );
      });

      if (!match) return null;

      return {
        definition,
        key: match[0],
        field: match[1] as Field,
      };
    }).filter(Boolean) as Array<{ definition: HeaderFieldDefinition; key: string; field: Field }>;
  }, [fieldEntries]);

  const tableFields = useMemo(() => {
    const map: Record<string, { key: string; field: Field } | undefined> = {};

    COLUMN_DEFINITIONS.forEach((definition) => {
      const match = fieldEntries.find(([_, field]) => {
        const typedField = field as Field;
        const displayName = typedField.display_name || '';
        const label = typedField.label || '';
        return (
          matchesCandidate(displayName, definition.candidates) ||
          matchesCandidate(label, definition.candidates)
        );
      });

      if (match) {
        map[definition.id] = { key: match[0], field: match[1] as Field };
      }
    });

    return map;
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((entry) => keys.add(entry.key));
    Object.values(tableFields).forEach((entry) => {
      if (entry?.key) keys.add(entry.key);
    });
    return keys;
  }, [headerFields, tableFields]);

  const initialData = useMemo(() => {
    const seeded: Record<string, string> = {};
    fieldEntries.forEach(([key, field]) => {
      if (!allowedFieldKeys.has(key)) return;
      const f = field as Field;
      seeded[key] = f.value ?? '';
    });
    return seeded;
  }, [fieldEntries, allowedFieldKeys]);

  const { data, setData, post, processing, errors } = useForm<FormDataType>({
    fields: initialData,
    images: [],
    deleted_images: [],
  });

  useEffect(() => {
    setData('fields', initialData);
  }, [initialData, setData]);

  const handleChange = (key: string, value: string) => {
    setData('fields', {
      ...data.fields,
      [key]: value,
    });
  };

  const handleFilesChange = (files: File[]) => {
    setData('images', files);
  };

  const handleDeleteSavedImage = (img: SavedImage) => {
    const identifier = img.id ? String(img.id) : img.path;
    if (!identifier) return;
    if (data.deleted_images.includes(identifier)) return;

    setData('deleted_images', [...data.deleted_images, identifier]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(
      route('test-results.section.update', {
        test: testId,
        section: config.routeSection,
      }),
      {
        forceFormData: true,
      },
    );
  };

  const renderSelectField = (fieldKey: string | undefined, options: string[]) => {
    if (!fieldKey) return <span className="text-muted">--</span>;

    return (
      <>
        <Form.Select
          value={data.fields[fieldKey] ?? ''}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          isInvalid={!!errors[`fields.${fieldKey}`]}
          disabled={isReadOnly}
        >
          <option value="">Selecciona...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
        {errors[`fields.${fieldKey}`] && (
          <Form.Control.Feedback type="invalid">
            {errors[`fields.${fieldKey}`]}
          </Form.Control.Feedback>
        )}
      </>
    );
  };

  const renderTextareaField = (fieldKey: string | undefined) => {
    if (!fieldKey) return <span className="text-muted">--</span>;

    return (
      <>
        <Form.Control
          as="textarea"
          rows={2}
          value={data.fields[fieldKey] ?? ''}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          isInvalid={!!errors[`fields.${fieldKey}`]}
          disabled={isReadOnly}
          className="w-100"
        />
        {errors[`fields.${fieldKey}`] && (
          <Form.Control.Feedback type="invalid">
            {errors[`fields.${fieldKey}`]}
          </Form.Control.Feedback>
        )}
      </>
    );
  };

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

  const photoInputId = `${sectionName}-camera`;

  if (!config) {
    console.error('SECTION_CONFIG no encontrada para sectionName:', sectionName);

    return (
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <h5 className="mb-3">Sección desconocida</h5>
          <p className="text-muted small mb-0">
            No se encontró configuración para la sección: <strong>{String(sectionName)}</strong>.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <style>{`
          .apariencia-grid-scroll {
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .apariencia-grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(2, minmax(150px, max-content));
            width: max-content;
            min-width: 100%;
          }

          .apariencia-grid > .apariencia-field {
            min-width: 150px;
            width: max-content;
          }

          .apariencia-grid .apariencia-label {
            width: 150px;
            max-width: 150px;
            margin: 0 auto 8px;
            white-space: normal;
            word-break: break-word;
            text-align: center;
          }

          .apariencia-grid select {
            min-width: 150px;
          }

          @media (min-width: 576px) {
            .apariencia-grid {
              grid-template-columns: repeat(4, minmax(150px, max-content));
            }
          }

          @media (min-width: 768px) {
            .apariencia-grid {
              grid-template-columns: repeat(6, minmax(150px, max-content));
            }
          }

          @media (min-width: 992px) {
            .apariencia-grid {
              grid-template-columns: repeat(8, minmax(150px, max-content));
            }
          }
        `}</style>
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={isReadOnly ? (e) => e.preventDefault() : handleSubmit}>
          <div className="mb-4">
            <Row className="g-3">
              <Col xs={12} sm={6} md={4}>
                <Form.Group controlId={`${sectionName}-wash-type`}>
                  <Form.Label className="small">Tipo de lavado (informativo)</Form.Label>
                  <Form.Control value={washType ?? '—'} readOnly />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {headerFields.length > 0 && (
            <div className="mb-4">
              <Row className="g-3">
                {headerFields.map(({ definition, key, field }) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={key}>
                    <Form.Group controlId={`${sectionName}-${key}`}>
                      <Form.Label className="small">
                        {field.display_name || definition.label}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        value={data.fields[key] ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        isInvalid={!!errors[`fields.${key}`]}
                        disabled={isReadOnly}
                      />
                      {errors[`fields.${key}`] && (
                        <Form.Control.Feedback type="invalid">
                          {errors[`fields.${key}`]}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          <div className="apariencia-grid-scroll">
            <div className="apariencia-grid">
              {COLUMN_DEFINITIONS.map((column) => {
                const fieldKey = tableFields[column.id]?.key;
                return (
                <div
                  key={column.id}
                  className="apariencia-field border rounded-3 p-2 h-100"
                >
                    <div className="apariencia-label small fw-semibold">
                      {column.label}
                    </div>
                    {column.type === 'textarea'
                      ? renderTextareaField(fieldKey)
                      : renderSelectField(fieldKey, column.options ?? [])}
                  </div>
                );
              })}
            </div>
          </div>

          {config.allowImages && (
            <>
              <hr className="my-4" />
              <h6 className="mb-2">Evidencia fotográfica</h6>
              <p className="text-muted small">{imageHelperText}</p>

              {isReadOnly ? (
                <SectionImageGrid
                  images={safeSection.img ?? []}
                  emptyMessage="Sin evidencia fotográfica cargada."
                />
              ) : (
                <CameraCapture
                  inputId={photoInputId}
                  multiple={true}
                  helperText="Toca el botón para abrir la cámara o seleccionar fotos desde tu dispositivo."
                  error={errors.images as string | null}
                  initialImages={safeSection.img ?? []}
                  onFilesChange={handleFilesChange}
                  onDeleteSavedImage={handleDeleteSavedImage}
                />
              )}
            </>
          )}

          {!isReadOnly && (
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                className="rounded-pill"
                onClick={() => history.back()}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="dark"
                className="rounded-pill px-4"
                disabled={processing}
              >
                {processing ? 'Guardando...' : `Guardar ${config.routeSection}`}
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AparienciaForm;
