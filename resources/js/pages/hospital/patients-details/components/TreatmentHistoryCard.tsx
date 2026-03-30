import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardHeader, CardTitle } from 'react-bootstrap';
import { treatmentData } from '../data';

const TreatmentHistoryCard = () => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle as={'h4'} className="mb-0">
                    Treatment History{' '}
                </CardTitle>
            </CardHeader>
            <div className="table-responsive">
                <table className="table table-sm table-nowrap mb-0">
                    <thead className="bg-light bg-opacity-25">
                        <tr>
                            <th className="ps-3">ID</th>
                            <th>Type Treatment</th>
                            <th>Date</th>
                            <th>Result Treatment</th>
                            <th>Payment Status</th>
                            <th className="text-center" style={{ width: 120 }}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {treatmentData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="ps-3">{item.id}</td>
                                <td>{item.TreatmentType}</td>
                                <td>{item.date.toLocaleString('en-us', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                <td>
                                    <span className="badge bg-light text-dark p-1 fs-11">
                                        <IconifyIcon icon="tabler:check" className="text-success" /> Wll Done
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge bg-${item.paymentStatus == 'Pending' ? 'warning' : 'success'} p-1 fs-11`}>
                                        {item.paymentStatus}
                                    </span>
                                </td>
                                <td className="pe-3">
                                    <div className="hstack gap-1 justify-content-end">
                                        <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                                            {' '}
                                            <IconifyIcon icon="tabler-eye" />
                                        </Button>
                                        <Button variant="soft-success" size="sm" className="btn-icon rounded-circle">
                                            {' '}
                                            <IconifyIcon icon="tabler-edit" className="fs-16" />
                                        </Button>
                                        <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle">
                                            {' '}
                                            <IconifyIcon icon="tabler-trash" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TreatmentHistoryCard;
