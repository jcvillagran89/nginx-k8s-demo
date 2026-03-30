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

type SectionData = { [key: string]: Field | any };

type SavedImage = {
  id?: number | string;
  path?: string;
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
  readOnly?: boolean;
};

const MAX_SPECIMENS = 5;
const UNIT_OPTIONS = ['n', 'lb/f'];

const normalize = (v: string) => v.trim().toLowerCase();

const matchesCandidate = (value: string, candidates: string[]) =>
  candidates.some((c) => {
    const needle = normalize(c);
    return value === needle || value.includes(needle);
  });

const parseNumber = (raw: string) => {
  if (!raw) return null;
  const parsed = Number.parseFloat(raw.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
};

const format2 = (n: number | null) => (n === null ? '' : n.toFixed(2));

const average = (values: Array<number | null>) => {
  const nums = values.filter((v): v is number => v !== null);
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
};

const HEADER_FIELD_DEFS: HeaderFieldDefinition[] = [
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
    id: 'numero_de_especimenes',
    label: 'Número de especímenes',
    candidates: ['número de especímenes', 'numero de especimenes', 'numero_de_especimenes', 'number of specimens'],
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'unidades',
    label: 'Unidades',
    candidates: ['unidades', 'unidad', 'unit'],
    type: 'select',
    options: UNIT_OPTIONS,
  },
  {
    id: 'tolerancia_urdimbre',
    label: 'Tolerancia Urdimbre',
    candidates: ['tolerancia urdimbre', 'warp tolerance'],
    type: 'text',
  },
  {
    id: 'tolerancia_trama',
    label: 'Tolerancia Trama',
    candidates: ['tolerancia trama', 'weft tolerance'],
    type: 'text',
  },
  {
    id: 'promedio_urdimbre',
    label: 'Promedio Urdimbre',
    candidates: ['promedio urdimbre', 'average warp'],
    type: 'text',
    readOnly: true,
  },
  {
    id: 'promedio_trama',
    label: 'Promedio Trama',
    candidates: ['promedio trama', 'average weft'],
    type: 'text',
    readOnly: true,
  },
];

const specimenRegex =
  /^especimen_(\d+)_(urdimbre|trama|observaciones)(?:_(?:lbf|lb_f|lb\/f))?$/i;


