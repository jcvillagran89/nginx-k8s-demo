import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'react-bootstrap';
import { medicalHistoryData } from '../data';

const MedicalHistoryCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-block">
                        <CardTitle as={'h4'} className="mb-0">
                            Medical History
                        </CardTitle>
                    </div>
                    <div className="ms-auto">
                        <Button variant="soft-primary" size="sm">
                            Edit
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <Row className="g-3">
                    {medicalHistoryData.map((item, idx) => (
                        <div className={` ${medicalHistoryData.length - 1 === idx ? 'col-lg-12' : 'col-lg-6'} col-lg-6`} key={idx}>
                            <div className="d-flex p-2 rounded align-items-center gap-2 border">
                                <div
                                    className={`avatar avatar-lg bg-${item.variant}-subtle  d-flex align-items-center justify-content-center rounded`}
                                >
                                    <IconifyIcon icon={item.icon} className={`text-${item.variant} fs-32`} />
                                </div>
                                <div>
                                    <p className="text-muted fw-medium mb-1 fs-15">{item.title}</p>
                                    <p className="text-dark fw-medium mb-0 fs-15">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

export default MedicalHistoryCard;
