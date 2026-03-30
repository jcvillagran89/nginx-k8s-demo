import React, { useMemo, useState } from 'react';
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
  type: 'number';
};

const MAX_SPECIMENS = 5;

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'humedad_relativa',
    label: 'Humedad Relativa (%)',
    candidates: ['humedad relativa (%)', 'humedad relativa %', 'humedad_relativa'],
    type: 'number',
  },
  {
    id: 'temperatura',
    label: 'Temperatura (°C)',
    candidates: ['temperatura (°c)', 'temperatura °c', 'temperatura (ºc)', 'temperatura_c'],
    type: 'number',
  },
  {
    id: 'tolerancias',
    label: 'Tolerancias',
    candidates: ['tolerancias', 'tolerancia'],
    type: 'number',
  },
];

const UNIT_FIELD_DEFINITION = {
  id: 'unidad_peso',
  label: 'Unidad peso',
  candidates: ['unidad peso', 'unidad de peso', 'unidad_peso', 'unidad_de_peso'],
  options: ['g/m²', 'oz/yd²'],
};

const normalize = (value: string) => value.trim().toLowerCase();

const matchesCandidate = (value: string, candidates: string[]) =>
  candidates.some((candidate) => {
    const needle = normalize(candidate);
    return value === needle || value.includes(needle);
  });

const parseNumber = (value: string) => {
  if (!value) return null;
  const normalized = value.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value: number | null) => {
  if (value === null) return '';
  return value.toFixed(2);
};

const getAverage = (values: Array<number | null>) => {
  const filtered = values.filter((value): value is number => value !== null);
  if (!filtered.length) return null;
  const sum = filtered.reduce((acc, current) => acc + current, 0);
  return sum / filtered.length;
};

const PesoForm: React.FC<SectionFormProps> = ({
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
        const displayName = normalize(typedField.display_name || '');
        const label = normalize(typedField.label || '');
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

  const unitField = useMemo(() => {
    const match = fieldEntries.find(([_, field]) => {
      const typedField = field as Field;
      const displayName = normalize(typedField.display_name || '');
      const label = normalize(typedField.label || '');
      return (
        matchesCandidate(displayName, UNIT_FIELD_DEFINITION.candidates) ||
        matchesCandidate(label, UNIT_FIELD_DEFINITION.candidates)
      );
    });

    if (!match) return null;

    return {
      key: match[0],
      field: match[1] as Field,
    };
  }, [fieldEntries]);

  const specimenEntries = useMemo(() => {
    const entries: Array<{ index: number; key: string; field: Field }> = [];
    const displayRegex = /esp(?:e|é)cimen\s*(\d+)/i;
    const labelRegex = /^especimen_(\d+)$/i;

    fieldEntries.forEach(([key, field]) => {
      const typedField = field as Field;
      const displayMatch = typedField.display_name?.match(displayRegex);
      const labelMatch = typedField.label?.match(labelRegex);
      const index = displayMatch?.[1] ?? labelMatch?.[1];

      if (!index) return;

      const parsed = Number(index);
      if (!Number.isFinite(parsed)) return;

      entries.push({
        index: parsed,
        key,
        field: typedField,
      });
    });

    return entries.sort((a, b) => a.index - b.index);
  }, [fieldEntries]);

  const specimenKeyMap = useMemo(() => {
    const map = new Map<number, { key: string; field: Field }>();
    specimenEntries.forEach((entry) => {
      if (!map.has(entry.index)) {
        map.set(entry.index, { key: entry.key, field: entry.field });
      }
    });
    return map;
  }, [specimenEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((entry) => keys.add(entry.key));
    if (unitField) keys.add(unitField.key);
    specimenKeyMap.forEach(({ key }) => keys.add(key));
    return keys;
  }, [headerFields, unitField, specimenKeyMap]);

  const initialData = useMemo(() => {
    const seeded: Record<string, string> = {};
    fieldEntries.forEach(([key, field]) => {
      if (!allowedFieldKeys.has(key)) return;
      const f = field as Field;
      seeded[key] = f.value ?? '';
    });
    return seeded;
  }, [fieldEntries, allowedFieldKeys]);

  const [specimenCount, setSpecimenCount] = useState(() => {
    let maxIndex = 1;
    specimenEntries.forEach((entry) => {
      if (entry.index > maxIndex && entry.field.value) {
        maxIndex = entry.index;
      }
    });
    return Math.min(MAX_SPECIMENS, maxIndex);
  });

  const { data, setData, post, processing, errors } = useForm<FormDataType>({
    fields: initialData,
    images: [],
    deleted_images: [],
  });

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

  const specimenIndices = useMemo(
    () => Array.from({ length: specimenCount }, (_, index) => index + 1),
    [specimenCount],
  );

  const averageValue = useMemo(() => {
    const values = specimenIndices.map((index) => {
      const entry = specimenKeyMap.get(index);
      if (!entry) return null;
      return parseNumber(data.fields[entry.key] ?? '');
    });
    return getAverage(values);
  }, [data.fields, specimenIndices, specimenKeyMap]);

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

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

          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="mb-0">Mediciones</h6>
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  setSpecimenCount((prev) => Math.min(MAX_SPECIMENS, prev + 1))
                }
                disabled={specimenCount >= MAX_SPECIMENS}
              >
                + Agregar espécimen
              </Button>
            )}
          </div>

          <Table bordered responsive className="align-middle text-center">
            <thead>
              <tr>
                <th>Unidad peso</th>
                {specimenIndices.map((index) => (
                  <th key={`specimen-${index}`}>Espécimen {index}</th>
                ))}
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {unitField ? (
                    <Form.Select
                      value={data.fields[unitField.key] ?? ''}
                      onChange={(e) => handleChange(unitField.key, e.target.value)}
                      isInvalid={!!errors[`fields.${unitField.key}`]}
                      disabled={isReadOnly}
                    >
                      <option value="">Selecciona...</option>
                      {UNIT_FIELD_DEFINITION.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <div className="text-muted small">Campo no encontrado</div>
                  )}
                  {unitField && errors[`fields.${unitField.key}`] && (
                    <Form.Control.Feedback type="invalid">
                      {errors[`fields.${unitField.key}`]}
                    </Form.Control.Feedback>
                  )}
                </td>
                {specimenIndices.map((index) => {
                  const entry = specimenKeyMap.get(index);
                  return (
                    <td key={`specimen-input-${index}`}>
                      <Form.Control
                        type="number"
                        step="any"
                        value={entry ? data.fields[entry.key] ?? '' : ''}
                        onChange={(e) =>
                          entry ? handleChange(entry.key, e.target.value) : undefined
                        }
                        isInvalid={entry ? !!errors[`fields.${entry.key}`] : false}
                        disabled={isReadOnly || !entry}
                      />
                      {entry && errors[`fields.${entry.key}`] && (
                        <Form.Control.Feedback type="invalid">
                          {errors[`fields.${entry.key}`]}
                        </Form.Control.Feedback>
                      )}
                    </td>
                  );
                })}
                <td className="fw-semibold">{formatNumber(averageValue)}</td>
              </tr>
            </tbody>
          </Table>

          {config.allowImages && (
            <>
              <hr className="my-4" />
              <h6 className="mb-2">Evidencia fotográfica</h6>
              <p className="text-muted small">
                {imageHelperText}
              </p>

              {isReadOnly ? (
                <SectionImageGrid
                  images={safeSection.img ?? []}
                  emptyMessage="Sin evidencia fotográfica cargada."
                />
              ) : (
                <CameraCapture
                  inputId={`${sectionName}-camera`}
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

export default PesoForm;
