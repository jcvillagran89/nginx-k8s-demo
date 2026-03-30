export type StatType = {
    title: string;
    icon: string;
    count: string;
    isLabel?: string;
    isDot?: boolean;
    details: {
        title: string;
        count: string;
    }[];
};

export const statData: StatType[] = [
    {
        title: 'Appointments',
        icon: 'tabler:calendar-week',
        count: '185',
        isDot: true,
        isLabel: 'Today',
        details: [
            {
                title: 'New Appointments',
                count: '125',
            },
            {
                title: 'Total Appointments',
                count: '89.5k',
            },
        ],
    },
    {
        title: 'Total Patients',
        icon: 'tabler:users',
        count: '75.6K',
        details: [
            {
                title: 'New Patients',
                count: '61',
            },
            {
                title: 'Old Patients',
                count: '75.5K',
            },
        ],
    },
    {
        title: 'Overall Rooms',
        icon: 'tabler:hospital-circle',
        count: '195',
        isDot: true,
        isLabel: '14 Rooms available',
        details: [
            {
                title: 'General Rooms',
                count: '136',
            },
            {
                title: 'Private Rooms',
                count: '59',
            },
        ],
    },
    {
        title: 'Doctors on Duty',
        icon: 'tabler:stethoscope',
        count: '87',
        details: [
            {
                title: 'Available Doctors',
                count: '80',
            },
            {
                title: 'On Leave',
                count: '07',
            },
        ],
    },
    {
        title: 'Treatments',
        icon: 'tabler:health-recognition',
        count: '99.87K',
        isDot: true,
        details: [
            {
                title: 'Operations',
                count: '20.69k',
            },
            {
                title: 'General',
                count: '79.18k',
            },
        ],
    },
];
