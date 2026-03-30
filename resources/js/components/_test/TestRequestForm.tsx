// react
import { useEffect, useMemo, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
// bootstrap
import { Button, Card, CardBody, CardHeader, Col, Form, ListGroup, Modal, Row, Table } from 'react-bootstrap';
// components
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import CameraCapture from '../_test-results/CameraCapture';
import { getImageUrl } from '@/utils/image';

type TestType = { id: number; name_es: string };

type TestRequest = {
    id: number;
    item: string;
    notes: string | null;
    style_id: number | null;
    style?: {
        description?: string | null;
        department?: { description: string };
        provider?: { name: string };
        external_tests?: ExternalTest[];
        internal_tests?: InternalTest[];
    };
    tests?: { test_type_id: number }[];
    is_development?: boolean;
    is_informative?: boolean;
    wash_type?: string | null;
    image_id?: number | string | null;
    image?: string | null;
};

type ExternalTest = {
    id: number;
    reported_at?: string | null;
    released_at?: string | null;
    lab?: string | null;
    status?: string | null;
    status_purchases?: string | null;
    provider?: string | null;
    cloth_provider?: string | null;
    division?: string | null;
    department?: string | null;
    color?: string | null;
    generic_name?: string | null;
    comercial_name?: string | null;
    composition?: string | null;
    action_taken?: string | null;
    rejected_1?: string | null;
    rejected_2?: string | null;
    rejected_3?: string | null;
    rejected_4?: string | null;
    rejected_5?: string | null;
    rejected_6?: string | null;
    reprocesses?: string | number | null;
    weigth?: string | number | null;
    style_number?: string | null;
};

type InternalTest = {
    id: number;
    prov?: string | null;
    division?: string | null;
    mes?: string | null;
    sku?: string | null;
    codigo_num?: string | null;
    codigo?: string | null;
    fecha?: string | null;
    hora?: string | null;
    fecha_termino_pruebas?: string | null;
    fecha_envio_reporte?: string | null;
    analista?: string | null;
    departamento?: string | null;
    confeccionista?: string | null;
    style_number?: string | null;
    descripcion?: string | null;
    imp_etiq?: string | null;
    solicitante?: string | null;
    comentarios?: string | null;
    estatus_lab_ccp?: string | null;
    clasificacion_rechazo?: string | null;
    motivo_rech_lab?: string | null;
    motivo_rech_lab2?: string | null;
    fecha_comite?: string | null;
    estatus_comite?: string | null;
    seguimiento_comite_calidad?: string | null;
    liberacion_compras?: string | null;
    fecha_lib_compras?: string | null;
    status_final?: string | null;
    c_dimen_3?: string | null;
    torsion_2?: string | null;
    apariencia_5?: string | null;
    peso_1?: string | null;
    frote_9?: string | null;
    pilling_4?: string | null;
    rasgado_6?: string | null;
    traccion_7?: string | null;
    lavado_acelerado_8?: string | null;
    densidad_10?: string | null;
    microscopio_11?: string | null;
    tipo_de_lavado?: string | null;
    temperatura_de_lavado?: string | null;
    tipo_de_secado?: string | null;
    planchado?: string | null;
    oc?: string | null;
    no_reporte?: string | null;
    reingreso?: string | null;
    estatus_de_calidad?: string | null;
    estatus_de_compras?: string | null;
    motivo_de_rechazo?: string | null;
    prov_tela?: string | null;
    composicion?: string | null;
    recibo_cedis?: string | null;
    prioridad?: string | null;
    fase?: string | null;
    peso_g_m2?: string | null;
};

type FormState = {
    item: string;
    test_type_ids: number[];
    notes: string;
    item_name: string;
    style_id: number | string;
    department_name: string;
    provider_name: string;
    is_development: boolean;
    is_informative: boolean;
    wash_type: string;
};

const WASH_TYPE_OPTIONS = ['1,II,B', '1,II,D', '2,II,B', '2,II,D'];

const TestRequestForm = () => {
    const { test_types, test_request } = usePage().props as unknown as {
        test_types: TestType[];
        test_request?: TestRequest | null;
    };

    const isEdit = !!test_request;

    const requiredTestTypeNames = useMemo(() => ['APARIENCIA', 'INICIAL'], []);
    const requiredNameSet = useMemo(
        () => new Set(requiredTestTypeNames.map((name) => name.trim().toLowerCase())),
        [requiredTestTypeNames],
    );

    const washTypeTestTypeNames = useMemo(
        () => ['APARIENCIA', 'TORSION', 'ESTABILIDAD EN TELA', 'ESTABILIDAD EN PRENDA'],
        [],
    );
    const washTypeNameSet = useMemo(
        () => new Set(washTypeTestTypeNames.map((name) => name.trim().toLowerCase())),
        [washTypeTestTypeNames],
    );

    const requiredTestTypeIds = useMemo(() => {
        if (!Array.isArray(test_types)) return [];
        return test_types
            .filter((tt) => requiredNameSet.has((tt.name_es ?? '').trim().toLowerCase()))
            .map((tt) => tt.id);
    }, [test_types, requiredNameSet]);

    const withRequiredTestTypes = useMemo(
        () => (ids: number[]) => Array.from(new Set([...ids, ...requiredTestTypeIds])),
        [requiredTestTypeIds],
    );

    const isRequiredTestType = useMemo(
        () => (id: number) => requiredTestTypeIds.includes(id),
        [requiredTestTypeIds],
    );

    const washTypeTestTypeIds = useMemo(() => {
        if (!Array.isArray(test_types)) return [];
        return test_types
            .filter((tt) => washTypeNameSet.has((tt.name_es ?? '').trim().toLowerCase()))
            .map((tt) => tt.id);
    }, [test_types, washTypeNameSet]);

    const initialSelectedTestTypeIds = (() => {
        if (!test_request) return withRequiredTestTypes([]);

        const testNames = test_request.test?.[0]?.results?.[0]?.test_names ?? [];

        if (!Array.isArray(testNames) || testNames.length === 0) {
            return withRequiredTestTypes([]);
        }

        const selectedIds = test_types
            .filter((tt) => testNames.includes(tt.name_es))
            .map((tt) => tt.id);

        return withRequiredTestTypes(selectedIds);
    })();

    const [loading, setLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);

    // 👇 estado extra para manejar imagen remota y posible nueva imagen
    const [imageUrl, setImageUrl] = useState<string | null>(
        getImageUrl(test_request?.image_id) ?? test_request?.image ?? null
    );
    const [imageLoadError, setImageLoadError] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const [form, setForm] = useState<FormState>({
        item: test_request?.item ?? '',
        test_type_ids: initialSelectedTestTypeIds,
        notes: test_request?.notes ?? '',
        item_name: test_request?.style?.description ?? '',
        style_id: test_request?.style_id ?? 1,
        department_name: test_request?.style?.department?.description ?? '',
        provider_name: test_request?.style?.provider?.name ?? '',
        is_development: !!test_request?.is_development,
        is_informative: !!test_request?.is_informative,
        wash_type: test_request?.wash_type ?? '',
    });

    const [externalTests, setExternalTests] = useState<ExternalTest[]>(
        test_request?.style?.external_tests ?? []
    );
    const [showExternalTestsModal, setShowExternalTestsModal] = useState(false);
    const [selectedExternalTestId, setSelectedExternalTestId] = useState<number | null>(null);
    const [internalTests, setInternalTests] = useState<InternalTest[]>(
        test_request?.style?.internal_tests ?? []
    );
    const [showInternalTestsModal, setShowInternalTestsModal] = useState(false);
    const [selectedInternalTestId, setSelectedInternalTestId] = useState<number | null>(null);

    const selectedExternalTest = useMemo(() => {
        if (!selectedExternalTestId) return null;
        return externalTests.find((test) => test.id === selectedExternalTestId) ?? null;
    }, [externalTests, selectedExternalTestId]);

    const selectedInternalTest = useMemo(() => {
        if (!selectedInternalTestId) return null;
        return internalTests.find((test) => test.id === selectedInternalTestId) ?? null;
    }, [internalTests, selectedInternalTestId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFlagChange = (
        name: 'is_development' | 'is_informative',
        checked: boolean
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: checked,
            ...(checked
                ? {
                    department_name: '',
                    provider_name: '',
                }
                : {}),
        }));
        if (checked) {
            setImageUrl(null);
            setImageLoadError(true);
            setNewImageFile(null);
            setExternalTests([]);
            setInternalTests([]);
        }
    };

    const handleCheckboxChange = (id: number) => {
        setForm((prev) => {
            if (isRequiredTestType(id)) {
                return prev.test_type_ids.includes(id)
                    ? prev
                    : { ...prev, test_type_ids: withRequiredTestTypes(prev.test_type_ids) };
            }
            const selected = prev.test_type_ids.includes(id)
                ? prev.test_type_ids.filter((typeId) => typeId !== id)
                : [...prev.test_type_ids, id];
            return { ...prev, test_type_ids: withRequiredTestTypes(selected) };
        });
    };

    const shouldShowWashType = useMemo(
        () => form.test_type_ids.some((id) => washTypeTestTypeIds.includes(id)),
        [form.test_type_ids, washTypeTestTypeIds],
    );

    useEffect(() => {
        if (!shouldShowWashType) {
            setForm((prev) => (prev.wash_type ? { ...prev, wash_type: '' } : prev));
        }
    }, [shouldShowWashType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        data.append('item', form.item);
        data.append('notes', form.notes ?? '');
        data.append('style_id', String(form.style_id || ''));
        data.append('is_development', form.is_development ? '1' : '0');
        data.append('is_informative', form.is_informative ? '1' : '0');
        data.append('wash_type', shouldShowWashType ? form.wash_type : '');

        const finalTestTypeIds = withRequiredTestTypes(form.test_type_ids);

        finalTestTypeIds.forEach((id, idx) => {
            data.append(`test_type_ids[${idx}]`, String(id));
        });

        if (newImageFile) {
            data.append('new_image', newImageFile);
        }

        const url = isEdit && test_request
            ? route('test.request.update', test_request.id)
            : route('test.request.store');

        const method = isEdit && test_request ? 'post' : 'post';
        if (isEdit && test_request) {
            data.append('_method', 'PUT');
        }

        router.post(url, data, {
            forceFormData: true,
            onFinish: () => setLoading(false),
            preserveScroll: true,
        });
    };

    const handleItemKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        if (form.is_development || form.is_informative) {
            return;
        }

        const value = form.item.trim();
        if (!value) return;

        try {
            setItemLoading(true);

            const { data } = await axios.get(route('items.show', value));

            let itemName: string = '';
            let styleId: number | string = '';
            let departmentName = '';
            let providerName = '';

            if (data.style) {
                itemName = data.style.description;
                styleId = data.style.id ?? '';
                departmentName = data.style.department?.description ?? '';
                providerName = data.style.provider?.name ?? '';
            } else {
                styleId = data.id ?? '';
                itemName = data.description;
                departmentName = data.department?.description ?? '';
                providerName = data.provider?.name ?? '';
            }

            const img = data.image ?? null;
            const externalTestsData: ExternalTest[] =
                data.style?.external_tests ?? data.external_tests ?? [];
            const internalTestsData: InternalTest[] =
                data.style?.internal_tests ?? data.internal_tests ?? [];

            setForm((prev) => ({
                ...prev,
                item_name: itemName ?? '',
                style_id: styleId,
                department_name: departmentName,
                provider_name: providerName,
            }));

            setNewImageFile(null);
            setImageLoadError(false);
            setImageUrl(img);
            setExternalTests(externalTestsData);
            setInternalTests(internalTestsData);
        } catch (error: any) {
            setForm((prev) => ({
                ...prev,
                item_name: 'NO ENCONTRADO / NUEVO',
                style_id: 1,
                department_name: '',
                provider_name: '',
            }));
            setImageUrl(null);
            setNewImageFile(null);
            setImageLoadError(false);
            setExternalTests([]);
            setInternalTests([]);

            console.error('Error buscando item', error?.response ?? error);
        } finally {
            setItemLoading(false);
        }
    };

    const handleCaptureFilesChange = (files: File[]) => {
        const file = files[0] ?? null;

        setNewImageFile(file);

        if (file) {
            setImageLoadError(false);
            setImageUrl(URL.createObjectURL(file));
        } else {
            setImageUrl(null);
        }
    };

    const handleImageError = () => {
        setImageLoadError(true);
        setImageUrl(null);
    };

    const formatExternalTestDate = (value?: string | null) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        return parsed.toLocaleDateString();
    };

    const formatInternalTestDate = (value?: string | null) => {
        if (!value) return '';
        const raw = value.split(' ')[0]?.split('T')[0] ?? value;
        const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        if (match) {
            const year = match[1];
            const monthIndex = Number(match[2]) - 1;
            const day = match[3];
            const monthLabel = months[monthIndex] ?? match[2];
            return `${day} ${monthLabel} ${year}`;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        const day = String(parsed.getDate()).padStart(2, '0');
        const monthLabel = months[parsed.getMonth()] ?? '';
        const year = parsed.getFullYear();
        return `${day} ${monthLabel} ${year}`;
    };

    const getExternalTestValue = (value?: string | number | null) => {
        if (value === null || value === undefined || value === '') return 'S/N';
        return String(value);
    };

    const isTruthy = (value?: string | number | null) => {
        if (value === null || value === undefined) return false;
        const normalized = String(value).trim().toLowerCase();
        return normalized === '1' || normalized === 'si' || normalized === 'sí' || normalized === 'true' || normalized === 'x';
    };

    const renderBool = (value?: string | number | null) => (isTruthy(value) ? '✓' : '');

    const handleOpenExternalTestsModal = () => {
        if (externalTests.length && !selectedExternalTestId) {
            setSelectedExternalTestId(externalTests[0].id);
        }
        setShowExternalTestsModal(true);
    };

    const handleOpenInternalTestsModal = () => {
        if (internalTests.length && !selectedInternalTestId) {
            setSelectedInternalTestId(internalTests[0].id);
        }
        setShowInternalTestsModal(true);
    };

    return (
        <Row className="justify-content-center">
            <Col lg={12}>
                <Card>
                    <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
                        <h5 className="mb-0">
                            {isEdit ? 'Editar solicitud' : 'Formulario de solicitud'}
                        </h5>
                        <Link href={route('test.request.index')}>
                            <Button variant="soft-secondary">
                                <IconifyIcon icon="tabler:arrow-left" className="me-1" /> Regresar
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            {/* hidden para style_id */}
                            <input type="hidden" name="style_id" value={form.style_id} />

                            <Row>
                                <Col lg={8}>
                                    <div className="mb-4 pb-3 border-bottom">
                                        <h6 className="text-uppercase text-muted mb-3">Tipo de solicitud</h6>
                                        <Row className="g-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <div className="d-flex flex-wrap gap-4 mt-2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id="flag-desarrollo"
                                                            label="Desarrollo"
                                                            checked={form.is_development}
                                                            onChange={(e) =>
                                                                handleFlagChange(
                                                                    'is_development',
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <Form.Check
                                                            type="checkbox"
                                                            id="flag-informativo"
                                                            label="Informativo"
                                                            checked={form.is_informative}
                                                            onChange={(e) =>
                                                                handleFlagChange(
                                                                    'is_informative',
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="mb-4 pb-3 border-bottom">
                                        <h6 className="text-uppercase text-muted mb-3">Datos de la muestra</h6>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>SKU o estilo</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="item"
                                                        value={form.item}
                                                        onChange={handleChange}
                                                        onKeyDown={handleItemKeyDown}
                                                        placeholder="Ej. 100577957"
                                                        required
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Presiona Enter para buscar el SKU o ESTILO.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                            {!(form.is_development || form.is_informative) && (
                                            <>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Nombre</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={
                                                                itemLoading
                                                                    ? 'Buscando...'
                                                                    : form.item_name
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Departamento</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={form.department_name}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Proveedor</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={form.provider_name}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Análisis externos</Form.Label>
                                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline-primary"
                                                                size="sm"
                                                                disabled={!externalTests.length}
                                                                onClick={handleOpenExternalTestsModal}
                                                            >
                                                                {externalTests.length
                                                                    ? `Ver (${externalTests.length})`
                                                                    : 'Sin registros'}
                                                            </Button>
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Histórico interno</Form.Label>
                                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline-primary"
                                                                size="sm"
                                                                disabled={!internalTests.length}
                                                                onClick={handleOpenInternalTestsModal}
                                                            >
                                                                {internalTests.length
                                                                    ? `Ver (${internalTests.length})`
                                                                    : 'Sin registros'}
                                                            </Button>
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                            )}
                                        </Row>
                                    </div>

                                    <div className="mb-4 pb-3 border-bottom">
                                        <h6 className="text-uppercase text-muted mb-3">Tipos de prueba</h6>
                                        <Row className="g-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Row className="g-2">
                                                        {test_types?.map((type) => (
                                                            <Col key={type.id} xs={12} sm={6} lg={4}>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    id={`test-type-${type.id}`}
                                                                    label={type.name_es}
                                                                    checked={form.test_type_ids.includes(
                                                                        type.id
                                                                    )}
                                                                    disabled={isRequiredTestType(type.id)}
                                                                    onChange={() =>
                                                                        handleCheckboxChange(type.id)
                                                                    }
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Form.Group>
                                            </Col>
                                            {shouldShowWashType && (
                                                <Col md={6} lg={4}>
                                                    <Form.Group>
                                                        <Form.Label>Tipo de lavado</Form.Label>
                                                        <Form.Select
                                                            name="wash_type"
                                                            value={form.wash_type}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="">Selecciona...</option>
                                                            {WASH_TYPE_OPTIONS.map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        <Form.Text className="text-muted">
                                                            Selecciona el método de lavado requerido.
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            )}
                                        </Row>
                                    </div>

                                    <div className="mb-4">
                                        <Row className="g-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Notas adicionales</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="notes"
                                                        rows={4}
                                                        value={form.notes}
                                                        onChange={handleChange}
                                                        placeholder="Información adicional sobre la muestra o solicitud..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4 border-top pt-3">
                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="bg-gradient"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <IconifyIcon
                                                        icon="tabler:loader"
                                                        className="me-2 spinner-border spinner-border-sm"
                                                    />
                                                    {isEdit
                                                        ? 'Actualizando...'
                                                        : 'Guardando...'}
                                                </>
                                            ) : (
                                                <>
                                                    <IconifyIcon
                                                        icon="tabler:device-floppy"
                                                        className="me-2"
                                                    />
                                                    {isEdit
                                                        ? 'Actualizar solicitud'
                                                        : 'Guardar solicitud'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Col>

                                {/* Columna derecha: recuadro de imagen / captura */}
                               <Col lg={4} className="mt-3 mt-lg-0">
                                    <div className="border rounded p-3 h-100 d-flex flex-column align-items-center justify-content-center bg-light-subtle">
                                        {!(form.is_development || form.is_informative) && imageUrl && !imageLoadError && (
                                            <>
                                                <Form.Label>Imagen de la muestra</Form.Label>
                                                <img
                                                    src={imageUrl}
                                                    alt="Imagen del artículo"
                                                    className="img-fluid mt-2"
                                                    style={{ maxHeight: '300px' }}
                                                    onError={handleImageError}
                                                />
                                            </>
                                        )}

                                        {!(form.is_development || form.is_informative) && (
                                            <>
                                                <Form.Label className="mb-2 mt-3">
                                                    Capturar / subir imagen
                                                </Form.Label>

                                                <CameraCapture
                                                    multiple={false}
                                                    helperText="Toca el botón para tomar o seleccionar una foto."
                                                    initialImages={[]}
                                                    onFilesChange={handleCaptureFilesChange}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Modal
                show={showExternalTestsModal}
                onHide={() => setShowExternalTestsModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Análisis externo(s) del estilo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {externalTests.length ? (
                        <Row className="g-3">
                            <Col lg={4}>
                                <div className="border rounded h-100">
                                    <ListGroup variant="flush">
                                        {externalTests.map((test) => {
                                            const isActive = selectedExternalTestId === test.id;
                                            return (
                                            <ListGroup.Item
                                                key={test.id}
                                                action
                                                active={isActive}
                                                onClick={() => setSelectedExternalTestId(test.id)}
                                            >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-semibold">#{test.id}</span>
                                                        <span className="small text-muted">
                                                            {test.status ?? 'S/N'}
                                                        </span>
                                                    </div>
                                                    <div className="small text-muted">
                                                        {formatExternalTestDate(test.reported_at) || 'Sin fecha'}
                                                    </div>
                                                    <div className="small text-muted">
                                                        {test.lab ?? 'Sin laboratorio'}
                                                    </div>
                                                </ListGroup.Item>
                                            );
                                        })}
                                    </ListGroup>
                                </div>
                            </Col>
                            <Col lg={8}>
                                {selectedExternalTest ? (
                                    <Table responsive bordered>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: 220 }}>ID</th>
                                                <td>#{selectedExternalTest.id}</td>
                                            </tr>
                                            <tr>
                                                <th>Estilo</th>
                                                <td>{getExternalTestValue(selectedExternalTest.style_number)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha reporte</th>
                                                <td>{getExternalTestValue(formatExternalTestDate(selectedExternalTest.reported_at))}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha liberacion</th>
                                                <td>{getExternalTestValue(formatExternalTestDate(selectedExternalTest.released_at))}</td>
                                            </tr>
                                            <tr>
                                                <th>Laboratorio</th>
                                                <td>{getExternalTestValue(selectedExternalTest.lab)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estado</th>
                                                <td>{getExternalTestValue(selectedExternalTest.status)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estado compras</th>
                                                <td>{getExternalTestValue(selectedExternalTest.status_purchases)}</td>
                                            </tr>
                                            <tr>
                                                <th>Proveedor</th>
                                                <td>{getExternalTestValue(selectedExternalTest.provider)}</td>
                                            </tr>
                                            <tr>
                                                <th>Proveedor tela</th>
                                                <td>{getExternalTestValue(selectedExternalTest.cloth_provider)}</td>
                                            </tr>
                                            <tr>
                                                <th>Division</th>
                                                <td>{getExternalTestValue(selectedExternalTest.division)}</td>
                                            </tr>
                                            <tr>
                                                <th>Departamento</th>
                                                <td>{getExternalTestValue(selectedExternalTest.department)}</td>
                                            </tr>
                                            <tr>
                                                <th>Color</th>
                                                <td>{getExternalTestValue(selectedExternalTest.color)}</td>
                                            </tr>
                                            <tr>
                                                <th>Nombre generico</th>
                                                <td>{getExternalTestValue(selectedExternalTest.generic_name)}</td>
                                            </tr>
                                            <tr>
                                                <th>Nombre comercial</th>
                                                <td>{getExternalTestValue(selectedExternalTest.comercial_name)}</td>
                                            </tr>
                                            <tr>
                                                <th>Composicion</th>
                                                <td>{getExternalTestValue(selectedExternalTest.composition)}</td>
                                            </tr>
                                            <tr>
                                                <th>Peso</th>
                                                <td>{getExternalTestValue(selectedExternalTest.weigth)}</td>
                                            </tr>
                                            <tr>
                                                <th>Reprocesos</th>
                                                <td>{getExternalTestValue(selectedExternalTest.reprocesses)}</td>
                                            </tr>
                                            <tr>
                                                <th>Accion tomada</th>
                                                <td>{getExternalTestValue(selectedExternalTest.action_taken)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 1</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_1)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 2</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_2)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 3</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_3)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 4</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_4)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 5</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_5)}</td>
                                            </tr>
                                            <tr>
                                                <th>Rechazo 6</th>
                                                <td>{getExternalTestValue(selectedExternalTest.rejected_6)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-muted">
                                        Selecciona un External Test para ver el detalle.
                                    </div>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <p className="mb-0 text-muted">
                            No hay External Tests registrados para este estilo.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExternalTestsModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showInternalTestsModal}
                onHide={() => setShowInternalTestsModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Histórico interno del estilo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {internalTests.length ? (
                        <Row className="g-3">
                            <Col lg={4}>
                                <div className="border rounded h-100">
                                    <ListGroup variant="flush">
                                        {internalTests.map((test) => {
                                            const isActive = selectedInternalTestId === test.id;
                                            return (
                                                <ListGroup.Item
                                                    key={test.id}
                                                    action
                                                    active={isActive}
                                                    onClick={() => setSelectedInternalTestId(test.id)}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-semibold">#{test.id}</span>
                                                        <span className="small text-muted">
                                                            {test.status_final ?? 'S/N'}
                                                        </span>
                                                    </div>
                                                    <div className="small text-muted">
                                                        {formatInternalTestDate(test.fecha) || 'Sin fecha'}
                                                    </div>
                                                    <div className="small text-muted">
                                                        {test.departamento ?? 'Sin departamento'}
                                                    </div>
                                                </ListGroup.Item>
                                            );
                                        })}
                                    </ListGroup>
                                </div>
                            </Col>
                            <Col lg={8}>
                                {selectedInternalTest ? (
                                    <Table responsive bordered>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: 240 }}>ID</th>
                                                <td>#{selectedInternalTest.id}</td>
                                            </tr>
                                            <tr>
                                                <th>Prov</th>
                                                <td>{getExternalTestValue(selectedInternalTest.prov)}</td>
                                            </tr>
                                            <tr>
                                                <th>Division</th>
                                                <td>{getExternalTestValue(selectedInternalTest.division)}</td>
                                            </tr>
                                            <tr>
                                                <th>Mes</th>
                                                <td>{getExternalTestValue(selectedInternalTest.mes)}</td>
                                            </tr>
                                            <tr>
                                                <th>SKU</th>
                                                <td>{getExternalTestValue(selectedInternalTest.sku)}</td>
                                            </tr>
                                            <tr>
                                                <th># Código</th>
                                                <td>{getExternalTestValue(selectedInternalTest.codigo_num)}</td>
                                            </tr>
                                            <tr>
                                                <th>Código</th>
                                                <td>{getExternalTestValue(selectedInternalTest.codigo)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.fecha))}</td>
                                            </tr>
                                            <tr>
                                                <th>Hora</th>
                                                <td>{getExternalTestValue(selectedInternalTest.hora)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha termino pruebas</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.fecha_termino_pruebas))}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha de envio de reporte</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.fecha_envio_reporte))}</td>
                                            </tr>
                                            <tr>
                                                <th>Analista</th>
                                                <td>{getExternalTestValue(selectedInternalTest.analista)}</td>
                                            </tr>
                                            <tr>
                                                <th>Departamento</th>
                                                <td>{getExternalTestValue(selectedInternalTest.departamento)}</td>
                                            </tr>
                                            <tr>
                                                <th>Confeccionista</th>
                                                <td>{getExternalTestValue(selectedInternalTest.confeccionista)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estilo</th>
                                                <td>{getExternalTestValue(selectedInternalTest.style_number)}</td>
                                            </tr>
                                            <tr>
                                                <th>Descripcion</th>
                                                <td>{getExternalTestValue(selectedInternalTest.descripcion)}</td>
                                            </tr>
                                            <tr>
                                                <th>Imp etiq</th>
                                                <td>{getExternalTestValue(selectedInternalTest.imp_etiq)}</td>
                                            </tr>
                                            <tr>
                                                <th>Solicitante</th>
                                                <td>{getExternalTestValue(selectedInternalTest.solicitante)}</td>
                                            </tr>
                                            <tr>
                                                <th>Comentarios</th>
                                                <td>{getExternalTestValue(selectedInternalTest.comentarios)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estatus Lab CCP</th>
                                                <td>{getExternalTestValue(selectedInternalTest.estatus_lab_ccp)}</td>
                                            </tr>
                                            <tr>
                                                <th>Clasificacion rechazo</th>
                                                <td>{getExternalTestValue(selectedInternalTest.clasificacion_rechazo)}</td>
                                            </tr>
                                            <tr>
                                                <th>Motivo rech lab</th>
                                                <td>{getExternalTestValue(selectedInternalTest.motivo_rech_lab)}</td>
                                            </tr>
                                            <tr>
                                                <th>Motivo rech lab 2</th>
                                                <td>{getExternalTestValue(selectedInternalTest.motivo_rech_lab2)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha comité</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.fecha_comite))}</td>
                                            </tr>
                                            <tr>
                                                <th>Estatus comité</th>
                                                <td>{getExternalTestValue(selectedInternalTest.estatus_comite)}</td>
                                            </tr>
                                            <tr>
                                                <th>Seguimiento comité calidad</th>
                                                <td>{getExternalTestValue(selectedInternalTest.seguimiento_comite_calidad)}</td>
                                            </tr>
                                            <tr>
                                                <th>Liberacion compras</th>
                                                <td>{getExternalTestValue(selectedInternalTest.liberacion_compras)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fecha lib compras</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.fecha_lib_compras))}</td>
                                            </tr>
                                            <tr>
                                                <th>Status final</th>
                                                <td>{getExternalTestValue(selectedInternalTest.status_final)}</td>
                                            </tr>
                                            <tr>
                                                <th>3 C Dimen</th>
                                                <td>{renderBool(selectedInternalTest.c_dimen_3)}</td>
                                            </tr>
                                            <tr>
                                                <th>2 Torsion</th>
                                                <td>{renderBool(selectedInternalTest.torsion_2)}</td>
                                            </tr>
                                            <tr>
                                                <th>5 Apariencia</th>
                                                <td>{renderBool(selectedInternalTest.apariencia_5)}</td>
                                            </tr>
                                            <tr>
                                                <th>1 Peso</th>
                                                <td>{renderBool(selectedInternalTest.peso_1)}</td>
                                            </tr>
                                            <tr>
                                                <th>9 Frote</th>
                                                <td>{renderBool(selectedInternalTest.frote_9)}</td>
                                            </tr>
                                            <tr>
                                                <th>4 Pilling</th>
                                                <td>{renderBool(selectedInternalTest.pilling_4)}</td>
                                            </tr>
                                            <tr>
                                                <th>6 Rasgado</th>
                                                <td>{renderBool(selectedInternalTest.rasgado_6)}</td>
                                            </tr>
                                            <tr>
                                                <th>7 Traccion</th>
                                                <td>{renderBool(selectedInternalTest.traccion_7)}</td>
                                            </tr>
                                            <tr>
                                                <th>8 Lavado acelerado</th>
                                                <td>{renderBool(selectedInternalTest.lavado_acelerado_8)}</td>
                                            </tr>
                                            <tr>
                                                <th>10 Densidad</th>
                                                <td>{renderBool(selectedInternalTest.densidad_10)}</td>
                                            </tr>
                                            <tr>
                                                <th>11 Microscopio</th>
                                                <td>{renderBool(selectedInternalTest.microscopio_11)}</td>
                                            </tr>
                                            <tr>
                                                <th>Tipo de lavado</th>
                                                <td>{getExternalTestValue(selectedInternalTest.tipo_de_lavado)}</td>
                                            </tr>
                                            <tr>
                                                <th>Temperatura de lavado</th>
                                                <td>{getExternalTestValue(selectedInternalTest.temperatura_de_lavado)}</td>
                                            </tr>
                                            <tr>
                                                <th>Tipo de secado</th>
                                                <td>{getExternalTestValue(selectedInternalTest.tipo_de_secado)}</td>
                                            </tr>
                                            <tr>
                                                <th>Planchado</th>
                                                <td>{getExternalTestValue(selectedInternalTest.planchado)}</td>
                                            </tr>
                                            <tr>
                                                <th>OC</th>
                                                <td>{getExternalTestValue(selectedInternalTest.oc)}</td>
                                            </tr>
                                            <tr>
                                                <th>No. Reporte</th>
                                                <td>{getExternalTestValue(selectedInternalTest.no_reporte)}</td>
                                            </tr>
                                            <tr>
                                                <th>Reingreso</th>
                                                <td>{getExternalTestValue(selectedInternalTest.reingreso)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estatus de calidad</th>
                                                <td>{getExternalTestValue(selectedInternalTest.estatus_de_calidad)}</td>
                                            </tr>
                                            <tr>
                                                <th>Estatus de compras</th>
                                                <td>{getExternalTestValue(selectedInternalTest.estatus_de_compras)}</td>
                                            </tr>
                                            <tr>
                                                <th>Motivo de rechazo</th>
                                                <td>{getExternalTestValue(selectedInternalTest.motivo_de_rechazo)}</td>
                                            </tr>
                                            <tr>
                                                <th>Prov tela</th>
                                                <td>{getExternalTestValue(selectedInternalTest.prov_tela)}</td>
                                            </tr>
                                            <tr>
                                                <th>Composición</th>
                                                <td>{getExternalTestValue(selectedInternalTest.composicion)}</td>
                                            </tr>
                                            <tr>
                                                <th>Recibo CEDIS</th>
                                                <td>{getExternalTestValue(formatInternalTestDate(selectedInternalTest.recibo_cedis))}</td>
                                            </tr>
                                            <tr>
                                                <th>Prioridad</th>
                                                <td>{getExternalTestValue(selectedInternalTest.prioridad)}</td>
                                            </tr>
                                            <tr>
                                                <th>Fase</th>
                                                <td>{getExternalTestValue(selectedInternalTest.fase)}</td>
                                            </tr>
                                            <tr>
                                                <th>Peso (g/m2)</th>
                                                <td>{getExternalTestValue(selectedInternalTest.peso_g_m2)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-muted">
                                        Selecciona un registro para ver el detalle.
                                    </div>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <p className="mb-0 text-muted">
                            No hay histórico interno registrado para este estilo.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInternalTestsModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default TestRequestForm;
