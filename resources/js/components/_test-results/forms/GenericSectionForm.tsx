import React, { useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import CameraCapture from '@/components/_test-results/CameraCapture';
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

const GenericSectionForm: React.FC<SectionFormProps> = ({ testId, sectionName, sectionData }) => {
  const config = SECTION_CONFIG[sectionName as SectionKey];
  const safeSection = (sectionData || {}) as SectionData;

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

  const handleDeleteSavedImage = (img: SavedImage) => {
    const identifier = img.id ? String(img.id) : img.path;
    if (!identifier) return;
    if (data.deleted_images.includes(identifier)) return;

    setData('deleted_images', [...data.deleted_images, identifier]);
  };

  const initialData: Record<string, string> = {};
  fieldEntries.forEach(([key, field]) => {
    const f = field as Field;
    initialData[key] = f.value ?? '';
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

  const hasFields = fieldEntries.length > 0;

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-4">
        <h5 className="mb-3">{config.title}</h5>

        <Form onSubmit={handleSubmit}>
          {hasFields && (
            <Row className="g-3">
              {fieldEntries.map(([key, field]) => {
                const f = field as Field;

                return (
                  <Col xs={6} sm={6} md={4} lg={3} key={key}>
                    <Form.Group controlId={`${sectionName}-${key}`}>
                      <Form.Label className="small">
                        {f?.display_name ?? f?.label ?? key}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={data.fields[key] ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        isInvalid={!!errors[`fields.${key}`]}
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
          )}

          {config.allowImages && (
            <>
              <hr className="my-4" />
              <h6 className="mb-2">Evidencia fotográfica</h6>
              <p className="text-muted small">
                Captura o adjunta fotografías para esta prueba.
              </p>

              <CameraCapture
                inputId={`${sectionName}-camera`}
                multiple={true}
                helperText="Toca el botón para abrir la cámara o seleccionar fotos desde tu dispositivo."
                error={errors.images as string | null}
                initialImages={safeSection.img ?? []}
                onFilesChange={handleFilesChange}
                onDeleteSavedImage={handleDeleteSavedImage}
              />
            </>
          )}

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
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GenericSectionForm;
