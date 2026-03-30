export type AppointmentStatType = {
    icon: string;
    title: string;
    count: number;
    patients: {
        patients: string;
        patientsCount: number;
    }[];
};

export const appointmentStatData: AppointmentStatType[] = [
    {
        icon: 'solar:document-medicine-bold',
        title: 'Total Appointment',
        count: 152,
        patients: [
            {
                patients: 'Dermatology',
                patientsCount: 67,
            },
            {
                patients: 'Cardiology',
                patientsCount: 23,
            },
        ],
    },
    {
        icon: 'solar:close-square-bold',
        title: 'Appointment Cancelled',
        count: 67,
        patients: [
            {
                patients: 'Gastroenterology',
                patientsCount: 56,
            },
            {
                patients: 'Nephrology',
                patientsCount: 11,
            },
        ],
    },
    {
        icon: 'solar:calendar-date-bold',
        title: 'Appointment Pending',
        count: 201,
        patients: [
            {
                patients: 'Oncology',
                patientsCount: 132,
            },
            {
                patients: 'Orthopedics',
                patientsCount: 59,
            },
        ],
    },
    {
        icon: 'solar:user-heart-bold',
        title: 'Total Patient',
        count: 134,
        patients: [
            {
                patients: 'Ophthalmology',
                patientsCount: 100,
            },
            {
                patients: 'Endocrinology',
                patientsCount: 34,
            },
        ],
    },
];
