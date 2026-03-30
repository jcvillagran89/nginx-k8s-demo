import { FormEventHandler, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

import PageTitle from '@/components/PageTitle';
import { FileUploader, FileType } from '@/components/FileUploader';
import MainLayout from '@/layouts/MainLayout';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type ExternalTest = {
    id: number;
    lab: string | null;
    reported_at: string | null;
    provider: string | null;
    division: string | null;
    department: string | null;
    rejected_1: string | null;
    rejected_2: string | null;
    rejected_3: string | null;
    rejected_4: string | null;
    rejected_5: string | null;
    rejected_6: string | null;
    weigth: string | null;
    composition: string | null;
    status: string | null;
    status_purchases: string | null;
    released_at: string | null;
    reprocesses: string | null;
    action_taken: string | null;
    cloth_provider: string | null;
    generic_name: string | null;
    comercial_name: string | null;
    order_id: number | null;
    style_number: string | null;
};

type Paginated<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

const formatDate = (value: string | null) => {
    if (!value) return '--';
    const parts = value.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
};

const getDateParts = (value: string | null) => {
    if (!value) {
        return { year: '--', month: '--', day: '--' };
    }
    const parts = value.split('-');
    if (parts.length === 3) {
        const dayPart = parts[2]?.split(' ')[0] ?? parts[2];
        return { year: parts[0], month: parts[1], day: dayPart };
    }
    return { year: '--', month: '--', day: '--' };
};

const TestsImportIndex = () => {
    const { layoutColumns, externalTests, filters } = usePage().props as unknown as {
        layoutColumns: string[];
        externalTests: Paginated<ExternalTest>;
        filters?: {
            lab?: string;
            date_range?: string;
            status?: string;
            cloth_provider?: string;
            style_number?: string;
            miscellaneous?: string;
            per_page?: number | string;
        };
    };

    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileUpload = (files: FileType[]) => {
        setData('file', files?.[0] ?? null);
    };

    const [labFilter, setLabFilter] = useState(filters?.lab ?? '');
    const [dateRange, setDateRange] = useState(filters?.date_range ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [clothProviderFilter, setClothProviderFilter] = useState(filters?.cloth_provider ?? '');
    const [styleNumberFilter, setStyleNumberFilter] = useState(filters?.style_number ?? '');
    const [miscFilter, setMiscFilter] = useState(filters?.miscellaneous ?? '');
    const perPage = 100;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('external-tests.upload'), {
            forceFormData: true,
        });
    };

    const submitFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('external-tests.index'),
            {
                lab: labFilter || undefined,
                date_range: dateRange,
                status: statusFilter || undefined,
                cloth_provider: clothProviderFilter || undefined,
                style_number: styleNumberFilter || undefined,
                miscellaneous: miscFilter || undefined,
                per_page: perPage,
                page: 1,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setLabFilter('');
        setDateRange('');
        setStatusFilter('');
        setClothProviderFilter('');
        setStyleNumberFilter('');
        setMiscFilter('');
        router.get(
            route('external-tests.index'),
            {
                lab: '',
                date_range: '',
                status: '',
                cloth_provider: '',
                style_number: '',
                miscellaneous: '',
                per_page: perPage,
                page: 1,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
            <MainLayout>
                <PageTitle title="Análisis externos" subTitle="Carga de archivo Excel" />

            <Row className="g-3">
                <Col xs={12}>
                    <Card>
                        <CardBody>
                            <form onSubmit={submitFilters}>
                                <Row className="g-2 align-items-end">
                                    <Col md={2}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Laboratorio
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:flask" className="me-2 text-muted fs-6" />
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent"
                                                value={labFilter}
                                                onChange={(e) => setLabFilter(e.target.value)}
                                                placeholder="Laboratorio"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Fecha
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:calendar" className="me-2 text-muted fs-6" />
                                            <CustomFlatpickr
                                                className="form-control form-control-sm border-0 bg-transparent"
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
                                                    className="btn p-0 ms-2 d-flex align-items-center"
                                                    style={{ lineHeight: 1 }}
                                                    onClick={() => setDateRange('')}
                                                    title="Limpiar rango de fechas"
                                                >
                                                    <IconifyIcon icon="tabler:x" className="text-muted" style={{ fontSize: 18 }} />
                                                </button>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Status
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:adjustments" className="me-2 text-muted fs-6" />
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                placeholder="Status"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Proveedor
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:building-warehouse" className="me-2 text-muted fs-6" />
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent"
                                                value={clothProviderFilter}
                                                onChange={(e) => setClothProviderFilter(e.target.value)}
                                                placeholder="Proveedor"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Estilo
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:tag" className="me-2 text-muted fs-6" />
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent"
                                                value={styleNumberFilter}
                                                onChange={(e) => setStyleNumberFilter(e.target.value)}
                                                placeholder="Estilo"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <label className="text-muted mb-1" style={{ fontSize: 10 }}>
                                            Miscelaneos
                                        </label>
                                        <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-2 py-1">
                                            <IconifyIcon icon="tabler:note" className="me-2 text-muted fs-6" />
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent"
                                                value={miscFilter}
                                                onChange={(e) => setMiscFilter(e.target.value)}
                                                placeholder="Acciones o motivos de rechazos"
                                            />
                                        </div>
                                    </Col>
                                    <Col md="auto" className="d-flex gap-2 flex-wrap">
                                        <Button type="submit" variant="primary">
                                            Filtrar
                                        </Button>
                                        <Button type="button" variant="outline-secondary" onClick={clearFilters}>
                                            Limpiar
                                        </Button>
                                        <Button
                                            as="a"
                                            variant="success"
                                            href={route('external-tests.export', {
                                                lab: labFilter || undefined,
                                                date_range: dateRange,
                                                status: statusFilter || undefined,
                                                cloth_provider: clothProviderFilter || undefined,
                                                style_number: styleNumberFilter || undefined,
                                                miscellaneous: miscFilter || undefined,
                                            })}
                                        >
                                            Exportar a Excel
                                        </Button>
                                    </Col>
                                </Row>
                            </form>

                            <div className="table-responsive mt-3" style={{ maxHeight: '60vh', overflowX: 'auto', overflowY: 'auto' }}>
                                <table className="table table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ANO</th>
                                            <th>MES</th>
                                            <th>DIA</th>
                                            <th>PROV</th>
                                            <th>DIVISION</th>
                                            <th>DPTO</th>
                                            <th>LAB</th>
                                            <th>RECH GRAL</th>
                                            <th>RECH 1</th>
                                            <th>RECH 2</th>
                                            <th>RECH 3</th>
                                            <th>RECH 4</th>
                                            <th>RECH 5</th>
                                            <th>PESO</th>
                                            <th>COMPOSICION</th>
                                            <th>ESTATUS CALIDAD</th>
                                            <th>ESTATUS COMPRAS</th>
                                            <th>LIBERACION COMPRAS</th>
                                            <th>REPROCESO/REINGRESO</th>
                                            <th>ACCIONES/SEGUIMIENTO COMPRAS</th>
                                            <th>PROV TELA</th>
                                            <th>NOMBRE GENERICO</th>
                                            <th>NOMBRE COMERCIAL</th>
                                            <th>OC</th>
                                            <th>ESTILO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(externalTests?.data ?? []).length === 0 ? (
                                            <tr>
                                                <td colSpan={25} className="text-center text-muted">
                                                    No hay registros.
                                                </td>
                                            </tr>
                                        ) : (
                                            externalTests.data.map((item) => {
                                                const dateParts = getDateParts(item.reported_at);
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{dateParts.year}</td>
                                                        <td>{dateParts.month}</td>
                                                        <td>{dateParts.day}</td>
                                                        <td>{item.provider || '--'}</td>
                                                        <td>{item.division || '--'}</td>
                                                        <td>{item.department || '--'}</td>
                                                        <td>{item.lab || '--'}</td>
                                                        <td>{item.rejected_1 || '--'}</td>
                                                        <td>{item.rejected_2 || '--'}</td>
                                                        <td>{item.rejected_3 || '--'}</td>
                                                        <td>{item.rejected_4 || '--'}</td>
                                                        <td>{item.rejected_5 || '--'}</td>
                                                        <td>{item.rejected_6 || '--'}</td>
                                                        <td>{item.weigth || '--'}</td>
                                                        <td>{item.composition || '--'}</td>
                                                        <td>{item.status || '--'}</td>
                                                        <td>{item.status_purchases || '--'}</td>
                                                        <td>{formatDate(item.released_at)}</td>
                                                        <td>{item.reprocesses || '--'}</td>
                                                        <td>{item.action_taken || '--'}</td>
                                                        <td>{item.cloth_provider || '--'}</td>
                                                        <td>{item.generic_name || '--'}</td>
                                                        <td>{item.comercial_name || '--'}</td>
                                                        <td>{item.order_id ?? '--'}</td>
                                                        <td>{item.style_number || '--'}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                        <div className="card-footer d-flex justify-content-end">
                            <ul className="pagination mb-0">
                                {externalTests?.links?.map((link, i) => {
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

            <Row className="g-3 mt-2">
                <Col lg={8}>
                    <Card>
                        <CardHeader>
                            <h4 className="mb-0">Subir layout</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={submit}>
                                <FileUploader
                                    icon="ri:file-excel-2-line"
                                    text="Arrastra el archivo Excel aquí o haz clic para seleccionarlo."
                                    extraText="Formatos permitidos: .xlsx, .xls"
                                    onFileUpload={handleFileUpload}
                                />
                                {errors.file && <p className="text-danger mt-2 mb-0">{errors.file}</p>}
                                <div className="mt-3 d-flex justify-content-end">
                                    <Button type="submit" variant="primary" disabled={processing || !data.file}>
                                        {processing ? 'Cargando...' : 'Procesar archivo'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card>
                        <CardHeader>
                            <h4 className="mb-0">Columnas esperadas</h4>
                        </CardHeader>
                        <CardBody>
                            <ul className="mb-0">
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

export default TestsImportIndex;
