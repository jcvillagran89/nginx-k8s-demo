import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';

const PreviewButton = () => {
    return (
        <Button variant="primary" onClick={() => window.print()} className="gap-1">
            <IconifyIcon icon="tabler:eye" className="fs-16" /> Preview
        </Button>
    );
};

export default PreviewButton;
