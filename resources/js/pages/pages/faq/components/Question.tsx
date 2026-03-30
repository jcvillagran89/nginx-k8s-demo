import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const Question = () => {
    const questionSchema = yup.object({
        name: yup.string().required('Please enter your Name'),
        question: yup.string().required('Please enter Question'),
        email: yup.string().email().required('Please enter email'),
        number: yup.string().required('Please enter number'),
    });

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(questionSchema),
    });
    return (
        <>
            <form onClick={handleSubmit(() => {})}>
                <div className="border p-3 rounded bg-light-subtle">
                    <div className="mb-2">
                        <TextFormInput control={control} name="name" placeholder="Full Name" label="Your Name" />
                    </div>
                    <div className="mb-2">
                        <TextFormInput control={control} name="email" placeholder="Email" label="Email" />
                    </div>
                    <div className="mb-2">
                        <TextFormInput control={control} name="number" placeholder="Number" label="Phone number" />
                    </div>
                    <div>
                        <TextAreaFormInput
                            control={control}
                            name="question"
                            type="text"
                            label="Enter Your Question"
                            className="form-control"
                            id="schedule-textarea"
                            rows={3}
                            placeholder="Message"
                        />
                    </div>
                    <div className="mt-2">
                        <Button variant="primary" type="submit" className="w-100">
                            Send
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Question;