const ASTMD5034Form: React.FC<SectionFormProps> = ({ testId, sectionName, sectionData, readOnly }) => {
  const config = SECTION_CONFIG[sectionName as SectionKey];
  const safeSection = (sectionData || {}) as SectionData;
  const isReadOnly = Boolean(readOnly);

  if (!config) {
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
    return HEADER_FIELD_DEFS.map((definition) => {
      const match = fieldEntries.find(([_, field]) => {
        const typed = field as Field;
        const dn = normalize(typed.display_name || '');
        const lb = normalize(typed.label || '');
        return matchesCandidate(dn, definition.candidates) || matchesCandidate(lb, definition.candidates);
      });

      if (!match) return null;

      return { definition, key: match[0], field: match[1] as Field };
    }).filter(Boolean) as Array<{ definition: HeaderFieldDefinition; key: string; field: Field }>;
  }, [fieldEntries]);

  const headerMap = useMemo(
    () => new Map(headerFields.map(({ definition, key }) => [definition.id, key])),
    [headerFields],
  );

  const specimenFields = useMemo(() => {
    const map: Record<number, { urdimbre?: string; trama?: string; observaciones?: string }> = {};
    const allowedKeys = new Set<string>();

    fieldEntries.forEach(([key, field]) => {
      const f = field as Field;

      // 👇 clave: en tu app, muchas veces el "slug" real viene en label
      const probe = normalize(f.label || key);

      const match = probe.match(specimenRegex);
      if (!match) return;

      const specimen = Number(match[1]);
      const kind = match[2].toLowerCase() as 'urdimbre' | 'trama' | 'observaciones';

      if (!Number.isFinite(specimen)) return;

      if (!map[specimen]) map[specimen] = {};
      map[specimen][kind] = key; // ✅ guardamos el key real para escribir en data.fields

      allowedKeys.add(key);
    });

    return { map, allowedKeys };
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((h) => keys.add(h.key));
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

  const specimenCountKey = headerMap.get('numero_de_especimenes');
  const specimenCountRaw = specimenCountKey ? parseInt(data.fields[specimenCountKey] ?? '', 10) : 1;
  const specimenCount = Math.min(
    MAX_SPECIMENS,
    Math.max(1, Number.isFinite(specimenCountRaw) ? specimenCountRaw : 1),
  );

  const avgWarpKey = headerMap.get('promedio_urdimbre');
  const avgWeftKey = headerMap.get('promedio_trama');

  const recomputeAverages = (nextFields: Record<string, string>) => {
    const warpVals: Array<number | null> = [];
    const weftVals: Array<number | null> = [];

    for (let i = 1; i <= specimenCount; i++) {
      const row = specimenFields.map[i];
      if (!row) continue;

      warpVals.push(row.urdimbre ? parseNumber(nextFields[row.urdimbre] ?? '') : null);
      weftVals.push(row.trama ? parseNumber(nextFields[row.trama] ?? '') : null);
    }

    const warpAvg = average(warpVals);
    const weftAvg = average(weftVals);

    if (avgWarpKey) nextFields[avgWarpKey] = format2(warpAvg);
    if (avgWeftKey) nextFields[avgWeftKey] = format2(weftAvg);

    return nextFields;
  };

  const handleChange = (key: string, value: string) => {
    const base = { ...data.fields, [key]: value };
    const next = recomputeAverages(base);
    setData('fields', next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = recomputeAverages({ ...data.fields });
    setData('fields', next);

    post(
      route('test-results.section.update', {
        test: testId,
        section: config.routeSection,
      }),
      { forceFormData: true },
    );
  };

  const specimenIndices = useMemo(
    () => Array.from({ length: specimenCount }, (_, idx) => idx + 1),
    [specimenCount],
  );

  const handleFilesChange = (files: File[]) => setData('images', files);

  const handleDeleteSavedImage = (img: SavedImage) => {
    const identifier = img.id ? String(img.id) : img.path;
    if (!identifier) return;
    if (data.deleted_images.includes(identifier)) return;
    setData('deleted_images', [...data.deleted_images, identifier]);
  };

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
              {headerFields.map(({ definition, key, field }) => (
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
                        onChange={(e) => !definition.readOnly && handleChange(key, e.target.value)}
                        readOnly={!!definition.readOnly}
                        disabled={isReadOnly}
                        placeholder={definition.readOnly ? 'Auto' : ''}
                        isInvalid={!!errors[`fields.${key}`]}
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

          {/* Tabla por espécimen */}
          <Table bordered responsive className="align-middle text-center">
            <thead>
              <tr>
                <th>Espécimen</th>
                <th>Urdimbre</th>
                <th>Trama</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {specimenIndices.map((specimen) => {
                const row = specimenFields.map[specimen] || {};
                const warpKey = row.urdimbre;
                const weftKey = row.trama;
                const notesKey = row.observaciones;

                return (
                  <tr key={`spec-${specimen}`}>
                    <td className="fw-semibold">{specimen}</td>

                    <td>
                      <Form.Control
                        type="number"
                        step="any"
                        value={warpKey ? data.fields[warpKey] ?? '' : ''}
                        disabled={isReadOnly || !warpKey}
                        onChange={(e) => warpKey && handleChange(warpKey, e.target.value)}
                      />
                    </td>

                    <td>
                      <Form.Control
                        type="number"
                        step="any"
                        value={weftKey ? data.fields[weftKey] ?? '' : ''}
                        disabled={isReadOnly || !weftKey}
                        onChange={(e) => weftKey && handleChange(weftKey, e.target.value)}
                      />
                    </td>

                    <td className="text-start">
                      <Form.Control
                        type="text"
                        value={notesKey ? data.fields[notesKey] ?? '' : ''}
                        disabled={isReadOnly || !notesKey}
                        onChange={(e) => notesKey && handleChange(notesKey, e.target.value)}
                        placeholder="Observaciones…"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

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
                  multiple
                  initialImages={safeSection.img ?? []}
                  onFilesChange={handleFilesChange}
                  onDeleteSavedImage={handleDeleteSavedImage}
                />
              )}
            </>
          )}

          {!isReadOnly && (
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button variant="outline-secondary" onClick={() => history.back()}>
                Cancelar
              </Button>
              <Button type="submit" variant="dark" disabled={processing}>
                {processing ? 'Guardando…' : `Guardar ${config.routeSection}`}
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ASTMD5034Form;
