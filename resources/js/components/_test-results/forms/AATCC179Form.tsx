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

const MAX_SPECIMENS = 5;
const UNITS_OPTIONS = ['cm', 'mm', 'in', 'yds'];

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

const computeTorsion = (ac: number | null, bd: number | null) => {
  if (ac === null || bd === null) return null;

  const denominator = ac + bd;
  if (denominator === 0) return null;

  return ((2 * (ac - bd)) / denominator) * 100;
};

const formatNumber2 = (value: number | null) => {
  if (value === null) return '';
  return value.toFixed(2);
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
    candidates: ['temperatura (°c)', 'temperatura °c', 'temperatura', 'temperature'],
    type: 'text',
  },
  {
    id: 'tolerancias',
    label: 'Tolerancias',
    candidates: ['tolerancias', 'tolerancia', 'tolerances'],
    type: 'text',
  },
  {
    id: 'numero_de_especimenes',
    label: 'Número de especímenes',
    candidates: ['número de especímenes', 'numero de especimenes', 'numero_de_especimenes'],
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'torsion_promedio',
    label: 'Torsión promedio',
    candidates: ['torsion promedio', 'torsión promedio', 'average torsion', 'avg torsion'],
    type: 'text',
  },
];

// labels tipo: "especimen_1_ac", "especimen_2_bd", etc.
const specimenFieldRegex =
  /^especimen_(\d+)_(unidades|unidad|valor_ac|valor_bd|torsion)$/i;


