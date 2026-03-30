import { usePage } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';
import Alert from 'react-bootstrap/Alert';

export default function GlobalAlert() {
    const { flash, errors } = usePage().props;
    const [show, setShow] = useState(false);

    const { message, variant } = useMemo(() => {
        const successMessage = flash?.success ?? null;
        const errorMessage = flash?.error ?? null;
        const validationArr = errors ? Object.values(errors) : [];
        const validationMsg = validationArr.length ? validationArr.join('\n') : null;

        const msg = successMessage || errorMessage || validationMsg;

        return {
            message: msg,
            variant:
                successMessage ? 'success' :
                    errorMessage ? 'danger' :
                        validationMsg ? 'warning' :
                            'info',
        };
    }, [flash, errors]);

    useEffect(() => {
        if (!message) return;

        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message || !show) return null;

    return (
        <div
            className="position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 2000, width: '90%', maxWidth: 600 }}
        >
            <Alert
                variant={variant}
                show={show}
                dismissible
                onClose={() => setShow(false)}
                className={`shadow-lg text-white border-0 bg-${variant}`}
            >
                {typeof message === 'string'
                    ? message
                    : Array.isArray(message)
                        ? message.join(', ')
                        : 'Ha ocurrido un error inesperado.'}
            </Alert>
        </div>
    );
}
