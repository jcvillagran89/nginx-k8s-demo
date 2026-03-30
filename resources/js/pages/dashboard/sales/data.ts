import { addOrSubtractDaysFromDate, addOrSubtractMinutesFromDate } from '@/utils/date';

import { currency } from '@/context/constants';
import product1 from '@/images/products/p-1.png';
import product2 from '@/images/products/p-2.png';
import product3 from '@/images/products/p-3.png';
import product4 from '@/images/products/p-4.png';
import product5 from '@/images/products/p-5.png';
import product6 from '@/images/products/p-6.png';
import product7 from '@/images/products/p-7.png';

export type StatType = {
    title: string;
    icon: string;
    count: string;
    change: number;
    variant: string;
};

export type OverViewChartType = {
    title: string;
    count: number;
    icon: string;
    variant?: string;
};

export type ActivityType = {
    title: string;
    icon: string;
    description: string;
    time: Date;
    variant: string;
};

export type SalesProductType = {
    id: string;
    name: string;
    image: string;
    date: Date;
    price: number;
    quantity: number;
    amount: string;
};

export type SalesOrderType = {
    id: string;
    image: string;
    title: string;
    price: number;
    totalPrice: number;
    quantity: number;
    orderStatus: 'Sold' | 'Return';
};

export const statData: StatType[] = [
    {
        title: 'Total Orders',
        icon: 'solar:case-round-minimalistic-bold-duotone',
        count: '687.3k',
        change: 9.19,
        variant: 'danger',
    },
    {
        title: 'Total Returns',
        icon: 'solar:bill-list-bold-duotone',
        count: '9.62k',
        change: 26.87,
        variant: 'success',
    },
    {
        title: 'Avg. Sales Earnings',
        icon: 'solar:wallet-money-bold-duotone',
        count: `${currency}98.24 USD`,
        change: 3.51,
        variant: 'success',
    },
    {
        title: 'Number of Visits',
        icon: 'solar:eye-bold-duotone',
        count: '87.94M',
        change: 1.05,
        variant: 'danger',
    },
];

export const overViewChartData: OverViewChartType[] = [
    {
        title: 'Revenue',
        count: 29.5,
        icon: 'tabler:square-rounded-arrow-down',
        variant: 'success',
    },
    {
        title: 'Expenses',
        count: 15.07,
        icon: 'tabler:square-rounded-arrow-up',
        variant: 'danger',
    },
    {
        title: 'Investment',
        count: 3.6,
        icon: 'tabler:chart-infographic',
    },
    {
        title: 'Savings',
        count: 6.9,
        icon: 'tabler:pig',
    },
];

export const activityData: ActivityType[] = [
    {
        title: 'You sold an item',
        icon: 'tabler:basket',
        description: 'Paul Burgess just purchased “My - Admin Dashboard”!',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'info',
    },
    {
        title: 'Product on the Theme Market',
        icon: 'tabler:rocket',
        description: 'Reviewer added Admin Dashboard',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'primary',
    },
    {
        title: 'Robert Delaney',
        icon: 'tabler:message',
        description: 'Send you message "Are you there?"',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'info',
    },
    {
        title: 'Audrey Tobey',
        icon: 'tabler:photo',
        description: 'Uploaded a photo "Error.jpg"',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'primary',
    },
    {
        title: 'You sold an item',
        icon: 'tabler:basket',
        description: 'Paul Burgess just purchased “My - Admin Dashboard”!',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'info',
    },
    {
        title: 'Product on the Theme Market',
        icon: 'tabler:rocket',
        description: 'Reviewer added Admin Dashboard',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'primary',
    },
    {
        title: 'Robert Delaney',
        icon: 'tabler:message',
        description: 'Send you message "Are you there?"',
        time: addOrSubtractMinutesFromDate(15),
        variant: 'info',
    },
];

export const salesProductData: SalesProductType[] = [
    {
        id: '1',
        name: '	ASOS High Waist Tshirt',
        image: product1,
        date: addOrSubtractDaysFromDate(50),
        price: 79.49,
        quantity: 82,
        amount: '6,518.18',
    },
    {
        id: '2',
        name: '	Marco Single Sofa',
        image: product7,
        date: addOrSubtractDaysFromDate(150),
        price: 128.5,
        quantity: 37,
        amount: '4,754.50',
    },
    {
        id: '3',
        name: 'Smart Headphone',
        image: product4,
        date: addOrSubtractDaysFromDate(180),
        price: 39.99,
        quantity: 64,
        amount: '2,559.36',
    },
    {
        id: '4',
        name: 'Lightweight Jacket',
        image: product5,
        date: addOrSubtractDaysFromDate(250),
        price: 20.0,
        quantity: 184,
        amount: '3,680.00',
    },
    {
        id: '5',
        name: 'Marco Shoes',
        image: product6,
        date: addOrSubtractDaysFromDate(350),
        price: 28.49,
        quantity: 69,
        amount: '1,965.81',
    },
];

export const salesOrderData: SalesOrderType[] = [
    {
        id: '201',
        image: product6,
        title: 'Marco Shoes',
        price: 29.99,
        totalPrice: 29.99,
        quantity: 1,
        orderStatus: 'Sold',
    },
    {
        id: '202',
        image: product1,
        title: 'High Waist Tshirt',
        price: 9.99,
        totalPrice: 29.97,
        quantity: 3,
        orderStatus: 'Sold',
    },
    {
        id: '203',
        image: product3,
        title: 'Comfirt Chair',
        price: 49.99,
        totalPrice: 49.99,
        quantity: 1,
        orderStatus: 'Return',
    },
    {
        id: '204',
        image: product4,
        title: 'Smart Headphone',
        price: 39.99,
        totalPrice: 39.99,
        quantity: 1,
        orderStatus: 'Sold',
    },
    {
        id: '205',
        image: product2,
        title: 'Laptop Bag',
        price: 12.99,
        totalPrice: 51.99,
        quantity: 4,
        orderStatus: 'Sold',
    },
];
