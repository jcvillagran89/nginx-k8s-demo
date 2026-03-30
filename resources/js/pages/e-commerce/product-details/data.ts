import product10 from '@/images/products/p-10.png';
import product11 from '@/images/products/p-11.png';
import product12 from '@/images/products/p-12.png';
import product3 from '@/images/products/p-3.png';
import product9 from '@/images/products/p-9.png';

export type ProductRatingType = {
    star: number;
    length: number;
    count: number;
};
export type ShopProductRatingType = {
    image: string;
    rating: number;
};
export type ShopOffersType = {
    icon: string;
    title: string;
};

export const productRatingData: ProductRatingType[] = [
    {
        star: 5,
        length: 90,
        count: 4525,
    },
    {
        star: 4,
        length: 70,
        count: 2343,
    },
    {
        star: 3,
        length: 30,
        count: 221,
    },
    {
        star: 2,
        length: 20,
        count: 109,
    },
    {
        star: 1,
        length: 10,
        count: 129,
    },
];

export const shopRatingData: ProductRatingType[] = [
    {
        star: 5,
        length: 70,
        count: 3641,
    },
    {
        star: 4,
        length: 65,
        count: 2912,
    },
    {
        star: 3,
        length: 60,
        count: 321,
    },
    {
        star: 2,
        length: 30,
        count: 231,
    },
    {
        star: 1,
        length: 20,
        count: 149,
    },
];

export const shopProductRating: ShopProductRatingType[] = [
    {
        image: product3,
        rating: 4.5,
    },
    {
        image: product9,
        rating: 4.2,
    },
    {
        image: product10,
        rating: 3.5,
    },
    {
        image: product11,
        rating: 5,
    },
    {
        image: product12,
        rating: 4.4,
    },
];

export const shopOffersData: ShopOffersType[] = [
    {
        icon: 'solar:refresh-square-bold',
        title: 'Free Return',
    },
    {
        icon: 'solar:money-bag-bold',
        title: 'Multiple Payment Option',
    },
    {
        icon: 'solar:sofa-2-bold-duotone',
        title: 'Free Assembly',
    },
    {
        icon: 'solar:verified-check-bold',
        title: 'Guaranteed Product Replace',
    },
    {
        icon: 'solar:tram-bold',
        title: 'Fast & Free Shipping',
    },
    {
        icon: 'solar:tag-price-bold',
        title: 'Your Best Price Matching',
    },
    {
        icon: 'solar:headphones-round-bold',
        title: '24/7 Support',
    },
    {
        icon: 'solar:card-2-bold',
        title: 'Secure Checkout',
    },
];
