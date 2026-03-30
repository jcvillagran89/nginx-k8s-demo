import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageTitle from '@/components/PageTitle';

import MainLayout from '@/layouts/MainLayout';
import { Col, Row } from 'react-bootstrap';

const InputmaskPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Form Inputmask" subTitle="Forms" />
            <ComponentContainerCard title="Form Inputmask" description={<>A Java-Script Plugin to make masks on form fields and HTML elements.</>}>
                <Row>
                    <Col md={6}>
                        <form action="">
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="00/00/0000" />
                                <span className="fs-13 text-muted">e.g &quot;DD/MM/YYYY&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;00/00/0000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Hour</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="00:00:00" />
                                <span className="fs-13 text-muted">e.g &quot;HH:MM:SS&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;00:00:00&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date &amp; Hour</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="00/00/0000 00:00:00" />
                                <span className="fs-13 text-muted">e.g &quot;DD/MM/YYYY HH:MM:SS&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;00/00/0000 00:00:00&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">ZIP Code</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="00000-000" />
                                <span className="fs-13 text-muted">e.g &quot;xxxxx-xxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;00000-000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Crazy Zip Code</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="0-00-00-00" />
                                <span className="fs-13 text-muted">e.g &quot;x-xx-xx-xx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;0-00-00-00&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Money</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    data-toggle="input-mask"
                                    data-mask-format="000.000.000.000.000,00"
                                    data-reverse="true"
                                />
                                <span className="fs-13 text-muted">e.g &quot;Your money&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-mask-format=&quot;000.000.000.000.000,00&quot; data-reverse=&quot;true&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Money 2</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    data-toggle="input-mask"
                                    data-mask-format="#.##0,00"
                                    data-reverse="true"
                                />
                                <span className="fs-13 text-muted">e.g &quot;#.##0,00&quot;</span>
                                <p className="mt-1">
                                    Add attribute{' '}
                                    <code>
                                        data-toggle=&quot;input-mask&quot; data-mask-format=&quot;#.##0,00&quot; data-reverse=&quot;true&quot;
                                    </code>
                                </p>
                            </div>
                        </form>
                    </Col>
                    <Col md={6}>
                        <form action="">
                            <div className="mb-3">
                                <label className="form-label">Telephone</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="0000-0000" />
                                <span className="fs-13 text-muted">e.g &quot;xxxx-xxxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;0000-0000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Telephone with Code Area</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="(00) 0000-0000" />
                                <span className="fs-13 text-muted">e.g &quot;(xx) xxxx-xxxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;(00) 0000-0000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">US Telephone</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="(000) 000-0000" />
                                <span className="fs-13 text-muted">e.g &quot;(xxx) xxx-xxxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;(000) 000-0000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">São Paulo Celphones</label>
                                <input type="text" className="form-control" data-toggle="input-mask" data-mask-format="(00) 00000-0000" />
                                <span className="fs-13 text-muted">e.g &quot;(xx) xxxxx-xxxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-toggle=&quot;input-mask&quot; data-mask-format=&quot;(00) 00000-0000&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">CPF</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    data-toggle="input-mask"
                                    data-mask-format="000.000.000-00"
                                    data-reverse="true"
                                />
                                <span className="fs-13 text-muted">e.g &quot;xxx.xxx.xxxx-xx&quot;</span>
                                <p className="mt-1">
                                    Add attribute <code>data-mask-format=&quot;000.000.000-00&quot; data-reverse=&quot;true&quot;</code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">CNPJ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    data-toggle="input-mask"
                                    data-mask-format="00.000.000/0000-00"
                                    data-reverse="true"
                                />
                                <span className="fs-13 text-muted">e.g &quot;xx.xxx.xxx/xxxx-xx&quot;</span>
                                <p className="mt-1">
                                    Add attribute{' '}
                                    <code>
                                        data-toggle=&quot;input-mask&quot; data-mask-format=&quot;00.000.000/0000-00&quot;
                                        data-reverse=&quot;true&quot;
                                    </code>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">IP Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    data-toggle="input-mask"
                                    data-mask-format="099.099.099.099"
                                    data-reverse="true"
                                />
                                <span className="fs-13 text-muted">e.g &quot;xxx.xxx.xxx.xxx&quot;</span>
                                <p className="mt-1">
                                    Add attribute{' '}
                                    <code>
                                        data-toggle=&quot;input-mask&quot; data-mask-format=&quot;099.099.099.099&quot; data-reverse=&quot;true&quot;
                                    </code>
                                </p>
                            </div>
                        </form>
                    </Col>
                </Row>
            </ComponentContainerCard>
        </MainLayout>
    );
};

export default InputmaskPage;
