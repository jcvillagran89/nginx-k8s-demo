export type QuickAccessType = {
    icon: string;
    title: string;
    files: number;
    storage: number;
    isStar?: boolean;
    progress: number;
    variant: string;
};

export const quickAccessData: QuickAccessType[] = [
    {
        icon: 'logos:google-meet',
        title: 'Google Media',
        files: 38,
        storage: 44.6,
        isStar: true,
        progress: 94,
        variant: 'primary',
    },
    {
        icon: 'logos:google-drive',
        title: 'Google Drive',
        files: 42,
        storage: 38.8,
        progress: 78,
        variant: 'success',
    },
    {
        icon: 'logos:dropbox',
        title: 'Dropbox',
        files: 98,
        storage: 44.86,
        progress: 92,
        variant: 'info',
    },
    {
        icon: 'logos:cloudlinux',
        title: 'Cloud Storage',
        files: 56,
        storage: 20.63,
        isStar: true,
        progress: 40,
        variant: 'secondary',
    },
];
