import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher?: typeof Pusher;
        Echo?: Echo;
    }
}

const appKey = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
const port = Number(import.meta.env.VITE_REVERB_PORT || (import.meta.env.VITE_REVERB_SCHEME === 'https' ? 443 : 80));
const useTls = (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https';
const cluster = import.meta.env.VITE_REVERB_CLUSTER || 'mt1';

let echo: Echo | null = null;

if (appKey) {
    window.Pusher = Pusher;

    echo = new Echo({
        broadcaster: 'pusher',
        key: appKey,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: useTls,
        disableStats: true,
        enabledTransports: useTls ? ['wss'] : ['ws', 'wss'],
        cluster,
    });

    window.Echo = echo;
}

export default echo;
