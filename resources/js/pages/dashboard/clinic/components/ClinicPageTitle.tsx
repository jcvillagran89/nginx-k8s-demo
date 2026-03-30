import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Head } from '@inertiajs/react';
import { Button, Col, Row } from 'react-bootstrap';

const ClinicPageTitle = () => {
    return (
        <>
            <Head title="Clinic" />
            <Row>
                <Col xs={12}>
                    <div className="page-title-head d-flex align-items-sm-center flex-sm-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-18 fw-semibold m-0">Welcome back, Dr. Gulati 👋</h4>
                        </div>
                        <div className="mt-3 mt-sm-0">
                            <form action="">
                                <Row className="g-2 mb-0 align-items-center">
                                    <Col xs={'auto'}>
                                        <Button variant="success">
                                            <IconifyIcon icon="tabler:sort-ascending" className="me-1" /> Add Appointment
                                        </Button>
                                    </Col>
                                    <Col sm={'auto'}>
                                        <div className="input-group">
                                            <CustomFlatpickr
                                                className="form-control border-0 shadow"
                                                options={{
                                                    defaultDate: ['2016-10-10', '2016-10-20'],
                                                    dateFormat: 'Y-m-d',
                                                    mode: 'range',
                                                    enableTime: false,
                                                }}
                                            />
                                            <span className="input-group-text bg-primary border-primary text-white">
                                                <IconifyIcon icon="tabler:calendar" className="fs-15" />
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ClinicPageTitle;
