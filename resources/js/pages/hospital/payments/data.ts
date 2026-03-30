export type PaymentStatType = {
    icon: string;
    title: string;
    count: number;
    isMonth?: boolean;
};

export const paymentStatData: PaymentStatType[] = [
    {
        icon: 'solar:users-group-two-rounded-bold',
        title: 'Number of Patients',
        count: 3421,
        isMonth: true,
    },
    {
        icon: 'solar:bill-list-bold',
        title: 'Total Bill Payments',
        count: 2342,
    },
    {
        icon: 'solar:bill-check-bold',
        title: 'Total Paid Bills',
        count: 1310,
    },
    {
        icon: 'solar:bill-cross-bold',
        title: 'Total Unpaid Bills',
        count: 1203,
    },
];
