import aws from '@/images/brands/aws.svg';
import bitbucket from '@/images/brands/bitbucket.svg';
import bootstrap from '@/images/brands/bootstrap.svg';
import digitalOcean from '@/images/brands/digital-ocean.svg';
import dribbble from '@/images/brands/dribbble.svg';
import dropbox from '@/images/brands/dropbox.svg';
import gitlab from '@/images/brands/gitlab.svg';
import googleCloud from '@/images/brands/google-cloud.svg';
import slack from '@/images/brands/slack.svg';

import flagsDe from '@/images/flags/de.svg';
import flagsEs from '@/images/flags/es.svg';
import flagsIn from '@/images/flags/in.svg';
import flagsIt from '@/images/flags/it.svg';
import flagsRu from '@/images/flags/ru.svg';
import flagsUs from '@/images/flags/us.svg';

import userAvatar10 from '@/images/users/avatar-10.jpg';
import userAvatar2 from '@/images/users/avatar-2.jpg';
import userAvatar4 from '@/images/users/avatar-4.jpg';
import userAvatar7 from '@/images/users/avatar-7.jpg';

import { addOrSubtractDaysFromDate } from '@/utils/date';

import { currency } from '@/context/constants';
import { ReactNode } from 'react';

export type AppsType = {
    name: string;
    image: string;
};

export type CountryType = {
    image: string;
    language: string;
};

export type NotificationType = {
    id: number;
    title: ReactNode;
    href?: string;
    image?: {
        image: string;
        icon: string;
        variant: string;
    };
    icon?: {
        icon: string;
        variant: string;
    };
    time: Date;
};


export const appData: AppsType[] = [
    {
        name: 'slack',
        image: slack,
    },
    {
        name: 'Gitlab',
        image: gitlab,
    },
    {
        name: 'Dribbble',
        image: dribbble,
    },
    {
        name: 'Bitbucket',
        image: bitbucket,
    },
    {
        name: 'Dropbox',
        image: dropbox,
    },
    {
        name: 'G Cloud',
        image: googleCloud,
    },
    {
        name: 'AWS',
        image: aws,
    },
    {
        name: 'Server',
        image: digitalOcean,
    },
    {
        name: 'Bootstrap',
        image: bootstrap,
    },
];

export const countryData: CountryType[] = [
    {
        image: flagsUs,
        language: 'English',
    },
    {
        image: flagsIn,
        language: 'Hindi',
    },
    {
        image: flagsDe,
        language: 'German',
    },
    {
        image: flagsIt,
        language: 'Italian',
    },
    {
        image: flagsEs,
        language: 'Spanish',
    },
    {
        image: flagsRu,
        language: 'Russian',
    },
];

export const notificationData: NotificationType[] = [
    {
        id: 1,
        title: (
            <>
                <span className="fw-medium text-body">Glady Haid</span> commented on <span className="fw-medium text-body">paces admin status</span>
            </>
        ),
        image: {
            image: userAvatar2,
            icon: 'tabler:message-circle',
            variant: 'danger',
        },
        time: addOrSubtractDaysFromDate(12),
    },
    {
        id: 2,
        title: (
            <>
                <span className="fw-medium text-body">Tommy Berry</span> donated <span className="text-success">{currency}100.00</span> for{' '}
                <span className="fw-medium text-body">Carbon removal program</span>
            </>
        ),
        image: {
            image: userAvatar4,
            icon: 'tabler:currency-dollar',
            variant: 'info',
        },
        time: addOrSubtractDaysFromDate(1),
    },
    {
        id: 3,
        title: (
            <>
                You withdraw a <span className="fw-medium text-body">{currency}500</span> by <span className="fw-medium text-body">New York ATM</span>
            </>
        ),
        icon: {
            icon: 'solar:wallet-money-bold-duotone',
            variant: 'success',
        },
        time: addOrSubtractDaysFromDate(250),
    },
    {
        id: 4,
        title: (
            <>
                <span className="fw-medium text-body">Richard Allen</span> followed you in <span className="fw-medium text-body">Facebook</span>
            </>
        ),
        image: {
            image: userAvatar7,
            icon: 'tabler:plus',
            variant: 'secondary',
        },
        time: addOrSubtractDaysFromDate(15),
    },
    {
        id: 5,
        title: (
            <>
                <span className="fw-medium text-body">Victor Collier</span> liked you recent photo in{' '}
                <span className="fw-medium text-body">Instagram</span>
            </>
        ),
        image: {
            image: userAvatar10,
            icon: 'tabler:heart-filled',
            variant: 'danger',
        },
        time: addOrSubtractDaysFromDate(2),
    },
];
