import { DEFAULT_PAGE_TITLE } from '@/context/constants';
import { ChatProvider } from '@/context/useChatContext';
import { LayoutProvider } from '@/context/useLayoutContext';
import { NotificationProvider } from '@/context/useNotificationContext';
import { ChildrenType } from '@/types/component-props';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

const AppProvidersWrapper = ({ children }: ChildrenType) => {
    const handleChangeTitle = () => {
        if (document.visibilityState == 'hidden') document.title = 'Please come back 🥺';
        else document.title = DEFAULT_PAGE_TITLE;
    };

    useEffect(() => {
        const splashElement = document.querySelector<HTMLDivElement>('#__next_splash');
        const splashScreen = document.querySelector('#splash-screen');

        if (!splashElement || !splashScreen) return;

        const handleMutations = (mutationsList: MutationRecord[]) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && splashElement.hasChildNodes()) {
                    splashScreen.classList.add('remove');
                }
            }
        };
        const observer = new MutationObserver(handleMutations);
        observer.observe(splashElement, { childList: true, subtree: true });
        if (splashElement.hasChildNodes()) {
            splashScreen.classList.add('remove');
        }
        document.addEventListener('visibilitychange', handleChangeTitle);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', handleChangeTitle);
        };
    }, []);

    return (
        <ChatProvider>
            <LayoutProvider>
                <NotificationProvider>
                    {children}
                    <ToastContainer theme="colored" />
                </NotificationProvider>
            </LayoutProvider>
        </ChatProvider>
    );
};
export default AppProvidersWrapper;
