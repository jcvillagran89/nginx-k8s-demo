export type ProductStat = {
    icon: string;
    title: string;
    count: number;
};

export type PopularBrandType = {
    brand: string;
};

export type PopularCategoriesType = {
    title: string;
    count: number;
};

export type RatingType = {
    star: number;
    count: number;
};

export const productStatData: ProductStat[] = [
    {
        icon: 'solar:t-shirt-bold-duotone',
        title: 'Fashion Men & Women',
        count: 2120,
    },
    {
        icon: 'solar:sofa-2-bold-duotone',
        title: 'Furniture Sofa & Chair',
        count: 624,
    },
    {
        icon: 'solar:headphones-round-sound-bold-duotone',
        title: 'Electronics Items',
        count: 667,
    },
    {
        icon: 'solar:glasses-bold-duotone',
        title: 'Eye Ware & Sunglass',
        count: 98,
    },
];

export const popularBrands: PopularBrandType[] = [
    {
        brand: 'Samsung',
    },
    {
        brand: 'Sony',
    },
    {
        brand: 'Apple',
    },
    {
        brand: 'H & M',
    },
    {
        brand: 'Black Berry',
    },
    {
        brand: 'Skullcandy',
    },
    {
        brand: 'Zara',
    },
    {
        brand: 'Noise',
    },
    {
        brand: 'Nike',
    },
    {
        brand: 'Adidas',
    },
];

export const popularCategoriesData: PopularCategoriesType[] = [
    {
        title: 'All Categories',
        count: 5352,
    },
    {
        title: 'Furniture',
        count: 624,
    },
    {
        title: 'Headphones',
        count: 351,
    },
    {
        title: 'Eye Ware & Sunglass',
        count: 98,
    },
    {
        title: 'Foot Ware',
        count: 452,
    },
    {
        title: "Fashion Men , Women & Kid's",
        count: 2120,
    },
    {
        title: 'Electronics Items',
        count: 667,
    },
    {
        title: 'Watches',
        count: 80,
    },
    {
        title: 'Beauty & Health',
        count: 960,
    },
];

export const ratingData: RatingType[] = [
    {
        star: 5,
        count: 452,
    },
    {
        star: 4,
        count: 622,
    },
    {
        star: 3,
        count: 389,
    },
    {
        star: 2,
        count: 215,
    },
    {
        star: 1,
        count: 546,
    },
];
