import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Row, Col, InputGroup, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

export default function ProviderForm({ show, onHide, provider = null }) {
    const isEdit = !!provider?.id;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        number: '',
        emails: [],
    });

    const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        clearErrors();

        if (isEdit) {
            setData({
                name: provider.name || '',
                number: provider.number || '',
                emails: provider.emails || [],
            });
        } else {
            setData({
                name: '',
                number: '',
                emails: [],
            });
        }
    }, [provider, show]);

    const addEmail = () => {
        if (!emailInput) return;

        if (!data.emails.includes(emailInput)) {
            setData('emails', [...data.emails, emailInput]);
        }

        setEmailInput('');
    };

    const removeEmail = (email) => {
        setData(
            'emails',
            data.emails.filter((e) => e !== email)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('providers.update', provider.id), {
                onSuccess: () => onHide(),
                preserveScroll: true,
            });
        } else {
            post(route('providers.store'), {
                onSuccess: () => {
                    onHide();
                    reset();
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" scroll backdrop>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{isEdit ? 'Editar proveedor' : 'Nuevo Proveedor'}</Offcanvas.Title>
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
                            />
                        </Col>

                        <Col xs={12}>
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type="text"
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                isInvalid={!!errors.number}
                            />
                        </Col>

                        {/* EMAIL INPUT */}
                        <Col xs={12}>
                            <Form.Label>Emails</Form.Label>

                            <InputGroup>
                                <Form.Control
                                    type="email"
                                    value={emailInput}
                                    placeholder="correo@proveedor.com"
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />

                                <Button type="button" onClick={addEmail}>
                                    <IconifyIcon icon="solar:add-circle-bold" />
                                </Button>
                            </InputGroup>
                        </Col>

                        {/* EMAIL LIST */}
                        <Col xs={12}>
                            <div className="d-flex flex-wrap gap-2">
                                {data.emails.map((email) => (
                                    <Badge
                                        bg="primary"
                                        key={email}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {email}

                                        <IconifyIcon
                                            icon="solar:close-circle-bold"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => removeEmail(email)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </Col>

                        <Col xs={12} className="d-flex gap-2 justify-content-end pt-3">
                            <Button variant="outline-secondary" onClick={onHide} disabled={processing}>
                                Cancelar
                            </Button>

                            <Button type="submit" variant="primary" disabled={processing}>
                                {isEdit ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
}