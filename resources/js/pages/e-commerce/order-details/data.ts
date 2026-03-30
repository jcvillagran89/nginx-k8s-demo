import product1 from '@/images/products/p-1.png';
import product3 from '@/images/products/p-3.png';
import product4 from '@/images/products/p-4.png';
import product6 from '@/images/products/p-6.png';

export type OrderItemsType = {
    title: string;
    image: string;
    price: number;
    size: string;
};

export const orderItemData: OrderItemsType[] = [
    {
        title: 'Minetta Rattan Swivel Luxury Green Lounge Chair',
        image: product3,
        price: 300,
        size: '56L X 63D X 102H CM',
    },
    {
        title: "Jordan Jumpman MVP Men's Shoes Size",
        image: product6,
        price: 400,
        size: '8',
    },
    {
        title: 'Men White Slim Fit T-shirt',
        image: product1,
        price: 70.9,
        size: 'M',
    },
    {
        title: 'HYPERX Cloud Gaming Headphone',
        image: product4,
        price: 230.9,
        size: 'M',
    },
];
