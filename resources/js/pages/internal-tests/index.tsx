import { FormEventHandler, useLayoutEffect, useRef, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

import PageTitle from '@/components/PageTitle';
import { FileUploader, FileType } from '@/components/FileUploader';
import MainLayout from '@/layouts/MainLayout';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type InternalTest = {
    id: number;
    prov: string | null;
    division: string | null;
    mes: string | null;
    sku: string | null;
    codigo_num: string | null;
    codigo: string | null;
    fecha: string | null;
    hora: string | null;
    fecha_termino_pruebas: string | null;
    fecha_envio_reporte: string | null;
    analista: string | null;
    departamento: string | null;
    confeccionista: string | null;
    style_number: string | null;
    descripcion: string | null;
    imp_etiq: string | null;
    solicitante: string | null;
    comentarios: string | null;
    estatus_lab_ccp: string | null;
    clasificacion_rechazo: string | null;
    motivo_rech_lab: string | null;
    motivo_rech_lab2: string | null;
    fecha_comite: string | null;
    estatus_comite: string | null;
    seguimiento_comite_calidad: string | null;
    liberacion_compras: string | null;
    fecha_lib_compras: string | null;
    status_final: string | null;
    c_dimen_3: string | null;
    torsion_2: string | null;
    apariencia_5: string | null;
    peso_1: string | null;
    frote_9: string | null;
    pilling_4: string | null;
    rasgado_6: string | null;
    traccion_7: string | null;
    lavado_acelerado_8: string | null;
    densidad_10: string | null;
    microscopio_11: string | null;
    tipo_de_lavado: string | null;
    temperatura_de_lavado: string | null;
    tipo_de_secado: string | null;
    planchado: string | null;
    oc: string | null;
    no_reporte: string | null;
    reingreso: string | null;
    estatus_de_calidad: string | null;
    estatus_de_compras: string | null;
    motivo_de_rechazo: string | null;
    prov_tela: string | null;
    composicion: string | null;
    recibo_cedis: string | null;
    prioridad: string | null;
    fase: string | null;
    peso_g_m2: string | null;
};

type Paginated<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatDate = (value: string | null) => {
    if (!value) return '--';
    const raw = value.split(' ')[0]?.split('T')[0] ?? value;
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        const year = match[1];
        const monthIndex = Number(match[2]) - 1;
        const day = match[3];
        const monthLabel = MONTHS[monthIndex] ?? match[2];
        return `${day} ${monthLabel} ${year}`;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const day = String(parsed.getDate()).padStart(2, '0');
    const monthLabel = MONTHS[parsed.getMonth()] ?? '';
    const year = parsed.getFullYear();
    return `${day} ${monthLabel} ${year}`;
};

const getValue = (value: string | null) => value || '--';
const isTruthy = (value: string | null) => {
    if (value === null || value === undefined) return false;
    const normalized = String(value).trim().toLowerCase();
    return normalized === '1' || normalized === 'si' || normalized === 'sí' || normalized === 'true' || normalized === 'x';
};
const renderBool = (value: string | null) =>
    isTruthy(value) ? <span className="text-success fw-semibold">✓</span> : '';

type FilterFieldProps = {
    label: string;
    icon: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
};

const FilterField = ({ label, icon, value, placeholder, onChange }: FilterFieldProps) => (
    <div className="d-flex flex-column gap-1">
        <label className="text-uppercase text-muted small" style={{ letterSpacing: '0.06em' }}>
            {label}
        </label>
        <div className="d-flex align-items-center gap-2 rounded-3 border bg-body px-2 py-1">
            <IconifyIcon icon={icon} className="text-muted" style={{ fontSize: 18 }} />
            <input
                className="form-control form-control-sm border-0 bg-transparent p-0"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const InternalTestsIndex = () => {
    const [stickyWidths, setStickyWidths] = useState({
        prov: 120,
        division: 140,
        mes: 90,
        sku: 130,
    });
    const provHeaderRef = useRef<HTMLTableCellElement | null>(null);
    const divisionHeaderRef = useRef<HTMLTableCellElement | null>(null);
    const mesHeaderRef = useRef<HTMLTableCellElement | null>(null);
    const skuHeaderRef = useRef<HTMLTableCellElement | null>(null);
    const stickyOffsets = {
        prov: 0,
        division: stickyWidths.prov,
        mes: stickyWidths.prov + stickyWidths.division,
        sku: stickyWidths.prov + stickyWidths.division + stickyWidths.mes,
    };
    const buildStickyHeaderStyle = (left: number, isLast = false): React.CSSProperties => ({
        position: 'sticky',
        left,
        top: 0,
        zIndex: 16,
        backgroundColor: '#fff',
        backgroundClip: 'padding-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        boxShadow: isLast
            ? '2px 0 0 rgba(0, 0, 0, 0.06), 0 1px 0 rgba(0, 0, 0, 0.08)'
            : '0 1px 0 rgba(0, 0, 0, 0.08)',
        borderRight: isLast ? '1px solid var(--bs-border-color)' : undefined,
    });
    const buildStickyCellStyle = (left: number, isLast = false): React.CSSProperties => ({
        position: 'sticky',
        left,
        zIndex: 11,
        backgroundColor: '#fff',
        backgroundClip: 'padding-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        boxShadow: isLast ? '2px 0 0 rgba(0, 0, 0, 0.06)' : undefined,
        borderRight: isLast ? '1px solid var(--bs-border-color)' : undefined,
    });
    const { layoutColumns, internalTests, filters } = usePage().props as unknown as {
        layoutColumns: string[];
        internalTests: Paginated<InternalTest>;
        filters?: {
            codigo?: string;
            date_range?: string;
            style_number?: string;
            department?: string;
            status_final?: string;
            per_page?: number | string;
        };
    };

    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileUpload = (files: FileType[]) => {
        setData('file', files?.[0] ?? null);
    };

    const [codigoFilter, setCodigoFilter] = useState(filters?.codigo ?? '');
    const [dateRange, setDateRange] = useState(filters?.date_range ?? '');
    const [styleNumberFilter, setStyleNumberFilter] = useState(filters?.style_number ?? '');
    const [departmentFilter, setDepartmentFilter] = useState(filters?.department ?? '');
    const [statusFinalFilter, setStatusFinalFilter] = useState(filters?.status_final ?? '');
    const [tableZoom, setTableZoom] = useState(0.6);
    const perPage = 100;
    const zoomStep = 0.1;
    const minZoom = 0.4;
    const maxZoom = 1.2;
    const handleZoomOut = () => setTableZoom((prev) => Math.max(minZoom, Number((prev - zoomStep).toFixed(2))));
    const handleZoomIn = () => setTableZoom((prev) => Math.min(maxZoom, Number((prev + zoomStep).toFixed(2))));
    const tableHeaderStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        zIndex: 17,
        backgroundColor: '#fff',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.08)',
    };
    const resultsCount = internalTests?.data?.length ?? 0;
    const activeFilters = [codigoFilter, dateRange, styleNumberFilter, departmentFilter, statusFinalFilter].filter(
        (value) => value && String(value).trim().length > 0
    ).length;
    const hasActiveFilters = activeFilters > 0;

    useLayoutEffect(() => {
        const measureStickyWidths = () => {
            setStickyWidths((prev) => {
                const next = {
                    prov: provHeaderRef.current?.offsetWidth ?? prev.prov,
                    division: divisionHeaderRef.current?.offsetWidth ?? prev.division,
                    mes: mesHeaderRef.current?.offsetWidth ?? prev.mes,
                    sku: skuHeaderRef.current?.offsetWidth ?? prev.sku,
                };
                const unchanged =
                    next.prov === prev.prov &&
                    next.division === prev.division &&
                    next.mes === prev.mes &&
                    next.sku === prev.sku;
                return unchanged ? prev : next;
            });
        };

        measureStickyWidths();
        window.addEventListener('resize', measureStickyWidths);
        return () => window.removeEventListener('resize', measureStickyWidths);
    }, [tableZoom, internalTests?.data?.length]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('internal-tests.upload'), {
            forceFormData: true,
        });
    };

    const submitFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('internal-tests.index'),
            {
                codigo: codigoFilter || undefined,
                date_range: dateRange,
                style_number: styleNumberFilter || undefined,
                department: departmentFilter || undefined,
                status_final: statusFinalFilter || undefined,
                per_page: perPage,
                page: 1,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setCodigoFilter('');
        setDateRange('');
        setStyleNumberFilter('');
        setDepartmentFilter('');
        setStatusFinalFilter('');
        router.get(
            route('internal-tests.index'),
            {
                codigo: '',
                date_range: '',
                style_number: '',
                department: '',
                status_final: '',
                per_page: perPage,
                page: 1,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <MainLayout>
            <PageTitle title="Histórico interno" subTitle="Carga de archivo Excel" />

            <Row className="g-2">
                <Col xs={12}>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-body d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
                            <div>
                                <div className="text-uppercase text-muted small" style={{ letterSpacing: '0.08em' }}>
                                    Histórico interno
                                </div>
                                <h4 className="mb-0">Registros de pruebas</h4>
                            </div>
                        </CardHeader>
                        <CardBody className="d-flex flex-column gap-2">
                            <form onSubmit={submitFilters}>
                                <Row className="g-2 align-items-end">
                                    <Col md={2}>
                                        <FilterField
                                            label="Código"
                                            icon="tabler:hash"
                                            value={codigoFilter}
                                            onChange={setCodigoFilter}
                                            placeholder="Código"
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex flex-column gap-1">
                                            <label className="text-uppercase text-muted small" style={{ letterSpacing: '0.06em' }}>
                                                Fecha
                                            </label>
                                            <div className="d-flex align-items-center gap-2 rounded-3 border bg-body px-2 py-1">
                                                <IconifyIcon icon="tabler:calendar" className="text-muted" style={{ fontSize: 18 }} />
                                                <CustomFlatpickr
                                                    className="form-control form-control-sm border-0 bg-transparent p-0"
                                                    placeholder="Rango de fechas"
                                                    options={{
                                                        mode: 'range',
                                                        enableTime: false,
                                                        dateFormat: 'd/m/Y',
                                                        closeOnSelect: false,
                                                    }}
                                                    value={dateRange || undefined}
                                                    onChange={(_dates, dateStr) => setDateRange(dateStr)}
                                                />
                                                {dateRange && (
                                                    <button
                                                        type="button"
                                                        className="btn p-0 ms-1 d-flex align-items-center"
                                                        style={{ lineHeight: 1 }}
                                                        onClick={() => setDateRange('')}
                                                        title="Limpiar rango de fechas"
                                                    >
                                                        <IconifyIcon icon="tabler:x" className="text-muted" style={{ fontSize: 18 }} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <FilterField
                                            label="Estilo"
                                            icon="tabler:tag"
                                            value={styleNumberFilter}
                                            onChange={setStyleNumberFilter}
                                            placeholder="Estilo"
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FilterField
                                            label="Departamento"
                                            icon="tabler:building"
                                            value={departmentFilter}
                                            onChange={setDepartmentFilter}
                                            placeholder="Departamento"
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FilterField
                                            label="Estatus final"
                                            icon="tabler:status-change"
                                            value={statusFinalFilter}
                                            onChange={setStatusFinalFilter}
                                            placeholder="Estatus final"
                                        />
                                    </Col>
                                    <Col md="auto" className="d-flex gap-2 flex-wrap">
                                        <Button type="submit" variant="primary">
                                            Aplicar filtros
                                        </Button>
                                        <Button type="button" variant="outline-secondary" onClick={clearFilters}>
                                            Limpiar
                                        </Button>
                                        <Button
                                            as="a"
                                            variant="success"
                                            href={route('internal-tests.export', {
                                                codigo: codigoFilter || undefined,
                                                date_range: dateRange,
                                                style_number: styleNumberFilter || undefined,
                                                department: departmentFilter || undefined,
                                                status_final: statusFinalFilter || undefined,
                                            })}
                                        >
                                            Exportar a Excel
                                        </Button>
                                    </Col>
                                </Row>
                            </form>

                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                <span className="badge text-bg-light border">{resultsCount} registros</span>
                                {hasActiveFilters && (
                                    <span className="badge text-bg-primary">{activeFilters} filtros activos</span>
                                )}
                            </div>
                                <div className="btn-group btn-group-sm" role="group" aria-label="Zoom de tabla">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleZoomOut}
                                        disabled={tableZoom <= minZoom}
                                        title="Zoom out"
                                        aria-label="Zoom out"
                                    >
                                        <IconifyIcon icon="tabler:zoom-out" />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleZoomIn}
                                        disabled={tableZoom >= maxZoom}
                                        title="Zoom in"
                                        aria-label="Zoom in"
                                    >
                                        <IconifyIcon icon="tabler:zoom-in" />
                                    </button>
                                </div>
                            </div>

                            <div
                                className="table-responsive border rounded-3"
                                style={{
                                    maxHeight: '60vh',
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                    fontSize: `${tableZoom}rem`,
                                }}
                            >
                                <table
                                    className="table table-sm table-hover table-nowrap mb-0"
                                    style={{ borderCollapse: 'separate', borderSpacing: 0 }}
                                >
                                    <thead className="table-light" style={tableHeaderStyle}>
                                        <tr>
                                            <th ref={provHeaderRef} style={buildStickyHeaderStyle(stickyOffsets.prov)}>
                                                Prov
                                            </th>
                                            <th ref={divisionHeaderRef} style={buildStickyHeaderStyle(stickyOffsets.division)}>
                                                DIVISION
                                            </th>
                                            <th ref={mesHeaderRef} style={buildStickyHeaderStyle(stickyOffsets.mes)}>
                                                MES
                                            </th>
                                            <th ref={skuHeaderRef} style={buildStickyHeaderStyle(stickyOffsets.sku, true)}>
                                                SKU
                                            </th>
                                            <th># CODIGO</th>
                                            <th>CODIGO</th>
                                            <th>FECHA</th>
                                            <th>HORA</th>
                                            <th>FECHA TERMINO PRUEBAS</th>
                                            <th>FECHA DE ENVIO DE REPORTE</th>
                                            <th>ANALISTA</th>
                                            <th>DEPARTAMENTO</th>
                                            <th>CONFECCIONISTA</th>
                                            <th>ESTILO</th>
                                            <th>DESCRIPCION</th>
                                            <th>IMP ETIQ</th>
                                            <th>SOLICITANTE</th>
                                            <th>COMENTARIOS</th>
                                            <th>Estatus Lab CCP</th>
                                            <th>Clasificacion Rechazo</th>
                                            <th>Motivo Rech Lab</th>
                                            <th>Motivo Rech Lab2</th>
                                            <th>Fecha Comité</th>
                                            <th>Estatus Comité</th>
                                            <th>SEGUIMIENTO COMITÉ CALIDAD</th>
                                            <th>Liberacion Compras</th>
                                            <th>FECHA LIB COMPRAS</th>
                                            <th>Status Final</th>
                                            <th className="text-center">3 C DIMEN</th>
                                            <th className="text-center">2 TORSION</th>
                                            <th className="text-center">5 APARIENCIA</th>
                                            <th className="text-center">1 PESO</th>
                                            <th className="text-center">9 FROTE</th>
                                            <th className="text-center">4 PILLING</th>
                                            <th className="text-center">6 RASGADO</th>
                                            <th className="text-center">7 TRACCION</th>
                                            <th className="text-center">8 LAVADO ACELERADO</th>
                                            <th className="text-center">10 DENSIDAD</th>
                                            <th className="text-center">11 MICROSCOPIO</th>
                                            <th>TIPO DE LAVADO</th>
                                            <th>TEMPERATURA DE LAVADO</th>
                                            <th>TIPO DE SECADO</th>
                                            <th>PLANCHADO</th>
                                            <th>OC</th>
                                            <th>No. Reporte</th>
                                            <th>Reingreso</th>
                                            <th>Estatus de Calidad</th>
                                            <th>Estatus de Compras</th>
                                            <th>Motivo de Rechazo</th>
                                            <th>PROV TELA</th>
                                            <th>COMPOSICION</th>
                                            <th>RECIBO CEDIS</th>
                                            <th>PRIORIDAD</th>
                                            <th>FASE</th>
                                            <th>Peso (g/m2)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(internalTests?.data ?? []).length === 0 ? (
                                            <tr>
                                                <td colSpan={55} className="text-center text-muted">
                                                    No hay registros.
                                                </td>
                                            </tr>
                                        ) : (
                                            internalTests.data.map((item) => (
                                                <tr key={item.id}>
                                                    <td style={buildStickyCellStyle(stickyOffsets.prov)} title={item.prov ?? ''}>
                                                        {getValue(item.prov)}
                                                    </td>
                                                    <td style={buildStickyCellStyle(stickyOffsets.division)}>{getValue(item.division)}</td>
                                                    <td style={buildStickyCellStyle(stickyOffsets.mes)}>{getValue(item.mes)}</td>
                                                    <td style={buildStickyCellStyle(stickyOffsets.sku, true)}>{getValue(item.sku)}</td>
                                                    <td>{getValue(item.codigo_num)}</td>
                                                    <td>{getValue(item.codigo)}</td>
                                                    <td>{formatDate(item.fecha)}</td>
                                                    <td>{getValue(item.hora)}</td>
                                                    <td>{formatDate(item.fecha_termino_pruebas)}</td>
                                                    <td>{formatDate(item.fecha_envio_reporte)}</td>
                                                    <td>{getValue(item.analista)}</td>
                                                    <td>{getValue(item.departamento)}</td>
                                                    <td>{getValue(item.confeccionista)}</td>
                                                    <td>{getValue(item.style_number)}</td>
                                                    <td>{getValue(item.descripcion)}</td>
                                                    <td>{getValue(item.imp_etiq)}</td>
                                                    <td>{getValue(item.solicitante)}</td>
                                                    <td>{getValue(item.comentarios)}</td>
                                                    <td>{getValue(item.estatus_lab_ccp)}</td>
                                                    <td>{getValue(item.clasificacion_rechazo)}</td>
                                                    <td>{getValue(item.motivo_rech_lab)}</td>
                                                    <td>{getValue(item.motivo_rech_lab2)}</td>
                                                    <td>{formatDate(item.fecha_comite)}</td>
                                                    <td>{getValue(item.estatus_comite)}</td>
                                                    <td>{getValue(item.seguimiento_comite_calidad)}</td>
                                                    <td>{getValue(item.liberacion_compras)}</td>
                                                    <td>{formatDate(item.fecha_lib_compras)}</td>
                                                    <td>{getValue(item.status_final)}</td>
                                                    <td className="text-center">{renderBool(item.c_dimen_3)}</td>
                                                    <td className="text-center">{renderBool(item.torsion_2)}</td>
                                                    <td className="text-center">{renderBool(item.apariencia_5)}</td>
                                                    <td className="text-center">{renderBool(item.peso_1)}</td>
                                                    <td className="text-center">{renderBool(item.frote_9)}</td>
                                                    <td className="text-center">{renderBool(item.pilling_4)}</td>
                                                    <td className="text-center">{renderBool(item.rasgado_6)}</td>
                                                    <td className="text-center">{renderBool(item.traccion_7)}</td>
                                                    <td className="text-center">{renderBool(item.lavado_acelerado_8)}</td>
                                                    <td className="text-center">{renderBool(item.densidad_10)}</td>
                                                    <td className="text-center">{renderBool(item.microscopio_11)}</td>
                                                    <td>{getValue(item.tipo_de_lavado)}</td>
                                                    <td>{getValue(item.temperatura_de_lavado)}</td>
                                                    <td>{getValue(item.tipo_de_secado)}</td>
                                                    <td>{getValue(item.planchado)}</td>
                                                    <td>{getValue(item.oc)}</td>
                                                    <td>{getValue(item.no_reporte)}</td>
                                                    <td>{getValue(item.reingreso)}</td>
                                                    <td>{getValue(item.estatus_de_calidad)}</td>
                                                    <td>{getValue(item.estatus_de_compras)}</td>
                                                    <td>{getValue(item.motivo_de_rechazo)}</td>
                                                    <td>{getValue(item.prov_tela)}</td>
                                                    <td>{getValue(item.composicion)}</td>
                                                    <td>{formatDate(item.recibo_cedis)}</td>
                                                    <td>{getValue(item.prioridad)}</td>
                                                    <td>{getValue(item.fase)}</td>
                                                    <td>{getValue(item.peso_g_m2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                        <div className="card-footer d-flex justify-content-end bg-body">
                            <ul className="pagination mb-0">
                                {internalTests?.links?.map((link, i) => {
                                    let label = link.label;

                                    if (label.includes('Previous')) label = '&laquo;';
                                    if (label.includes('Next')) label = '&raquo;';

                                    return (
                                        <li
                                            key={i}
                                            className={[
                                                'page-item',
                                                link.active ? 'active' : '',
                                                !link.url ? 'disabled' : '',
                                            ].join(' ')}
                                        >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className="page-link"
                                                    preserveState
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            ) : (
                                                <span className="page-link" dangerouslySetInnerHTML={{ __html: label }} />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="g-2 mt-2">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <CardHeader className="bg-body d-flex align-items-center justify-content-between py-2">
                            <div>
                                <div className="text-uppercase text-muted small" style={{ letterSpacing: '0.08em' }}>
                                    Carga
                                </div>
                                <h4 className="mb-0">Subir layout</h4>
                            </div>
                            <IconifyIcon icon="tabler:upload" className="text-muted" style={{ fontSize: 22 }} />
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={submit}>
                                <FileUploader
                                    icon="ri:file-excel-2-line"
                                    text="Arrastra el archivo Excel aquí o haz clic para seleccionarlo."
                                    extraText="Formatos permitidos: .xlsx, .xls, .xlsm"
                                    onFileUpload={handleFileUpload}
                                />
                                {errors.file && <p className="text-danger mt-2 mb-0">{errors.file}</p>}
                                <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span className="text-muted small">
                                        Usa el layout oficial para que las columnas se reconozcan automáticamente.
                                    </span>
                                    <Button type="submit" variant="primary" disabled={processing || !data.file}>
                                        {processing ? 'Cargando...' : 'Procesar archivo'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <CardHeader className="bg-body d-flex align-items-center justify-content-between py-2">
                            <div>
                                <div className="text-uppercase text-muted small" style={{ letterSpacing: '0.08em' }}>
                                    Referencia
                                </div>
                                <h4 className="mb-0">Columnas esperadas</h4>
                            </div>
                            <IconifyIcon icon="tabler:list-details" className="text-muted" style={{ fontSize: 22 }} />
                        </CardHeader>
                        <CardBody>
                            <ul className="mb-0 small" style={{ columnCount: 2, columnGap: '1.5rem' }}>
                                {layoutColumns?.map((column) => (
                                    <li key={column}>{column}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};

export default InternalTestsIndex;
