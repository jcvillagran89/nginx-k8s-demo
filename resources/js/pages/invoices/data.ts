import { currency } from '@/context/constants';

export type InvoiceType = {
    title: string;
    count: string;
    change: number;
    variant: string;
    icon: string;
    isUp?: boolean;
};

export const invoiceData: InvoiceType[] = [
    {
        title: 'No.of Clients',
        count: '9,458',
        change: 6.15,
        variant: 'secondary',
        icon: 'solar:users-group-two-rounded-bold-duotone',
    },
    {
        title: 'No. of Invoices',
        count: '16.75k',
        change: 26.87,
        variant: 'primary',
        icon: 'solar:bill-list-bold-duotone',
        isUp: true,
    },
    {
        title: 'Paid by Clients',
        count: `${currency}98.24k`,
        change: 3.51,
        variant: 'warning',
        icon: 'solar:wallet-money-bold-duotone',
        isUp: true,
    },
    {
        title: 'Pending Invoices',
        count: '87.94%',
        change: 1.05,
        variant: 'success',
        icon: 'solar:banknote-2-bold-duotone',
    },
    {
        title: 'Cancelled Invoices',
        count: '7.11%',
        change: 0.05,
        variant: 'danger',
        icon: 'solar:bill-cross-bold-duotone',
        isUp: true,
    },
];
