import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimpleBar from 'simplebar-react';
import { messages } from '@/data/social';
import avatar10 from '@/images/users/avatar-10.jpg';
import { ChatMessageType, UserType } from '@/types/data';
import { getFirstTwoLetters } from '@/utils/change-casing';
import { addOrSubtractMinutesFromDate } from '@/utils/date';
import { getFileExtensionIcon } from '@/utils/get-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';

import TextFormInput from '@/components/form/TextFormInput';
import { useChatContext } from '@/context/useChatContext';
import { Link } from '@inertiajs/react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const MessageDropdown = ({ message, toUser }: { message: ChatMessageType; toUser: UserType }) => {
    return (
        <Dropdown drop={message.from.id === toUser.id ? 'end' : 'start'} className="chat-actions">
            <DropdownToggle as={'a'} role="button" className="ps-1 link-reset  content-none ">
                <IconifyIcon icon="bx:dots-vertical-rounded" width={20} height={20} />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem>
                    <IconifyIcon icon="bx:share" className="me-2" />
                    Reply
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:share-alt" className="me-2" />
                    Forward
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:copy" className="me-2" />
                    Copy
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:bookmark" className="me-2" />
                    Bookmark
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:star" className="me-2" />
                    Starred
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:info-square" className="me-2" />
                    Mark as Unread
                </DropdownItem>
                <DropdownItem>
                    <IconifyIcon icon="bx:trash" className="me-2" />
                    Delete
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

const UserMessage = ({ message, toUser }: { message: ChatMessageType; toUser: UserType }) => {
    return (
        <li className={clsx('chat-group', { odd: message.from.id === toUser.id })}>
            {message.from.id != toUser.id && (
                <div className="chat-avatar text-center">
                    <img src={message.from.image} alt="avatar" className="avatar-sm rounded-circle" />
                </div>
            )}
            {message.from.id === toUser.id && (
                <div className="chat-avatar text-center ms-2">
                    <img src={message.from.image} alt="avatar" className="avatar-sm rounded-circle" />
                </div>
            )}
            <div className={clsx('chat-body', { 'ms-0': message.from.id === toUser.id })}>
                {message.from.id === toUser.id ? (
                    <div>
                        <h6 className="d-inline-flex">{message.from.id === toUser.id ? 'you' : message.from.name}</h6>&nbsp;
                        <h6 className="d-inline-flex text-muted">10:04pm</h6>
                    </div>
                ) : (
                    <div>
                        <h6 className="d-inline-flex">{message.from.id === toUser.id ? 'you' : message.from.name}</h6>&nbsp;
                        <h6 className="d-inline-flex text-muted">10:04pm</h6>
                    </div>
                )}
                <div className={clsx('d-flex', { 'justify-content-end': message.from.id === toUser.id })}>
                    {message.from.id === toUser.id && <MessageDropdown message={message} toUser={toUser} />}
                    <div className="chat-message">
                        {message.message.type === 'text' && typeof message.message.value === 'string' && <p>{message.message.value}</p>}
                        {message.message.type === 'file' &&
                            typeof message.message.value === 'object' &&
                            message.message.value.map((item, idx) => (
                                <Fragment key={idx}>
                                    {item.preview && (
                                        <div role=" button" key={idx}>
                                            <img src={item.preview} alt="attachment" height={84} width={121} className="img-thumbnail me-1" />
                                        </div>
                                    )}
                                    {item.name && (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="flex-shrink-0">
                                                <IconifyIcon icon={getFileExtensionIcon(item.name)} className="fs-24 me-1" />
                                            </div>
                                            <div className="flex-grow-1">
                                                <span role="button" className="text-white">
                                                    {item.name}
                                                </span>
                                                <p className="mb-0">{item.size} MB</p>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                        {message.from.id != toUser.id && <MessageDropdown message={message} toUser={toUser} />}
                    </div>
                </div>
            </div>
        </li>
    );
};

const ChatArea = ({ selectedUser }: { selectedUser: UserType }) => {
    const [userMessages, setUserMessages] = useState<ChatMessageType[]>([]);

    const messageSchema = yup.object({
        newMessage: yup.string().required('Please enter message'),
    });

    const { reset, handleSubmit, control } = useForm({
        resolver: yupResolver(messageSchema),
    });
    const [toUser] = useState<UserType>({
        id: '1012',
        name: 'Gilbert Chicoine',
        image: avatar10,
        email: '',
        message: 'Hey! Okay, thank you for letting me know. See you!',
        date: addOrSubtractMinutesFromDate(650),
    });

    const getMessagesForUser = useCallback(() => {
        if (selectedUser) {
            setUserMessages(
                [...messages].filter(
                    (m) => (m.to.id === toUser.id && m.from.id === selectedUser.id) || (toUser.id === m.from.id && m.to.id === selectedUser.id),
                ),
            );
        }
    }, [selectedUser, toUser]);

    useEffect(() => {
        getMessagesForUser();
    }, [getMessagesForUser]);

    /**
     * sends the chat message
     */
    const sendChatMessage = (values: { newMessage?: string }) => {
        const newUserMessages = [...userMessages];
        newUserMessages.push({
            id: (userMessages.length + 1).toString(),
            from: toUser,
            to: selectedUser,
            message: { type: 'text', value: values.newMessage ?? '' },
            sentOn: addOrSubtractMinutesFromDate(0.1),
        });
        setTimeout(() => {
            const otherNewMessages = [...newUserMessages];
            otherNewMessages.push({
                id: (userMessages.length + 1).toString(),
                from: selectedUser,
                to: toUser,
                message: { type: 'text', value: values.newMessage ?? '' },
                sentOn: addOrSubtractMinutesFromDate(0.1),
            });
            setUserMessages(otherNewMessages);
        }, 1000);
        setUserMessages(newUserMessages);
        reset();
    };

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (elementRef && elementRef.current && elementRef.current.scrollIntoView) {
                elementRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        });
        return <div ref={elementRef} />;
    };

    const { chatList, chatSetting } = useChatContext();

    return (
        <Card className="chat-content rounded-0 shadow-none mb-0">
            <CardHeader className="py-2 px-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between py-1">
                    <div className="d-flex align-items-center gap-2">
                        {chatList.open ? (
                            <button
                                onClick={chatList.toggle}
                                className="btn btn-sm btn-icon btn-soft-primary d-none d-xl-flex me-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#chat-user-list"
                                aria-expanded="true"
                            >
                                <IconifyIcon icon="tabler:chevrons-left" className="fs-20" />
                            </button>
                        ) : (
                            <button
                                onClick={chatList.toggle}
                                className="btn btn-sm btn-icon btn-soft-primary d-none d-xl-flex me-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#chat-user-list"
                                aria-expanded="true"
                            >
                                <IconifyIcon icon="tabler:chevrons-right" className="fs-20" />
                            </button>
                        )}
                        <button
                            onClick={chatSetting.toggle}
                            className="btn btn-sm btn-icon btn-ghost-light text-dark d-xl-none d-flex"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#chatUserList"
                            aria-controls="chatUserList"
                        >
                            <IconifyIcon icon="tabler:menu-2" className="fs-20" />
                        </button>
                        {selectedUser?.image && <img src={selectedUser.image} className="avatar-lg rounded-circle" alt="avatar" />}
                        {!selectedUser?.image &&
                            (selectedUser?.icon ? (
                                <div
                                    className={`avatar-lg rounded-circle bg-${selectedUser?.iconColor} text-white d-flex align-items-center justify-content-center`}
                                >
                                    <IconifyIcon icon={selectedUser?.icon} className="fs-20" />
                                </div>
                            ) : (
                                <div className="avatar-lg rounded-circle bg-info text-white d-flex align-items-center justify-content-center">
                                    <span className="fw-semibold">{getFirstTwoLetters(selectedUser?.name)}</span>
                                </div>
                            ))}
                        <div>
                            <h5 className="my-0 lh-base">
                                <Link href="" className="text-reset">
                                    James Zavel
                                </Link>
                            </h5>
                            <p className="mb-0 text-muted icons-center">
                                <IconifyIcon
                                    icon="tabler:circle-filled"
                                    className={`text-${selectedUser?.activeOffline == 'Offline' ? 'danger' : 'success'} me-1`}
                                />{' '}
                                {selectedUser?.activeOffline}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Link
                            href=""
                            className="btn btn-sm btn-icon btn-ghost-light d-none d-xl-flex"
                            data-bs-toggle="modal"
                            data-bs-target="#userCall"
                            data-bs-placement="top"
                            title="Voice Call"
                        >
                            <IconifyIcon icon="tabler:phone-call" className="fs-20" />
                        </Link>
                        <Link
                            href=""
                            className="btn btn-sm btn-icon btn-ghost-light d-none d-xl-flex"
                            data-bs-toggle="modal"
                            data-bs-target="#userVideoCall"
                            data-bs-placement="top"
                            title="Video Call"
                        >
                            <IconifyIcon icon="tabler:video" className="fs-20" />
                        </Link>
                        <Link href="" className="btn btn-sm btn-icon btn-ghost-light d-xl-flex">
                            <IconifyIcon icon="tabler:info-circle" className="fs-20" />
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <div>
                <SimpleBar className="chat-scroll p-3">
                    <ul className="chat-list" data-apps-chat="messages-list">
                        {userMessages.map((message, idx) => (
                            <UserMessage message={message} toUser={toUser} key={idx} />
                        ))}
                        <AlwaysScrollToBottom />
                    </ul>
                </SimpleBar>
                <div className="p-3 border-top position-sticky bottom-0 w-100 mb-0">
                    <form className="row align-items-center g-2" name="chat-form" id="chat-form" onSubmit={handleSubmit(sendChatMessage)}>
                        <Col xs={'auto'}>
                            <Button className="btn-icon btn-soft-warning content-none">
                                <IconifyIcon icon="solar:smile-circle-outline" className="fs-20" />
                            </Button>
                        </Col>
                        <TextFormInput
                            noValidate
                            control={control}
                            name="newMessage"
                            containerClassName="col"
                            className="form-control"
                            placeholder="Enter your message"
                        />
                        <Col sm={'auto'}>
                            <div className="d-flex align-items-center gap-1">
                                <button type="submit" className="btn btn-icon btn-success">
                                    <IconifyIcon icon="tabler:send" />
                                </button>
                                <Link href="" className="btn btn-icon btn-soft-primary">
                                    <IconifyIcon icon="tabler:microphone" />{' '}
                                </Link>
                                <Link href="" className="btn btn-icon btn-soft-primary">
                                    <IconifyIcon icon="tabler:paperclip" />
                                </Link>
                            </div>
                        </Col>
                    </form>
                </div>
            </div>
        </Card>
    );
};

export default ChatArea;
