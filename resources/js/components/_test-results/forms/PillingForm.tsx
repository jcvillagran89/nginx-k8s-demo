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
  type: 'select' | 'number';
};

type TableFieldId = 'initial' | 'spec1' | 'spec2' | 'spec3' | 'average' | 'observations';

const GRADE_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'tolerancia_grado',
    label: 'Tolerancia (Grado)',
    candidates: ['tolerancia (grado)', 'tolerancia grado', 'tolerancia_grado', 'tolerancia'],
    type: 'select',
  },
  {
    id: 'acondicionamiento_temperatura',
    label: 'Acondicionamiento Temperatura ºC',
    candidates: [
      'acondicionamiento temperatura',
      'acondicionamiento en temperatura',
      'acondicionamiento_temperatura',
      'temperatura',
    ],
    type: 'number',
  },
  {
    id: 'acondicionamiento_humedad_relativa',
    label: 'Acondicionamiento Humedad Relativa %',
    candidates: [
      'acondicionamiento humedad relativa',
      'acondicionamiento en humedad relativa',
      'acondicionamiento_humedad_relativa',
      'humedad relativa',
    ],
    type: 'number',
  },
];

const TABLE_FIELD_DEFINITIONS: Array<{ id: TableFieldId; candidates: string[] }> = [
  { id: 'initial', candidates: ['pilling inicial', 'pilling_inicial'] },
  { id: 'spec1', candidates: ['especimen 1', 'especimen_1', 'especimen 1 (grado)'] },
  { id: 'spec2', candidates: ['especimen 2', 'especimen_2', 'especimen 2 (grado)'] },
  { id: 'spec3', candidates: ['especimen 3', 'especimen_3', 'especimen 3 (grado)'] },
  { id: 'average', candidates: ['promedio', 'pilling promedio', 'pilling_promedio'] },
  { id: 'observations', candidates: ['observaciones', 'observacion', 'observations'] },
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

const parseGrade = (value: string) => {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const roundToHalf = (value: number) => Math.round(value * 2) / 2;

const formatGrade = (value: number) =>
  value % 1 === 0 ? String(value.toFixed(0)) : value.toFixed(1);

const PillingForm: React.FC<SectionFormProps> = ({
  testId,
  sectionName,
  sectionData,
  readOnly,
}) => {
  const config = SECTION_CONFIG[sectionName as SectionKey];
  const safeSection = (sectionData || {}) as SectionData;
  const isReadOnly = Boolean(readOnly);

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
    const map: Partial<Record<TableFieldId, { key: string; field: Field }>> = {};

    TABLE_FIELD_DEFINITIONS.forEach((definition) => {
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

  const initialKey = tableFields.initial?.key;
  const spec1Key = tableFields.spec1?.key;
  const spec2Key = tableFields.spec2?.key;
  const spec3Key = tableFields.spec3?.key;
  const averageKey = tableFields.average?.key;
  const observationsKey = tableFields.observations?.key;

  const averageValue = useMemo(() => {
    const values = [spec1Key, spec2Key, spec3Key]
      .map((key) => (key ? parseGrade(data.fields[key] ?? '') : null))
      .filter((value): value is number => value !== null);

    if (!values.length) return null;
    const sum = values.reduce((acc, current) => acc + current, 0);
    return roundToHalf(sum / values.length);
  }, [data.fields, spec1Key, spec2Key, spec3Key]);

  const averageValueString = averageValue === null ? '' : formatGrade(averageValue);

  useEffect(() => {
    if (!averageKey) return;
    if ((data.fields[averageKey] ?? '') === averageValueString) return;
    setData('fields', {
      ...data.fields,
      [averageKey]: averageValueString,
    });
  }, [averageKey, averageValueString, data.fields, setData]);

  const renderGradeField = (fieldKey?: string) => {
    if (!fieldKey) return <span className="text-muted">--</span>;

    return (
      <>
        <Form.Select
          value={data.fields[fieldKey] ?? ''}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          isInvalid={!!errors[`fields.${fieldKey}`]}
          disabled={isReadOnly}
          size="sm"
        >
          <option value="">Selecciona...</option>
          {GRADE_OPTIONS.map((option) => (
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

  const renderTextareaField = (fieldKey?: string) => {
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
          size="sm"
        />
        {errors[`fields.${fieldKey}`] && (
          <Form.Control.Feedback type="invalid">
            {errors[`fields.${fieldKey}`]}
          </Form.Control.Feedback>
        )}
      </>
    );
  };

  const renderAverageCell = () => {
    if (!averageValueString) return <span className="text-muted">--</span>;

    return (
      <Form.Control type="text" value={averageValueString} size="sm" disabled />
    );
  };

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

  const photoInputId = `${sectionName}-camera`;

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={isReadOnly ? (e) => e.preventDefault() : handleSubmit}>
          {headerFields.length > 0 && (
            <div className="mb-4">
              <Row className="g-3">
                {headerFields.map(({ definition, key, field }) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={key}>
                    <Form.Group controlId={`${sectionName}-${key}`}>
                      <Form.Label className="small">
                        {field.display_name || definition.label}
                      </Form.Label>
                      {definition.type === 'select' ? (
                        <Form.Select
                          value={data.fields[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          isInvalid={!!errors[`fields.${key}`]}
                          disabled={isReadOnly}
                        >
                          <option value="">Selecciona...</option>
                          {GRADE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type="number"
                          step="any"
                          value={data.fields[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          isInvalid={!!errors[`fields.${key}`]}
                          disabled={isReadOnly}
                        />
                      )}
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

          <div className="table-responsive">
            <Table bordered className="align-middle text-center table-sm table-tight">
              <thead>
                <tr>
                  <th>Pilling inicial</th>
                  <th>Espécimen 1</th>
                  <th>Espécimen 2</th>
                  <th>Espécimen 3</th>
                  <th>Promedio</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{renderGradeField(initialKey)}</td>
                  <td>{renderGradeField(spec1Key)}</td>
                  <td>{renderGradeField(spec2Key)}</td>
                  <td>{renderGradeField(spec3Key)}</td>
                  <td>{renderAverageCell()}</td>
                  <td>{renderTextareaField(observationsKey)}</td>
                </tr>
              </tbody>
            </Table>
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

export default PillingForm;
