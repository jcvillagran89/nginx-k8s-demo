export type PricingType = {
    title: string;
    description: string;
    price: number;
    features: {
        icon: string;
        title: string;
        variant: string;
    }[];
};

export const pricingData: PricingType[] = [
    {
        title: 'Professional',
        description: 'Everything a small team needs',
        price: 18,
        features: [
            {
                icon: 'tabler:circle-check-filled',
                title: 'Up to 10 people',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: 'Code extensibility',
                variant: 'primary',
            },

            {
                icon: 'tabler:circle-check-filled',
                title: 'Collect data',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-x-filled',
                title: 'Product Suppor',
                variant: 'muted',
            },
            {
                icon: 'tabler:circle-x-filled',
                title: ' Custom reports',
                variant: 'muted',
            },
            {
                icon: 'tabler:circle-x-filled',
                title: 'Activity reporting',
                variant: 'muted',
            },
        ],
    },
    {
        title: 'Teams',
        description: 'Foe growing business',
        price: 36,
        features: [
            {
                icon: 'tabler:circle-check-filled',
                title: 'Up to 15 people',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: ' Custom reports',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: 'Collect data',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: 'Product Suppor',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: 'Code extensibility',
                variant: 'primary',
            },
            {
                icon: 'tabler:circle-check-filled',
                title: 'Activity reporting',
                variant: 'primary',
            },
        ],
    },
];
