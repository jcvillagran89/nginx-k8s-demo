import PageTitle from '@/components/PageTitle';
import MainLayout from '@/layouts/MainLayout';
import ChatData from './components/ChatData';

const ChatPage = () => {
    return (
        <MainLayout>
            <PageTitle title="Chat" />
            <ChatData />
        </MainLayout>
    );
};

export default ChatPage;
