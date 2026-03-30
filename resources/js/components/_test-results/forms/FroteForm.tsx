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

type RowId = 'tela_principal' | 'tela_secundaria' | 'estampado_bordado';
type ColumnId = 'seco' | 'humedo' | 'tolerancia' | 'pickup' | 'observaciones';

const GRADE_OPTIONS = ['5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'];

const HEADER_FIELD_DEFINITIONS: HeaderFieldDefinition[] = [
  {
    id: 'acondicionamiento_temperatura',
    label: 'Acondicionamiento en Temperatura ºC',
    candidates: [
      'acondicionamiento en temperatura',
      'acondicionamiento temperatura',
      'acondicionamiento_temperatura',
      'temperatura acondicionamiento',
    ],
    type: 'text',
  },
  {
    id: 'acondicionamiento_humedad_relativa',
    label: 'Acondicionamiento en Humedad relativa %',
    candidates: [
      'acondicionamiento en humedad relativa',
      'acondicionamiento humedad relativa',
      'acondicionamiento_humedad_relativa',
      'humedad relativa',
    ],
    type: 'text',
  },
  {
    id: 'friction_test',
    label: 'Prueba de frote en',
    candidates: [
      'friction_test',
      'friction test',
      'prueba de frote en',
      'prueba_frote',
      'frote en',
    ],
    type: 'select',
    options: ['Prenda original', 'Después de lavar', 'Ambos'],
  },
];

const ROW_DEFINITIONS: Array<{ id: RowId; label: string; candidates: string[] }> = [
  {
    id: 'tela_principal',
    label: 'Tela Principal',
    candidates: ['tela principal', 'principal', 'tela_principal'],
  },
  {
    id: 'tela_secundaria',
    label: 'Tela Secundaria',
    candidates: ['tela secundaria', 'secundaria', 'tela_secundaria'],
  },
  {
    id: 'estampado_bordado',
    label: 'Estampado y/o Bordado',
    candidates: [
      'estampado y/o bordado',
      'estampado',
      'bordado',
      'estampado_bordado',
    ],
  },
];

const COLUMN_DEFINITIONS: Array<{ id: ColumnId; candidates: string[] }> = [
  { id: 'seco', candidates: ['seco', 'dry'] },
  { id: 'humedo', candidates: ['humedo', 'húmedo', 'wet'] },
  { id: 'tolerancia', candidates: ['tolerancia'] },
  { id: 'pickup', candidates: ['pickup'] },
  { id: 'observaciones', candidates: ['observaciones', 'observacion', 'observations'] },
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

const FroteForm: React.FC<SectionFormProps> = ({
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

  const tableFieldMap = useMemo(() => {
    const map: Record<RowId, Partial<Record<ColumnId, string>>> = {
      tela_principal: {},
      tela_secundaria: {},
      estampado_bordado: {},
    };

    const assignField = (rowId: RowId, colId: ColumnId, key: string) => {
      if (!map[rowId][colId]) {
        map[rowId][colId] = key;
      }
    };

    fieldEntries.forEach(([key, field]) => {
      const typedField = field as Field;
      const displayName = typedField.display_name || '';
      const label = typedField.label || '';
      const haystack = `${displayName} ${label}`;

      const row = ROW_DEFINITIONS.find((definition) =>
        matchesCandidate(haystack, definition.candidates),
      );
      const column = COLUMN_DEFINITIONS.find((definition) =>
        matchesCandidate(haystack, definition.candidates),
      );

      if (row && column) {
        assignField(row.id, column.id, key);
      }
    });

    fieldEntries.forEach(([key, field]) => {
      const typedField = field as Field;
      const displayName = typedField.display_name || '';
      const label = typedField.label || '';
      const haystack = normalize(`${displayName} ${label}`);

      if (haystack.includes('seco grado 1')) {
        assignField('tela_principal', 'seco', key);
        return;
      }
      if (haystack.includes('humedo grado 1')) {
        assignField('tela_principal', 'humedo', key);
        return;
      }
      if (haystack.includes('seco grado 2')) {
        assignField('tela_secundaria', 'seco', key);
        return;
      }
      if (haystack.includes('humedo grado 2')) {
        assignField('tela_secundaria', 'humedo', key);
        return;
      }
      if (haystack.includes('pickup tela principal')) {
        assignField('tela_principal', 'pickup', key);
        return;
      }
      if (haystack.includes('pickup de estampado') || haystack.includes('pickup estampado')) {
        assignField('estampado_bordado', 'pickup', key);
      }
    });

    return map;
  }, [fieldEntries]);

  const allowedFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    headerFields.forEach((entry) => keys.add(entry.key));
    Object.values(tableFieldMap).forEach((row) => {
      Object.values(row).forEach((key) => {
        if (key) keys.add(key);
      });
    });
    return keys;
  }, [headerFields, tableFieldMap]);

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

  const photoInputId = `${sectionName}-camera`;

  const renderField = (rowId: RowId, columnId: ColumnId) => {
    const fieldKey = tableFieldMap[rowId]?.[columnId];

    if (!fieldKey) {
      return <span className="text-muted">--</span>;
    }

    if (columnId === 'seco' || columnId === 'humedo') {
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
    }

    if (columnId === 'pickup' || columnId === 'tolerancia') {
      return (
        <>
          <Form.Control
            type="number"
            step="any"
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
    }

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
                  <th>Tipo</th>
                  <th>Seco</th>
                  <th>Húmedo</th>
                  <th>Tolerancia</th>
                  <th>Pickup</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {ROW_DEFINITIONS.map((row) => (
                  <tr key={row.id}>
                    <td className="fw-semibold text-start">{row.label}</td>
                    <td>{renderField(row.id, 'seco')}</td>
                    <td>{renderField(row.id, 'humedo')}</td>
                    <td>{renderField(row.id, 'tolerancia')}</td>
                    <td>{renderField(row.id, 'pickup')}</td>
                    <td>{renderField(row.id, 'observaciones')}</td>
                  </tr>
                ))}
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

export default FroteForm;