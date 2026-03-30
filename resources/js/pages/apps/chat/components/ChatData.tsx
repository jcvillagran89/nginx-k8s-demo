import { useChatContext } from '@/context/useChatContext';
import { getAllUsers, getUserById } from '@/helpers/data';
import { UserType } from '@/types/data';
import { useEffect, useState } from 'react';
import { Card, Collapse, Offcanvas } from 'react-bootstrap';
import Chat from './Chat';
import ChatArea from './ChatArea';

const fetchSingleUser = async (id: UserType['id']) => {
    const data = await getUserById(id);
    if (data) return data;
};

const fetchUsers = async () => {
    const data = await getAllUsers();
    if (data) return data;
};

const ChatData = () => {
    const [selectedUser, setSelectedUser] = useState<UserType>();
    const [users, setUsers] = useState<UserType[]>();

    useEffect(() => {
        const fetchInitial = async () => {
            setSelectedUser(await fetchSingleUser('1001'));
            setUsers(await fetchUsers());
        };
        fetchInitial();
    }, []);

    const onUserChange = async (user: UserType) => {
        setSelectedUser(await fetchSingleUser(user.id));
    };

    const { chatList, chatSetting } = useChatContext();
    return (
        <Card>
            <div className="chat d-flex">
                {users && selectedUser && (
                    <>
                        <div className="d-none d-xxl-block">
                            <Collapse in={chatList.open} dimension="width">
                                <div>
                                    <Chat users={users} onUserSelect={onUserChange} selectedUser={selectedUser} />
                                </div>
                            </Collapse>
                        </div>
                        <Offcanvas
                            show={chatSetting.open}
                            onHide={chatSetting.toggle}
                            className="offcanvas-xxl offcanvas-start"
                            tabIndex={-1}
                            id="chatUserList"
                            aria-labelledby="chatUserListLabel"
                        >
                            <Chat users={users} onUserSelect={onUserChange} selectedUser={selectedUser} />
                        </Offcanvas>
                    </>
                )}
                {selectedUser && <ChatArea selectedUser={selectedUser} />}
            </div>
        </Card>
    );
};

export default ChatData;
