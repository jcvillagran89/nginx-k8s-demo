import CustomFlatpickr from '@/components/CustomFlatpickr';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardFooter, CardTitle } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const AppointmentCard = () => {
    const messageSchema = yup.object({
        name: yup.string().required('Please enter name'),
        description: yup.string().required('Please enter Description'),
        number: yup.string().required('Please enter your Phone Number'),
        email: yup.string().email().required('Please enter email'),
    });

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(messageSchema),
    });

    return (
        <Card>
            <form onSubmit={handleSubmit(() => {})}>
                <CardBody>
                    <CardTitle as={'h4'} className="mb-3">
                        Appointment :
                    </CardTitle>
                    <div className="border border-dashed bg-light bg-opacity-10 p-3 rounded">
                        <div className="mb-2">
                            <label className="form-label">Date</label>
                            <CustomFlatpickr className="form-control" placeholder="Select date" options={{ enableTime: false }} />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="schedule-time" className="form-label">
                                Time
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
                        <div className="mb-2">
                            <TextFormInput control={control} name="name" className="form-control" placeholder="Your Full Name" label="Name" />
                        </div>
                        <div className="mb-2">
                            <TextFormInput control={control} name="email" className="form-control" placeholder="Email" label="Email" />
                        </div>
                        <div className="mb-2">
                            <TextFormInput control={control} name="number" className="form-control" placeholder="number" label="Phone number" />
                        </div>
                        <div>
                            <TextAreaFormInput
                                control={control}
                                name="description"
                                type="text"
                                label="Write Problems"
                                className="form-control"
                                rows={3}
                                placeholder="Enter address"
                            />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="border-top">
                    <Button variant="primary" type="submit" className="w-100">
                        Book Appointment
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default AppointmentCard;
