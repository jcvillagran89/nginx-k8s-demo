import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimpleBar from 'simplebar-react';
import { timeSince } from '@/utils/date';
import { Link } from '@inertiajs/react';
import { CardBody } from 'react-bootstrap';
import { activityData } from '../data';

const Activity = () => {
    return (
        <CardBody className="p-0 border-top border-dashed">
            <h4 className="header-title px-3 mb-2 mt-3">Recent Activity:</h4>
            <SimpleBar className="my-3 px-3" style={{ maxHeight: 370 }}>
                <div className="timeline-alt py-0">
                    {activityData.map((item, idx) => (
                        <div className="timeline-item" key={idx}>
                            <span className={`bg-${item.variant}-subtle text-${item.variant} timeline-icon`}>
                                <IconifyIcon width={14} height={14} icon={item.icon} />
                            </span>
                            <div className="timeline-item-info">
                                <Link href="" className="link-reset fw-semibold mb-1 d-block">
                                    {item.title}
                                </Link>
                                <span className="mb-1">{item.description}</span>
                                <p className={`mb-0 ${activityData.length - 1 != idx ? 'pb-3' : 'pb-2'} `}>
                                    <small className="text-muted">{timeSince(item.time)}</small>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </SimpleBar>
        </CardBody>
    );
};

export default Activity;
