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
                    Medical Information
                </CardTitle>
            </CardHeader>
            <CardBody>
                <Row className="g-3">
                    <Col lg={6}>
                        <div>
                            <label htmlFor="bloodGroup" className="form-label">
                                Patient Blood Group
                            </label>
                            <input type="text" className="form-control" id="bloodGroup" placeholder="Enter Blood group" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div>
                            <label htmlFor="bloodPressure" className="form-label">
                                Patient Blood Pressure
                            </label>
                            <input type="text" className="form-control" id="bloodPressure" placeholder="Enter Blood pressure" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div>
                            <label htmlFor="sugarLevel" className="form-label">
                                Patient Sugar Level
                            </label>
                            <input type="text" className="form-control" id="sugarLevel" placeholder="Enter Sugar level" />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div>
                            <label htmlFor="condition" className="form-label">
                                Patient Condition
                            </label>
                            <input type="text" className="form-control" id="condition" placeholder="Condition" />
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const AddPatients = () => {
    const messageSchema = yup.object({
        fName: yup.string().required('Please enter Fist Name'),
        lName: yup.string().required('Please enter Last Name'),
        address: yup.string().required('Please enter Doctor Address'),
        email: yup.string().email().required('Please enter email'),
        number: yup.string().required('Please enter number'),
        age: yup.string().required('Please enter your Age'),
        weight: yup.string().required('Please enter your Weight'),
        height: yup.string().required('Please enter your Height'),
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
                                            <TextFormInput control={control} name="fName" placeholder="Enter First Name" label="Patient First Name" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="lName" placeholder="Enter Last Name" label="Patient Last Name" />
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
                                            <TextFormInput control={control} name="age" placeholder="Enter Age" label="Age" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="weight" placeholder="Enter Weight" label="Weight" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <TextFormInput control={control} name="height" placeholder="Enter Height" label="Height" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <label htmlFor="marital-status" className="form-label">
                                                Marital Status
                                            </label>
                                            <ChoicesFormInput className="form-select my-1 my-md-0 me-sm-3" data-toggle="select2" id="marital-status">
                                                <option>Select Status</option>
                                                <option>Married</option>
                                                <option>Unmarried</option>
                                            </ChoicesFormInput>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div>
                                            <TextAreaFormInput
                                                control={control}
                                                name="address"
                                                type="text"
                                                label="Patient Address"
                                                className="form-control"
                                                id="schedule-textarea"
                                                rows={3}
                                                placeholder="Full Address"
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

export default AddPatients;
