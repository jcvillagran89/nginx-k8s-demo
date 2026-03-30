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
  type: 'text' | 'select';
  options?: string[];
};

type LayoutType = 'Medición única' | 'Medición por lavado' | '';

type DimensionKey = 'largo' | 'ancho';

type MeasurementMap = Record<
  number,
  Record<DimensionKey, Record<number, Record<string, string>>>
>;

const MAX_WASHES = 5;
const MAX_SPECIMENS = 3;

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'tipo_de_layout',
    label: 'Tipo de layout',
    candidates: ['tipo de layout', 'tipo_de_layout', 'layout'],
    type: 'select',
    options: ['Medición única', 'Medición por lavado'],
  },
  {
    id: 'humedad_relativa',
    label: 'Humedad relativa (%)',
    candidates: ['humedad relativa (%)', 'humedad relativa %', 'humedad_relativa'],
    type: 'text',
  },
  {
    id: 'temperatura',
    label: 'Temperatura (°C)',
    candidates: [
      'temperatura (°c)',
      'temperatura °c',
      'temperatura a (°c)',
      'temperatura_c',
      'temperatura',
    ],
    type: 'text',
  },
  {
    id: 'unidades_de_medida',
    label: 'Unidades de medida',
    candidates: ['unidades de medida', 'unidad de medida', 'unidades_de_medida', 'unidad_de_medida'],
    type: 'select',
    options: ['cm', 'mm', 'in'],
  },
  {
    id: 'numero_de_lavados',
    label: 'Número de lavados',
    candidates: ['número de lavados', 'numero de lavados', 'numero_de_lavados'],
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'numero_de_especimenes',
    label: 'Número de especímenes',
    candidates: ['número de especímenes', 'numero de especimenes', 'numero_de_especimenes'],
    type: 'select',
    options: ['1', '2', '3'],
  },
  {
    id: 'tolerancia_anchos',
    label: 'Tolerancia Anchos',
    candidates: ['tolerancia anchos', 'tolerancia ancho', 'tolerancia_anchos', 'tolerancia_ancho'],
    type: 'text',
  },
  {
    id: 'tolerancia_largos',
    label: 'Tolerancia Largos',
    candidates: ['tolerancia largos', 'tolerancia largo', 'tolerancia_largos', 'tolerancia_largo'],
    type: 'text',
  },
  {
    id: 'average_width',
    label: 'Promedio Ancho',
    candidates: ['average_width', 'promedio_ancho'],
    type: 'text',
  },
  {
    id: 'average_length',
    label: 'Promedio Largo',
    candidates: ['average_length', 'promedio_largo'],
    type: 'text',
  },
];

const WASH_TYPE_FIELD_CANDIDATES = [
  'tipo de lavado',
  'tipo_de_lavado',
  'tipo lavado',
];

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

const formatPercent = (value: number | null) => {
  if (value === null) return '';
  return `${value.toFixed(2)} %`;
};

const measurementLabelRegex =
  /^especimen_(\d+)_(largo|ancho)_(\d+)_(a|b\d+)$/i;

const getDimensionLabel = (dimension: DimensionKey) =>
  dimension === 'largo' ? 'Largo' : 'Ancho';

const getWashLabel = (washIndex: number) => {
  if (washIndex === 1) return 'primer';
  if (washIndex === 2) return 'segundo';
  if (washIndex === 3) return 'tercer';
  if (washIndex === 4) return 'cuarto';
  if (washIndex === 5) return 'quinto';
  return `${washIndex}º`;
};

