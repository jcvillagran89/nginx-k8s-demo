import React, { useMemo } from 'react';
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
  type: 'text' | 'select';
  options?: string[];
};

const UNITS_OPTIONS = ['cm', 'mm', 'in', 'yds'] as const;

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

const formatPercentValue = (value: number | null) => {
  if (value === null) return '';
  return value.toFixed(2);
};

const computeTwistPercent = (largo: number | null, ancho: number | null) => {
  if (largo === null || ancho === null || largo === 0) return null;
  return (ancho / largo) * 100;
};

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'humedad_relativa',
    label: 'Humedad relativa (%)',
    candidates: ['humedad relativa (%)', 'humedad relativa %', 'humedad_relativa', 'relative humidity'],
    type: 'text',
  },
  {
    id: 'temperatura',
    label: 'Temperatura (°C)',
    candidates: [
      'temperatura (°c)',
      'temperatura °c',
      'temperatura (ºc)',
      'temperatura_c',
      'temperatura',
      'temperature',
    ],
    type: 'text',
  },
  {
    id: 'tolerancias',
    label: 'Tolerancias',
    candidates: ['tolerancias', 'tolerancia', 'tolerances'],
    type: 'text',
  },
];

const TABLE_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'unidades',
    label: 'Unidades',
    candidates: ['unidades', 'unidad', 'unit', 'units'],
    type: 'select',
    options: [...UNITS_OPTIONS],
  },

  // Izquierda
  {
    id: 'largo_izq',
    label: 'Largo Izq',
    candidates: ['largo izq', 'largo_izq', 'left length', 'left largo', 'leftlargo'],
    type: 'text',
  },
  {
    id: 'ancho_izq',
    label: 'Ancho Izq',
    candidates: ['ancho izq', 'ancho_izq', 'left width', 'left ancho', 'leftancho'],
    type: 'text',
  },
  {
    id: 'torsion_izq',
    label: 'Torsión Izq %',
    candidates: ['torsión izq', 'torsion izq', 'torsion_izq', 'left twist', 'left twist %'],
    type: 'text',
  },

  // Derecha
  {
    id: 'largo_der',
    label: 'Largo Der',
    candidates: ['largo der', 'largo_der', 'right length', 'right largo', 'rightlargo'],
    type: 'text',
  },
  {
    id: 'ancho_der',
    label: 'Ancho Der',
    candidates: ['ancho der', 'ancho_der', 'right width', 'right ancho', 'rightancho'],
    type: 'text',
  },
  {
    id: 'torsion_der',
    label: 'Torsión Der %',
    candidates: ['torsión der', 'torsion der', 'torsion_der', 'right twist', 'right twist %'],
    type: 'text',
  },
];

