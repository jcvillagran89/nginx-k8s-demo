import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimpleBar from 'simplebar-react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { NotificationType } from '../data';

import { timeSince } from '@/utils/date';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import echo from '@/lib/echo';
import { useNotificationContext } from '@/context/useNotificationContext';

type TestRequestAssignedEvent = {
    test_request_id?: number;
    test_id?: number;
    reference?: string;
    assigned_to?: string;
    summary?: string;
    message?: string;
    url?: string;
};

type SharedChannel = {
    name: string;
    cleanup: () => void;
};

const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [hasRealtimeActivity, setHasRealtimeActivity] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { showNotification } = useNotificationContext();
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                id?: number;
                name?: string;
            };
        };
    };
    const userId = auth?.user?.id;

    const dismissNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    useEffect(() => {
        if (!echo) {
            return;
        }

        const eventName = '.TestRequestAssigned';
        const subscriptions: SharedChannel[] = [];

        const handleIncoming = (event: TestRequestAssignedEvent) => {
            const requestId = event.test_request_id ?? Date.now();
            const label = event.summary || event.message || 'Nuevo test request asignado';
            const title = (
                <>
                    <span className="fw-medium text-body">Solicitud #{requestId}</span> asignada
                    {event.assigned_to ? (
                        <>
                            {' '}
                            a <span className="fw-medium text-body">{event.assigned_to}</span>
                        </>
                    ) : null}
                    .
                </>
            );

            setNotifications((prev) => [
                {
                    id: Number(new Date()),
                    title,
                    icon: {
                        icon: 'tabler:flask',
                        variant: 'primary',
                    },
                    time: new Date(),
                    href: event.url,
                },
                ...prev,
            ]);

            setHasRealtimeActivity(true);
            setUnreadCount((prev) => prev + 1);
            showNotification({
                title: 'Nuevo test request',
                message: label,
                variant: 'primary',
                delay: 4000,
            });
        };

        const mountChannel = (name: string, channelFactory: () => any) => {
            const channelInstance = channelFactory();
            if (!channelInstance) {
                return;
            }

            channelInstance.listen(eventName, handleIncoming);
            subscriptions.push({
                name,
                cleanup: () => {
                    channelInstance.stopListening(eventName, handleIncoming);
                    echo.leaveChannel(name);
                },
            });
        };

        mountChannel('public-channel', () => echo.channel('public-channel'));

        if (userId) {
            mountChannel(`test-requests.${userId}`, () => echo.private(`test-requests.${userId}`));
        }

        return () => {
            subscriptions.forEach(({ cleanup }) => cleanup());
        };
    }, [showNotification, userId]);

    return (
        <div className="topbar-item">
            <Dropdown
                align={'end'}
                onToggle={(show) => {
                    if (show) {
                        setHasRealtimeActivity(false);
                        setUnreadCount(0);
                    }
                }}
            >
                <DropdownToggle
                    as={'a'}
                    className="topbar-link drop-arrow-none"
                    data-bs-toggle="dropdown"
                    data-bs-offset="0,25"
                    data-bs-auto-close="outside"
                    aria-haspopup="false"
                    aria-expanded="false"
                >
                    <IconifyIcon icon="tabler:bell" className={`${unreadCount > 0 ? 'animate-ring' : ''} fs-22`} />
                    {unreadCount > 0 && (
                        <span className="noti-icon-badge d-flex align-items-center justify-content-center">
                            <small>{unreadCount}</small>
                        </span>
                    )}
                </DropdownToggle>
                <DropdownMenu className="p-0 dropdown-menu-start dropdown-menu-lg" style={{ minHeight: 300 }}>
                    <div className="p-3 border-bottom border-dashed">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fs-16 fw-semibold"> Notificaciones</h6>
                            </Col>
                            <Col xs={'auto'}>
                                <Dropdown>
                                    <DropdownToggle
                                        as={'a'}
                                        className="drop-arrow-none link-dark"
                                        data-bs-toggle="dropdown"
                                        data-bs-offset="0,15"
                                        aria-expanded="false"
                                    >
                                        <IconifyIcon icon="tabler:settings" className="fs-22 align-middle" />
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem>Marcar como leidas</DropdownItem>
                                        <DropdownItem>Borrar todas</DropdownItem>
                                        <DropdownItem>No molestar</DropdownItem>
                                        <DropdownItem>Otras opciones</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </div>
                    <SimpleBar className="position-relative z-2 card shadow-none rounded-0" style={{ maxHeight: 300 }}>
                        {notifications.map((item, idx) => (
                            <div className="notification-item dropdown-item py-2 text-wrap" id="notification-1" key={idx}>
                                <span className="d-flex align-items-center">
                                    {item.image ? (
                                        <span className="me-3 position-relative flex-shrink-0">
                                            {item.image?.image && <img src={item.image.image} className="avatar-md rounded-circle" alt="avatar1" />}
                                            <span className={`position-absolute rounded-pill bg-${item.image.variant} notification-badge`}>
                                                <IconifyIcon icon={item.image.icon} />
                                                <span className="visually-hidden">unread messages</span>
                                            </span>
                                        </span>
                                    ) : (
                                        <div className="avatar-md flex-shrink-0 me-3">
                                            <span
                                                className={`avatar-title bg-${item.icon?.variant}-subtle text-${item.icon?.variant} rounded-circle fs-22`}
                                            >
                                                {item.icon && <IconifyIcon icon={item.icon.icon} />}
                                            </span>
                                        </div>
                                    )}

                                    <span className="flex-grow-1 text-muted">
                                        {item.href ? (
                                            <Link href={item.href} className="text-reset text-decoration-none">
                                                {item.title}
                                            </Link>
                                        ) : (
                                            item.title
                                        )}
                                        <br />
                                        <span className="fs-12">{timeSince(item.time)}</span>
                                    </span>
                                    <span className="notification-item-close" onClick={() => dismissNotification(item.id)}>
                                        <button
                                            type="button"
                                            className="btn btn-ghost-danger rounded-circle btn-sm btn-icon"
                                            data-dismissible="#notification-1"
                                        >
                                            <IconifyIcon icon="tabler:x" className="fs-16" />
                                        </button>
                                    </span>
                                </span>
                            </div>
                        ))}
                    </SimpleBar>
                    {!notifications.length && (
                        <div
                            style={{ height: 300 }}
                            className="d-flex align-items-center justify-content-center text-center position-absolute top-0 bottom-0 start-0 end-0 z-1"
                        >
                            <div>
                                <IconifyIcon icon="line-md:bell-twotone-alert-loop" className="fs-80 text-secondary mt-2" />
                                <h4 className="fw-semibold mb-0 fst-italic lh-base mt-3">
                                    Sin notificaciones nuevas <br />
                                </h4>
                            </div>
                        </div>
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default Notifications;