const AATCC179Form: React.FC<SectionFormProps> = ({
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

  const headerFieldMap = useMemo(
    () => new Map(headerFields.map(({ definition, key }) => [definition.id, key])),
    [headerFields],
  );

  const specimenFields = useMemo(() => {
    const map: Record<number, { unidad?: string; ac?: string; bd?: string; torsion?: string }> = {};
    const allowedKeys = new Set<string>();

    fieldEntries.forEach(([key, field]) => {
      const label = normalize((field as Field).label ?? '');
      const display = normalize((field as Field).display_name ?? '');

      const probe = label || display;
      const match = probe.match(specimenFieldRegex);
      if (!match) return;

      const specimen = Number(match[1]);
      const kindRaw = match[2].toLowerCase();

      let kind: 'unidad' | 'ac' | 'bd' | 'torsion' | null = null;

      if (kindRaw === 'unidad' || kindRaw === 'unidades') kind = 'unidad';
      else if (kindRaw === 'valor_ac') kind = 'ac';
      else if (kindRaw === 'valor_bd') kind = 'bd';
      else if (kindRaw === 'torsion') kind = 'torsion';

      if (!kind) return;

      if (!map[specimen]) map[specimen] = {};
      map[specimen][kind] = key;
      allowedKeys.add(key);
    });

    return { map, allowedKeys };
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((entry) => keys.add(entry.key));
    specimenFields.allowedKeys.forEach((k) => keys.add(k));
    return keys;
  }, [headerFields, specimenFields.allowedKeys]);

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

  const specimenCountKey = headerFieldMap.get('numero_de_especimenes');
  const specimenCountRaw = specimenCountKey ? parseInt(data.fields[specimenCountKey] ?? '', 10) : 1;
  const specimenCount = Math.min(
    MAX_SPECIMENS,
    Math.max(1, Number.isFinite(specimenCountRaw) ? specimenCountRaw : 1),
  );

  const torsionAvgKey = headerFieldMap.get('torsion_promedio');

  const getValue = (key?: string) => (key ? data.fields[key] ?? '' : '');

  const setFieldValue = (key: string, value: string) => {
    setData('fields', { ...data.fields, [key]: value });
  };

  const recompute = (nextFields: Record<string, string>) => {
    const torsions: number[] = [];

    for (let i = 1; i <= specimenCount; i++) {
      const row = specimenFields.map[i];
      if (!row) continue;

      const ac = parseNumber(getValue(row.ac ? row.ac : undefined) || nextFields[row.ac ?? ''] || '');
      const bd = parseNumber(getValue(row.bd ? row.bd : undefined) || nextFields[row.bd ?? ''] || '');

      // Mejor: leer directamente de nextFields si existe la key
      const acVal = row.ac ? parseNumber(nextFields[row.ac] ?? '') : null;
      const bdVal = row.bd ? parseNumber(nextFields[row.bd] ?? '') : null;

      const t = computeTorsion(acVal, bdVal);

      if (row.torsion) {
        nextFields[row.torsion] = formatNumber2(t);
      }

      if (t !== null) torsions.push(t);
    }

    const avg = torsions.length ? torsions.reduce((a, b) => a + b, 0) / torsions.length : null;

    // Si existe field torsion_promedio, lo persistimos. Si no, igual lo mostraremos calculado.
    if (torsionAvgKey && specimenCount > 1) {
      nextFields[torsionAvgKey] = formatNumber2(avg);
    }

    return { nextFields, avg };
  };

  const handleChange = (key: string, value: string) => {
    const base = { ...data.fields, [key]: value };
    const { nextFields } = recompute(base);
    setData('fields', nextFields);
  };

  const handleFilesChange = (files: File[]) => setData('images', files);

  const handleDeleteSavedImage = (img: SavedImage) => {
    const identifier = img.id ? String(img.id) : img.path;
    if (!identifier) return;
    if (data.deleted_images.includes(identifier)) return;
    setData('deleted_images', [...data.deleted_images, identifier]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nextFields } = recompute({ ...data.fields });
    setData('fields', nextFields);

    post(
      route('test-results.section.update', {
        test: testId,
        section: config.routeSection,
      }),
      { forceFormData: true },
    );
  };

  // valor visible del promedio (aunque no exista key)
  const avgDisplay = useMemo(() => {
    const { avg } = recompute({ ...data.fields });
    return specimenCount > 1 ? formatNumber2(avg) : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fields, specimenCount]);

  const specimenIndices = useMemo(
    () => Array.from({ length: specimenCount }, (_, idx) => idx + 1),
    [specimenCount],
  );

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={isReadOnly ? (e) => e.preventDefault() : handleSubmit}>
          {/* Cabeceras */}
          <div className="mb-4">
            <Row className="g-3">
              {headerFields
                .filter(({ definition }) => definition.id !== 'torsion_promedio') // lo renderizamos aparte
                .map(({ definition, key, field }) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={key}>
                    <Form.Group controlId={`${sectionName}-${key}`}>
                      <Form.Label className="small">{field.display_name || definition.label}</Form.Label>

                      {definition.type === 'select' ? (
                        <Form.Select
                          value={data.fields[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          isInvalid={!!errors[`fields.${key}`]}
                          disabled={isReadOnly}
                        >
                          <option value="">Selecciona...</option>
                          {(definition.options ?? []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type="text"
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

              {/* Torsión promedio (solo lectura) */}
              {specimenCount > 1 && (
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Form.Group controlId={`${sectionName}-torsion-promedio`}>
                    <Form.Label className="small">Torsión promedio</Form.Label>
                    <Form.Control
                      type="text"
                      value={torsionAvgKey ? data.fields[torsionAvgKey] ?? avgDisplay : avgDisplay}
                      readOnly
                      disabled={isReadOnly}
                    />
                    <div className="text-muted small mt-1">
                      Promedio de los “% Torsión” de todos los especímenes.
                    </div>
                  </Form.Group>
                </Col>
              )}
            </Row>

            {!specimenCountKey && (
              <div className="text-danger small mt-2">
                No se encontró el campo &quot;Número de especímenes&quot; en los resultados (display_name/label).
                Agrega ese field o ajusta el backfill.
              </div>
            )}
          </div>

          {/* Tablas por espécimen */}
          {specimenIndices.map((specimen) => {
            const row = specimenFields.map[specimen] || {};
            const unidadKey = row.unidad;
            const acKey = row.ac;
            const bdKey = row.bd;
            const torsionKey = row.torsion;

            return (
              <div className="mb-4" key={`specimen-${specimen}`}>
                <Table bordered responsive className="align-middle text-center">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-start">
                        Espécimen {specimen}
                      </th>
                    </tr>
                    <tr>
                      <th>Unidades</th>
                      <th>Valor AC</th>
                      <th>Valor BD</th>
                      <th>% Torsión</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Form.Select
                          value={getValue(unidadKey)}
                          onChange={(e) => unidadKey && handleChange(unidadKey, e.target.value)}
                          disabled={isReadOnly || !unidadKey}
                        >
                          <option value="">Selecciona...</option>
                          {UNITS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Form.Select>
                      </td>

                      <td>
                        <Form.Control
                          type="number"
                          step="any"
                          value={getValue(acKey)}
                          onChange={(e) => acKey && handleChange(acKey, e.target.value)}
                          disabled={isReadOnly || !acKey}
                        />
                      </td>

                      <td>
                        <Form.Control
                          type="number"
                          step="any"
                          value={getValue(bdKey)}
                          onChange={(e) => bdKey && handleChange(bdKey, e.target.value)}
                          disabled={isReadOnly || !bdKey}
                        />
                      </td>

                      <td>
                        <Form.Control
                          type="text"
                          value={getValue(torsionKey)}
                          readOnly
                          disabled={isReadOnly || !torsionKey}
                          placeholder={!torsionKey ? 'N/A' : ''}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            );
          })}

          {/* Evidencia fotográfica */}
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

export default AATCC179Form;
