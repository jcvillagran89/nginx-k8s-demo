import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function RoleForm({ show, onHide, role = null }) {
  const isEdit = !!role?.id;

  const { data, setData, post, put, processing, errors, clearErrors } = useForm({
    name: '',
    description: '',
  });

  useEffect(() => {
    clearErrors();
    if (isEdit) {
      setData({
        name: role.name || '',
        description: role.description || '',
      });
    } else {
      setData({ name: '', description: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, show]);

  const canSubmit = !processing && Boolean(data.name?.trim());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      put(route('admin.roles.update', role.id), {
        onSuccess: () => onHide(),
        preserveScroll: true,
      });
    } else {
      post(route('admin.roles.store'), {
        onSuccess: () => onHide(),
        preserveScroll: true,
      });
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" scroll backdrop>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{isEdit ? 'Editar rol' : 'Nuevo rol'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                isInvalid={!!errors.name}
                placeholder="Nombre del rol"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Col>

            <Col xs={12}>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                isInvalid={!!errors.description}
                placeholder="Descripción breve del rol"
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Col>

            <Col xs={12} className="d-flex gap-2 justify-content-end pt-3">
              <Button variant="outline-secondary" onClick={onHide} disabled={processing}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit}>
                {isEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
