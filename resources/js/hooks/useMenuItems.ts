// resources/js/hooks/useMenuItems.ts

import { MenuItemType } from '@/types/menu';
import { usePage } from '@inertiajs/react';

type PageProps = {
    menu: MenuItemType[];
};

export const useMenuItems = (): MenuItemType[] => {

    const { menu } = usePage<PageProps>().props;

    return menu ?? [];

};

export const useHorizontalMenuItems = (): MenuItemType[] => {

    const { menu } = usePage<PageProps>().props;

    return menu ?? [];

};