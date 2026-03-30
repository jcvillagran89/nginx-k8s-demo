import React, { useEffect, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
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
  type: 'text' | 'textarea' | 'select';
  options?: string[];
};

const TYPE_OF_FABRIC_OPTIONS = ['Calada', 'Punto'];

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'tolerancia',
    label: 'Tolerancidsadasdasa',
    candidates: ['tolerancia', 'tolerance'],
    type: 'text',
  },
  {
    id: 'acondicionamiento_temperatura',
    label: 'Acondicionamiento Temperatura ºC',
    candidates: [
      'acondicionamiento temperatura ºc',
      'acondicionamiento temperatura °c',
      'acondicionamiento temperatura',
      'conditioning temperature °c',
      'conditioning temperature',
    ],
    type: 'text',
  },
  {
    id: 'acondicionamiento_humedad_relativa',
    label: 'Acondicionamiento Humedad Relativa %',
    candidates: [
      'acondicionamiento humedad relativa %',
      'acondicionamiento humedad relativa',
      'conditioning relative humidity %',
      'conditioning relative humidity',
    ],
    type: 'text',
  },
  {
    id: 'no_hilos_urd_columnas',
    label: 'No. Hilos urd/columnas (en 1in)',
    candidates: [
      'no hilos urd columnas en 1in',
      'no. hilos urd/columnas (en 1in)',
      'hilos urd',
      'warp threads',
      'warp threads columns in 1in',
      'no. warp threads/columns (in 1in)',
    ],
    type: 'text',
  },
  {
    id: 'no_hilos_trama_mallas',
    label: 'No. Hilos trama/mallas (en 1in)',
    candidates: [
      'no hilos trama mallas en 1in',
      'no. hilos trama/mallas (en 1in)',
      'hilos trama',
      'weft threads',
      'weft threads meshes in 1in',
      'no. weft threads/meshes (in 1in)',
    ],
    type: 'text',
  },
  {
    id: 'observaciones',
    label: 'Observaciones',
    candidates: ['observaciones', 'observacion', 'observations'],
    type: 'textarea',
  },
  {
    id: 'tipo_de_tejido',
    label: 'Tipo de tejido',
    candidates: [
      'tipo de tejido',
      'tipo_de_tejido',
      'type of fabric',
      'fabric type',
    ],
    type: 'select',
    options: TYPE_OF_FABRIC_OPTIONS,
  },
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const matchesCandidate = (value: string, candidates: string[]) =>
  candidates.some((candidate) => normalize(value).includes(normalize(candidate)));

const DensityForm: React.FC<SectionFormProps> = ({
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

  const mappedFields = useMemo(() => {
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
    }).filter(Boolean) as Array<{
      definition: HeaderFieldDefinition;
      key: string;
      field: Field;
    }>;
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    mappedFields.forEach((entry) => keys.add(entry.key));
    return keys;
  }, [mappedFields]);

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

  const imageHelperText = isReadOnly
    ? 'Evidencia fotográfica cargada.'
    : 'Captura o adjunta fotografías para esta prueba.';

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={isReadOnly ? (e) => e.preventDefault() : handleSubmit}>
          {mappedFields.length > 0 ? (
            <Row className="g-3">
              {mappedFields.map(({ definition, key, field }) => (
                <Col
                  xs={12}
                  sm={definition.type === 'textarea' ? 12 : 6}
                  md={definition.type === 'textarea' ? 12 : 4}
                  lg={definition.type === 'textarea' ? 12 : 3}
                  key={key}
                >
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
                    ) : definition.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={data.fields[key] ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        isInvalid={!!errors[`fields.${key}`]}
                        disabled={isReadOnly}
                      />
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
            </Row>
          ) : (
            <div className="text-muted small mb-4">
              No se encontraron campos configurados para esta sección.
            </div>
          )}

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

export default DensityForm;