const getAverage = (values: Array<number | null>) => {
  const filtered = values.filter((value): value is number => value !== null);
  if (!filtered.length) return null;
  const sum = filtered.reduce((acc, current) => acc + current, 0);
  return sum / filtered.length;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const EstabilidadEnTelaForm: React.FC<SectionFormProps> = ({
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

      if (!match) {
        return null;
      }

      return {
        definition,
        key: match[0],
        field: match[1] as Field,
      };
    }).filter(Boolean) as Array<{ definition: HeaderFieldDefinition; key: string; field: Field }>;
  }, [fieldEntries]);

  const hiddenFieldKeys = useMemo(() => {
    const keys = new Set<string>();

    const washTypeMatch = fieldEntries.find(([_, field]) => {
      const typedField = field as Field;
      const displayName = normalize(typedField.display_name || '');
      const label = normalize(typedField.label || '');
      return (
        matchesCandidate(displayName, WASH_TYPE_FIELD_CANDIDATES) ||
        matchesCandidate(label, WASH_TYPE_FIELD_CANDIDATES)
      );
    });

    if (washTypeMatch) {
      keys.add(washTypeMatch[0]);
    }

    return keys;
  }, [fieldEntries]);

  const measurementFields = useMemo(() => {
    const map: MeasurementMap = {};
    const keys = new Set<string>();

    fieldEntries.forEach(([key, field]) => {
      const typedField = field as Field;
      const label = normalize(typedField.label ?? '');
      const displayName = normalize(typedField.display_name ?? '');
      const probe = label || displayName;

      const match = probe.match(measurementLabelRegex);
      if (!match) return;

      const specimen = Number(match[1]);
      const dimension = match[2] as DimensionKey;
      const index = Number(match[3]);
      const wash = match[4].toUpperCase();

      if (!map[specimen]) {
        map[specimen] = { largo: {}, ancho: {} };
      }
      if (!map[specimen][dimension][index]) {
        map[specimen][dimension][index] = {};
      }

      map[specimen][dimension][index][wash] = key;
      keys.add(key);
    });

    return { map, keys };
  }, [fieldEntries]);

  const headerFieldMap = useMemo(
    () => new Map(headerFields.map(({ definition, key }) => [definition.id, key])),
    [headerFields],
  );

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((entry) => keys.add(entry.key));
    measurementFields.keys.forEach((key) => keys.add(key));
    hiddenFieldKeys.forEach((key) => keys.delete(key));
    return keys;
  }, [headerFields, measurementFields.keys, hiddenFieldKeys]);

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

  const layoutKey = headerFieldMap.get('tipo_de_layout');
  const hasLayoutField = !!layoutKey;
  const layoutType = (layoutKey ? data.fields[layoutKey] : '') as LayoutType;

  const washCountKey = headerFieldMap.get('numero_de_lavados');
  const washCountValue = washCountKey ? parseInt(data.fields[washCountKey] ?? '', 10) : 1;
  const washCount = clamp(Number.isFinite(washCountValue) ? washCountValue : 1, 1, MAX_WASHES);

  const specimenCountKey = headerFieldMap.get('numero_de_especimenes');
  const specimenCountValue = specimenCountKey
    ? parseInt(data.fields[specimenCountKey] ?? '', 10)
    : 1;
  const specimenCount = clamp(
    Number.isFinite(specimenCountValue) ? specimenCountValue : 1,
    1,
    MAX_SPECIMENS,
  );

  const washIndices = useMemo(
    () => Array.from({ length: washCount }, (_, index) => index + 1),
    [washCount],
  );

  const specimenIndices = useMemo(
    () => Array.from({ length: specimenCount }, (_, index) => index + 1),
    [specimenCount],
  );

  const measurementIndices = useMemo(() => [1, 2, 3], []);
  const tableMinWidth =
    layoutType === 'Medición por lavado' ? 380 + washCount * 220 : 720;

  const averageWidthKey = headerFieldMap.get('average_width');
  const averageLengthKey = headerFieldMap.get('average_length');

  const getFieldKey = (
    specimen: number,
    dimension: DimensionKey,
    index: number,
    wash: string,
  ) => measurementFields.map[specimen]?.[dimension]?.[index]?.[wash];

  const getFieldValue = (
    specimen: number,
    dimension: DimensionKey,
    index: number,
    wash: string,
  ) => {
    const key = getFieldKey(specimen, dimension, index, wash);
    return key ? data.fields[key] ?? '' : '';
  };

  const handleChange = (key: string, value: string) => {
    setData('fields', {
      ...data.fields,
      [key]: value,
    });
  };

  const handleMeasurementChange = (
    specimen: number,
    dimension: DimensionKey,
    index: number,
    wash: string,
    value: string,
  ) => {
    const key = getFieldKey(specimen, dimension, index, wash);
    if (!key) return;
    handleChange(key, value);
  };

  const getChangeDimensional = (
    specimen: number,
    dimension: DimensionKey,
    index: number,
    wash: number,
  ) => {
    const aValue = parseNumber(getFieldValue(specimen, dimension, index, 'A'));
    const bValue = parseNumber(getFieldValue(specimen, dimension, index, `B${wash}`));

    if (aValue === null || bValue === null || aValue === 0) return null;
    return ((bValue - aValue) / aValue) * 100;
  };

  const getSpecimenDimensionAverage = (
    specimen: number,
    dimension: DimensionKey,
  ) => {
    if (layoutType === 'Medición única') {
      return getAverage(
        measurementIndices.map((measureIndex) =>
          getChangeDimensional(specimen, dimension, measureIndex, 1),
        ),
      );
    }

    return getAverage(
      washIndices.map((wash) =>
        getAverage(
          measurementIndices.map((measureIndex) =>
            getChangeDimensional(specimen, dimension, measureIndex, wash),
          ),
        ),
      ),
    );
  };

  const averageLengthValue = useMemo(() => {
    return getAverage(
      specimenIndices.map((specimen) =>
        getSpecimenDimensionAverage(specimen, 'largo'),
      ),
    );
  }, [specimenIndices, layoutType, washIndices, data.fields]);

  const averageWidthValue = useMemo(() => {
    return getAverage(
      specimenIndices.map((specimen) =>
        getSpecimenDimensionAverage(specimen, 'ancho'),
      ),
    );
  }, [specimenIndices, layoutType, washIndices, data.fields]);

  useEffect(() => {
    const nextFields = { ...data.fields };
    let changed = false;

    if (averageLengthKey) {
      const nextValue = averageLengthValue !== null ? averageLengthValue.toFixed(2) : '';
      if ((nextFields[averageLengthKey] ?? '') !== nextValue) {
        nextFields[averageLengthKey] = nextValue;
        changed = true;
      }
    }

    if (averageWidthKey) {
      const nextValue = averageWidthValue !== null ? averageWidthValue.toFixed(2) : '';
      if ((nextFields[averageWidthKey] ?? '') !== nextValue) {
        nextFields[averageWidthKey] = nextValue;
        changed = true;
      }
    }

    if (changed) {
      setData('fields', nextFields);
    }
  }, [
    averageLengthKey,
    averageWidthKey,
    averageLengthValue,
    averageWidthValue,
    data.fields,
    setData,
  ]);

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
                {headerFields
                  .filter(({ definition }) => {
                    if (
                      (definition.id === 'average_length' || definition.id === 'average_width') &&
                      specimenCount <= 1
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map(({ definition, key, field }) => {
                    const isAutoAverageField =
                      definition.id === 'average_length' || definition.id === 'average_width';

                    return (
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
                              {(definition.options ?? []).map((option) => (
                                <option key={option} value={option}>
                                  {option}
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
                              readOnly={isAutoAverageField}
                            />
                          )}

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
          )}

          {!hasLayoutField && (
            <div className="text-danger small mb-4">
              No se encontró el campo "Tipo de layout". Ejecuta el backfill para actualizar
              los resultados existentes.
            </div>
          )}

          {hasLayoutField && layoutType === '' && (
            <div className="text-muted small mb-4">
              Selecciona el tipo de layout para capturar las mediciones.
            </div>
          )}

          {hasLayoutField &&
            layoutType !== '' &&
            specimenIndices.map((specimen) => (
              <div className="mb-4" key={`specimen-${specimen}`}>
                <div className="table-responsive">
                  <Table
                    bordered
                    className="align-middle text-center table-sm table-tight"
                    style={{ minWidth: tableMinWidth }}
                  >
                    <thead>
                      <tr>
                        <th colSpan={layoutType === 'Medición única' ? 4 : 2 + washCount * 2 + 1}>
                          Espécimen {specimen}
                        </th>
                      </tr>
                      {layoutType === 'Medición única' ? (
                        <tr>
                          <th></th>
                          <th>Original (A)</th>
                          <th>Después de lavar ({washCount} ciclos) (B)</th>
                          <th>Cambio dimensional</th>
                        </tr>
                      ) : (
                        <tr>
                          <th></th>
                          <th>Original (A)</th>
                          {washIndices.map((wash) => (
                            <React.Fragment key={`wash-${wash}`}>
                              <th>Lavado {wash} (B{wash})</th>
                              <th>Cambio dimensional al {getWashLabel(wash)} lavado</th>
                            </React.Fragment>
                          ))}
                          <th>Promedios totales</th>
                        </tr>
                      )}
                    </thead>

                    <tbody>
                      {(['largo', 'ancho'] as DimensionKey[]).map((dimension) => (
                        <React.Fragment key={`${specimen}-${dimension}`}>
                          {measurementIndices.map((measureIndex) => (
                            <tr key={`${specimen}-${dimension}-${measureIndex}`}>
                              <td className="fw-semibold">
                                {getDimensionLabel(dimension)} {measureIndex}
                              </td>

                              <td>
                                <Form.Control
                                  type="text"
                                  value={getFieldValue(specimen, dimension, measureIndex, 'A')}
                                  onChange={(e) =>
                                    handleMeasurementChange(
                                      specimen,
                                      dimension,
                                      measureIndex,
                                      'A',
                                      e.target.value,
                                    )
                                  }
                                  disabled={
                                    isReadOnly ||
                                    !getFieldKey(specimen, dimension, measureIndex, 'A')
                                  }
                                  size="sm"
                                />
                              </td>

                              {layoutType === 'Medición única' ? (
                                <>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={getFieldValue(specimen, dimension, measureIndex, 'B1')}
                                      onChange={(e) =>
                                        handleMeasurementChange(
                                          specimen,
                                          dimension,
                                          measureIndex,
                                          'B1',
                                          e.target.value,
                                        )
                                      }
                                      disabled={
                                        isReadOnly ||
                                        !getFieldKey(specimen, dimension, measureIndex, 'B1')
                                      }
                                      size="sm"
                                    />
                                  </td>

                                  <td className="fw-semibold">
                                    {formatPercent(
                                      getChangeDimensional(specimen, dimension, measureIndex, 1),
                                    )}
                                  </td>
                                </>
                              ) : (
                                <>
                                  {washIndices.map((wash) => (
                                    <React.Fragment key={`${specimen}-${dimension}-${measureIndex}-b${wash}`}>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          value={getFieldValue(
                                            specimen,
                                            dimension,
                                            measureIndex,
                                            `B${wash}`,
                                          )}
                                          onChange={(e) =>
                                            handleMeasurementChange(
                                              specimen,
                                              dimension,
                                              measureIndex,
                                              `B${wash}`,
                                              e.target.value,
                                            )
                                          }
                                          disabled={
                                            isReadOnly ||
                                            !getFieldKey(
                                              specimen,
                                              dimension,
                                              measureIndex,
                                              `B${wash}`,
                                            )
                                          }
                                          size="sm"
                                        />
                                      </td>

                                      <td className="fw-semibold">
                                        {formatPercent(
                                          getChangeDimensional(
                                            specimen,
                                            dimension,
                                            measureIndex,
                                            wash,
                                          ),
                                        )}
                                      </td>
                                    </React.Fragment>
                                  ))}

                                  <td></td>
                                </>
                              )}
                            </tr>
                          ))}

                          <tr>
                            <td className="fw-semibold">
                              Promedio cambio dimensional {getDimensionLabel(dimension).toLowerCase()}s
                            </td>

                            <td></td>

                            {layoutType === 'Medición única' ? (
                              <>
                                <td></td>
                                <td className="fw-semibold">
                                  {formatPercent(getSpecimenDimensionAverage(specimen, dimension))}
                                </td>
                              </>
                            ) : (
                              <>
                                {washIndices.map((wash) => (
                                  <React.Fragment key={`${specimen}-${dimension}-avg-${wash}`}>
                                    <td></td>
                                    <td className="fw-semibold">
                                      {formatPercent(
                                        getAverage(
                                          measurementIndices.map((measureIndex) =>
                                            getChangeDimensional(
                                              specimen,
                                              dimension,
                                              measureIndex,
                                              wash,
                                            ),
                                          ),
                                        ),
                                      )}
                                    </td>
                                  </React.Fragment>
                                ))}

                                <td className="fw-semibold">
                                  {formatPercent(getSpecimenDimensionAverage(specimen, dimension))}
                                </td>
                              </>
                            )}
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            ))}

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

export default EstabilidadEnTelaForm;