const AATCC207Form: React.FC<SectionFormProps> = ({ testId, sectionName, sectionData, readOnly }) => {
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

  const findFieldKeyByDefinition = (definition: HeaderFieldDefinition) => {
    const match = fieldEntries.find(([_, field]) => {
      const typedField = field as Field;
      const displayName = normalize(typedField.display_name || '');
      const label = normalize(typedField.label || '');
      return (
        matchesCandidate(displayName, definition.candidates) ||
        matchesCandidate(label, definition.candidates)
      );
    });
    return match ? match[0] : null;
  };

  const headerKeys = useMemo(() => {
    const map = new Map<string, string>();
    HEADER_FIELD_DEFINITIONS.forEach((def) => {
      const key = findFieldKeyByDefinition(def);
      if (key) map.set(def.id, key);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldEntries]);

  const tableKeys = useMemo(() => {
    const map = new Map<string, string>();
    TABLE_FIELD_DEFINITIONS.forEach((def) => {
      const key = findFieldKeyByDefinition(def);
      if (key) map.set(def.id, key);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerKeys.forEach((key) => keys.add(key));
    tableKeys.forEach((key) => keys.add(key));
    return keys;
  }, [headerKeys, tableKeys]);

  const initialData = useMemo(() => {
    const seeded: Record<string, string> = {};
    fieldEntries.forEach(([key, field]) => {
      if (!allowedFieldKeys.has(key)) return;
      seeded[key] = (field as Field).value ?? '';
    });
    return seeded;
  }, [fieldEntries, allowedFieldKeys]);

  const { data, setData, post, processing, errors } = useForm<FormDataType>({
    fields: initialData,
    images: [],
    deleted_images: [],
  });

  const getValue = (key: string | null | undefined) => (key ? data.fields[key] ?? '' : '');

  const setFieldValue = (key: string | null | undefined, value: string) => {
    if (!key) return;

    setData('fields', {
      ...data.fields,
      [key]: value,
    });
  };

  const recomputeTwist = (nextFields: Record<string, string>) => {
    const largoIzqKey = tableKeys.get('largo_izq') ?? null;
    const anchoIzqKey = tableKeys.get('ancho_izq') ?? null;
    const torsionIzqKey = tableKeys.get('torsion_izq') ?? null;

    const largoDerKey = tableKeys.get('largo_der') ?? null;
    const anchoDerKey = tableKeys.get('ancho_der') ?? null;
    const torsionDerKey = tableKeys.get('torsion_der') ?? null;

    // Izq
    if (torsionIzqKey) {
      const largo = parseNumber(largoIzqKey ? nextFields[largoIzqKey] ?? '' : '');
      const ancho = parseNumber(anchoIzqKey ? nextFields[anchoIzqKey] ?? '' : '');
      const twist = computeTwistPercent(largo, ancho);
      nextFields[torsionIzqKey] = formatPercentValue(twist);
    }

    // Der
    if (torsionDerKey) {
      const largo = parseNumber(largoDerKey ? nextFields[largoDerKey] ?? '' : '');
      const ancho = parseNumber(anchoDerKey ? nextFields[anchoDerKey] ?? '' : '');
      const twist = computeTwistPercent(largo, ancho);
      nextFields[torsionDerKey] = formatPercentValue(twist);
    }

    return nextFields;
  };

  const handleChange = (key: string, value: string) => {
    const next = recomputeTwist({
      ...data.fields,
      [key]: value,
    });

    setData('fields', next);
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

    // Asegura que al guardar se manden torsiones calculadas (por si el usuario no tocó nada)
    const next = recomputeTwist({ ...data.fields });
    setData('fields', next);

    post(
      route('test-results.section.update', {
        test: testId,
        section: config.routeSection,
      }),
      { forceFormData: true },
    );
  };

  const unidadesKey = tableKeys.get('unidades') ?? null;
  const largoIzqKey = tableKeys.get('largo_izq') ?? null;
  const anchoIzqKey = tableKeys.get('ancho_izq') ?? null;
  const torsionIzqKey = tableKeys.get('torsion_izq') ?? null;

  const largoDerKey = tableKeys.get('largo_der') ?? null;
  const anchoDerKey = tableKeys.get('ancho_der') ?? null;
  const torsionDerKey = tableKeys.get('torsion_der') ?? null;

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={isReadOnly ? (e) => e.preventDefault() : handleSubmit}>
          {/* Cabecera */}
          <div className="mb-4">
            <Row className="g-3">
              {HEADER_FIELD_DEFINITIONS.map((def) => {
                const key = headerKeys.get(def.id) ?? null;
                if (!key) return null;

                return (
                  <Col xs={12} sm={6} md={4} lg={3} key={key}>
                    <Form.Group controlId={`${sectionName}-${key}`}>
                      <Form.Label className="small">{def.label}</Form.Label>
                      <Form.Control
                        type="text"
                        value={getValue(key)}
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
                );
              })}
            </Row>
          </div>

          {/* Tabla principal */}
          <Table bordered responsive className="align-middle text-center">
            <thead>
              <tr>
                <th rowSpan={2} style={{ width: 140 }}>
                  Unidades
                </th>
                <th colSpan={3}>Costura izquierda</th>
                <th colSpan={3}>Costura derecha</th>
              </tr>
              <tr>
                <th style={{ width: 160 }}>Largo</th>
                <th style={{ width: 160 }}>Ancho</th>
                <th style={{ width: 160 }}>Torsión (%)</th>
                <th style={{ width: 160 }}>Largo</th>
                <th style={{ width: 160 }}>Ancho</th>
                <th style={{ width: 160 }}>Torsión (%)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                {/* Unidades */}
                <td>
                  <Form.Select
                    value={getValue(unidadesKey)}
                    onChange={(e) => (unidadesKey ? handleChange(unidadesKey, e.target.value) : null)}
                    disabled={isReadOnly || !unidadesKey}
                    isInvalid={!!(unidadesKey && errors[`fields.${unidadesKey}`])}
                  >
                    <option value="">Selecciona...</option>
                    {UNITS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  {unidadesKey && errors[`fields.${unidadesKey}`] && (
                    <div className="invalid-feedback d-block">{errors[`fields.${unidadesKey}`]}</div>
                  )}
                </td>

                {/* Izquierda */}
                <td>
                    <Form.Control
                      type="number"
                      step="any"
                      value={getValue(largoIzqKey)}
                      onChange={(e) => (largoIzqKey ? handleChange(largoIzqKey, e.target.value) : null)}
                      disabled={isReadOnly || !largoIzqKey}
                      isInvalid={!!(largoIzqKey && errors[`fields.${largoIzqKey}`])}
                    />
                </td>
                <td>
                    <Form.Control
                      type="number"
                      step="any"
                      value={getValue(anchoIzqKey)}
                      onChange={(e) => (anchoIzqKey ? handleChange(anchoIzqKey, e.target.value) : null)}
                      disabled={isReadOnly || !anchoIzqKey}
                      isInvalid={!!(anchoIzqKey && errors[`fields.${anchoIzqKey}`])}
                    />
                </td>
                <td>
                    <Form.Control
                      type="text"
                      value={getValue(torsionIzqKey)}
                      readOnly
                      disabled={isReadOnly || !torsionIzqKey}
                      placeholder={!torsionIzqKey ? 'N/A' : ''}
                    />
                </td>

                {/* Derecha */}
                <td>
                    <Form.Control
                      type="number"
                      step="any"
                      value={getValue(largoDerKey)}
                      onChange={(e) => (largoDerKey ? handleChange(largoDerKey, e.target.value) : null)}
                      disabled={isReadOnly || !largoDerKey}
                      isInvalid={!!(largoDerKey && errors[`fields.${largoDerKey}`])}
                    />
                </td>
                <td>
                    <Form.Control
                      type="number"
                      step="any"
                      value={getValue(anchoDerKey)}
                      onChange={(e) => (anchoDerKey ? handleChange(anchoDerKey, e.target.value) : null)}
                      disabled={isReadOnly || !anchoDerKey}
                      isInvalid={!!(anchoDerKey && errors[`fields.${anchoDerKey}`])}
                    />
                </td>
                <td>
                    <Form.Control
                      type="text"
                      value={getValue(torsionDerKey)}
                      readOnly
                      disabled={isReadOnly || !torsionDerKey}
                      placeholder={!torsionDerKey ? 'N/A' : ''}
                    />
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Evidencia fotográfica (si aplica en esta sección) */}
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

export default AATCC207Form;
