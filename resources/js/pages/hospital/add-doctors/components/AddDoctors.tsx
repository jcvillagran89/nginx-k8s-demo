import CustomFlatpickr from '@/components/CustomFlatpickr';
import FileUpload from '@/components/FileUpload';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const UploadPhotoCard = () => {
    return <FileUpload title="Upload Profile Photo" />;
};

const DoctorAvailabilityCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Doctor Availability
                </CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={12} className="mb-3">
                        <label className="form-label d-block mb-2 fw-semibold">Available Days:</label>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox1" defaultValue={0} name="sun" />
                            <label className="form-check-label" htmlFor="inlineCheckbox1">
                                Sun
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox2" defaultValue={0} name="mon" />
                            <label className="form-check-label" htmlFor="inlineCheckbox2">
                                Mon
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox3" defaultValue={0} name="tue" />
                            <label className="form-check-label" htmlFor="inlineCheckbox3">
                                Tue
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox4" defaultValue={0} name="wen" />
                            <label className="form-check-label" htmlFor="inlineCheckbox4">
                                Wen
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox5" defaultValue={0} name="thu" />
                            <label className="form-check-label" htmlFor="inlineCheckbox5">
                                Thu
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox6" defaultValue={0} name="fri" />
                            <label className="form-check-label" htmlFor="inlineCheckbox6">
                                Fri
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox7" defaultValue={0} name="sat" />
                            <label className="form-check-label" htmlFor="inlineCheckbox7">
                                Sat
                            </label>
                        </div>
                    </Col>
                </Row>
                <Row className="g-3">
                    <Col lg={6}>
                        <div>
                            <label htmlFor="from-time" className="form-label fw-semibold">
                                From Time:
                            </label>
                            <CustomFlatpickr
                                className="form-control"
                                placeholder="12:00 PM"
                                options={{
                                    noCalendar: true,
                                    dateFormat: 'H:i',
                                }}
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div>
                            <label htmlFor="to-time" className="form-label fw-semibold">
                                To Time:
                            </label>
                            <CustomFlatpickr
                                className="form-control"
                                placeholder="12:00 PM"
                                options={{
                                    noCalendar: true,
                                    dateFormat: 'H:i',
                                }}
                            />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div>
                            <label htmlFor="dateSelect" className="form-label fw-semibold">
                                Available Date:
                            </label>
                            <CustomFlatpickr
                                className="form-control"
                                placeholder="dd-mm-yyyy to dd-mm-yyyy"
                                options={{
                                    mode: 'range',
                                    enableTime: false,
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const AddDoctors = () => {
    const messageSchema = yup.object({
        fName: yup.string().required('Please enter Fist Name'),
        lName: yup.string().required('Please enter Last Name'),
        address: yup.string().required('Please enter Doctor Address'),
        description: yup.string().required('Please enter description'),
        education: yup.string().required('Please enter education'),
        email: yup.string().email().required('Please enter email'),
        number: yup.string().required('Please enter number'),
        propertiesNumber: yup.string().required('Please enter Properties Number'),
        facebookUrl: yup.string().required('Please enter Facebook Url'),
        instagramUrl: yup.string().required('Please enter Instagram Url'),
        twitterUrl: yup.string().required('Please enter Twitter Url'),
    });

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(messageSchema),
    });

    return (
        <>
            <form onSubmit={handleSubmit(() => {})}>
                <Row>
                    <Col lg={7}>
                        <Card>
                            <CardHeader className="border-bottom border-dashed">
                                <CardTitle as={'h4'} className="mb-0">
                                    Basic information
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="fName" placeholder="Enter First Name" label="Doctor First Name" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="lName" placeholder="Enter Last Name" label="Doctor Last Name" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="email" placeholder="Enter Email" label="Email Address" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="number" placeholder="Enter Number" label="Phone Number" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <label className="form-label">Birth Date</label>
                                            <CustomFlatpickr className="form-control" placeholder="dd-mm-yyyy" options={{ enableTime: false }} />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <label htmlFor="gender" className="form-label">
                                                Gender
                                            </label>
                                            <ChoicesFormInput className="form-select my-1 my-md-0 me-sm-3" data-toggle="select2" id="gender">
                                                <option>Select Gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </ChoicesFormInput>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="education" placeholder="Enter Education" label="Education" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <label htmlFor="department" className="form-label">
                                                Department
                                            </label>
                                            <ChoicesFormInput className="form-select my-1 my-md-0 me-sm-3" data-toggle="select2" id="department">
                                                <option>Select Department</option>
                                                <option>Cardiology</option>
                                                <option>Dermatology</option>
                                                <option>Pediatrics</option>
                                                <option>Gastroenterology</option>
                                                <option>Orthopedics</option>
                                                <option>Neurology</option>
                                                <option>Psychiatry</option>
                                                <option>Oncology</option>
                                                <option>Endocrinology</option>
                                                <option>Ophthalmology</option>
                                            </ChoicesFormInput>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <TextAreaFormInput
                                                control={control}
                                                name="address"
                                                type="text"
                                                label="Doctor Address"
                                                className="form-control"
                                                id="schedule-textarea"
                                                rows={3}
                                                placeholder="Full Address"
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div>
                                            <TextAreaFormInput
                                                control={control}
                                                name="description"
                                                type="text"
                                                label="About Doctor"
                                                className="form-control"
                                                id="schedule-textarea"
                                                rows={3}
                                                placeholder="Write short line about doctor"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={5}>
                        <UploadPhotoCard />
                        <DoctorAvailabilityCard />
                        <div className="text-end mb-3">
                            <Button type="submit" variant="primary">
                                Add Doctor
                            </Button>
                            &nbsp;
                            <Button variant="danger">Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </form>
        </>
    );
};

export default AddDoctors;
