import IconifyIcon from '@/components/wrappers/IconifyIcon';
import arrowImg from '@/images/png/arrows.svg';
import { Button, Card, CardBody } from 'react-bootstrap';

const EstimatedCard = () => {
    return (
        <Card className="bg-primary">
            <CardBody
                style={{
                    backgroundImage: `url(${arrowImg})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right bottom',
                }}
            >
                <h1>
                    <IconifyIcon icon="tabler:receipt-tax" className="text-white" />
                </h1>
                <h4 className="text-white">Estimated tax for this year</h4>
                <p className="text-white text-opacity-75">We kindly encourage you to review your recent transactions</p>
                <Button variant="info" size="sm" className="rounded-pill">
                    Activate Now
                </Button>
            </CardBody>
        </Card>
    );
};

export default EstimatedCard;
