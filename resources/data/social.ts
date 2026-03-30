import small1 from '@/images/small/small-1.jpg';
import small2 from '@/images/small/small-2.jpg';
import small3 from '@/images/small/small-3.jpg';
import avatar10 from '@/images/users/avatar-10.jpg';
import { ChatMessageType, EmailType, UserType } from '@/types/data';
import { addOrSubtractDaysFromDate, addOrSubtractMinutesFromDate } from '@/utils/date';
import { userData } from './other';

import amazonImg from '@/images/brands/amazon.svg';
import digitalOceanImg from '@/images/brands/digital-ocean.svg';
import dribbbleImg from '@/images/brands/dribbble.svg';
import gitlabImg from '@/images/brands/gitlab.svg';
import instagramImg from '@/images/brands/instagram.svg';
import linkedinImg from '@/images/brands/linkedin.svg';
import avatar2 from '@/images/users/avatar-2.jpg';
import avatar3 from '@/images/users/avatar-3.jpg';
import avatar4 from '@/images/users/avatar-4.jpg';
import avatar5 from '@/images/users/avatar-5.jpg';
import avatar6 from '@/images/users/avatar-6.jpg';
import avatar7 from '@/images/users/avatar-7.jpg';
import avatar8 from '@/images/users/avatar-8.jpg';
import avatar9 from '@/images/users/avatar-9.jpg';

export const messages: ChatMessageType[] = [];

const defaultTo: UserType = {
    id: '1012',
    name: 'Gilbert Chicoine',
    image: avatar10,
    email: 'robert@example.com',
    message: 'Hey! Okay, thank you for letting me know. See you!',
    date: addOrSubtractMinutesFromDate(650),
};

for (const user of userData) {
    messages.push(
        {
            id: '1001',
            to: defaultTo,
            from: user,
            message: {
                type: 'text',
                value: 'Hey 😊',
            },
            sentOn: addOrSubtractMinutesFromDate(110),
        },
        {
            id: '1002',
            to: user,
            from: defaultTo,
            message: {
                type: 'text',
                value: 'Hii',
            },
            sentOn: addOrSubtractMinutesFromDate(110),
        },
        {
            id: '1003',
            to: defaultTo,
            from: user,
            message: {
                type: 'text',
                value: "Hi Gaston, thanks for joining the meeting. Let's dive into our quarterly performance review.",
            },
            sentOn: addOrSubtractMinutesFromDate(110),
        },
        {
            id: '1004',
            to: user,
            from: defaultTo,
            message: {
                type: 'text',
                value: "Hi Gilbert, thanks for having me. I'm ready to discuss how things have been going.",
            },
            sentOn: addOrSubtractMinutesFromDate(110),
        },
        {
            id: '1005',
            to: defaultTo,
            from: user,
            message: {
                type: 'file',
                value: [{ preview: small1 }, { preview: small2 }, { preview: small3 }],
            },
            sentOn: addOrSubtractMinutesFromDate(110),
        },
        {
            id: '1006',
            to: user,
            from: defaultTo,
            message: {
                type: 'file',
                value: [{ name: 'financial-report-2024.zip', size: 2.3 }],
            },
            sentOn: addOrSubtractMinutesFromDate(20),
        },
        {
            id: '1007',
            to: defaultTo,
            from: user,
            message: {
                type: 'text',
                value: "Thanks, Emily. I appreciate your support. Overall, I'm optimistic about our team's performance and looking forward to tackling new challenges in the next quarter.",
            },
            sentOn: addOrSubtractMinutesFromDate(10),
        },
    );
}

export const emailsData: EmailType[] = [
    {
        id: '2001',
        isStar: false,
        image: avatar2,
        name: 'George Thomas',
        subTitle: 'Request For Information',
        description: 'I hope you are doing well. I have a small request. Can you please...',
        date: addOrSubtractDaysFromDate(12),
        variant: 'danger',
    },
    {
        id: '2002',
        isStar: true,
        image: avatar3,
        name: 'Robert C. Lane',
        subTitle: 'Invitation For Meeting',
        description: 'Good Morning, I hope this email finds you well. I am writing to extra...',
        IsAttachment: 2,
        date: addOrSubtractDaysFromDate(21),
        variant: 'success',
    },
    {
        id: '2003',
        isStar: false,
        image: dribbbleImg,
        name: 'Dribbble',
        subTitle: 'Become a successful self-taught designer',
        description: "There's no one right way to learn design. In fa...",
        date: addOrSubtractDaysFromDate(145),
        variant: 'info',
    },
    {
        id: '2004',
        isStar: true,
        image: avatar5,
        name: 'Darren C. Gallimore',
        subTitle: 'Holiday Notice',
        description: 'Good Evening, I hope you are doing well. I have a small request.',
        date: addOrSubtractDaysFromDate(12),
    },
    {
        id: '2005',
        isStar: false,
        image: avatar9,
        name: 'Mike A. Bell',
        subTitle: 'Offer Letter',
        description: 'Thank you for applying. I hope you are doing well. I have a small.',
        date: addOrSubtractDaysFromDate(45),
        variant: 'secondary',
    },
    {
        id: '2006',
        isStar: true,
        image: avatar6,
        name: 'Bennett C. Rice',
        subTitle: 'Apology Letter',
        description: 'I hope you are doing well. I have a small request. Can you please',
        IsAttachment: 4,
        date: addOrSubtractDaysFromDate(89),
    },
    {
        id: '2007',
        isStar: false,
        image: gitlabImg,
        name: 'John J. Bowser',
        subTitle: 'How to get started on Gitlab',
        description: 'We know setting off on a freelancing journey can feel intim...',
        IsAttachment: 3,
        date: addOrSubtractDaysFromDate(78),
    },
    {
        id: '2008',
        isStar: false,
        image: avatar8,
        name: 'Jill N. Neal',
        subTitle: 'Apply For Executive Position',
        description: 'I am writing to express my keen interest in the Executive Po...',
        date: addOrSubtractDaysFromDate(158),
        variant: 'success',
    },
    {
        id: '2009',
        isStar: false,
        image: instagramImg,
        name: 'Instagram',
        subTitle: 'You have received 2 new followers',
        description: '2 new followers, 1 new collected project, and more at...',
        date: addOrSubtractDaysFromDate(320),
        variant: 'info',
    },
    {
        id: '2010',
        isStar: false,
        image: amazonImg,
        name: 'Amazon',
        subTitle: 'Your order is shipped',
        description: 'Your order is on the way with tracking...',
        IsAttachment: 1,
        date: addOrSubtractDaysFromDate(478),
        variant: 'success',
    },
    {
        id: '2011',
        isStar: true,
        image: avatar7,
        name: 'Alfredo D. Rico',
        subTitle: 'Class schedule',
        description: 'Your online class will be held on Saturday at 2:30 pm Bangladesh.',
        date: addOrSubtractDaysFromDate(14),
        variant: 'secondary',
    },
    {
        id: '2012',
        isStar: false,
        image: avatar4,
        name: 'Vernon B. Rutter',
        subTitle: 'Invitation to attend our Exclusive Webinar',
        description: 'An exclusive webinar will be held on 23 January...',
        date: addOrSubtractDaysFromDate(890),
        variant: '',
    },
    {
        id: '2013',
        isStar: true,
        image: digitalOceanImg,
        name: 'Digital Ocean',
        subTitle: "Update to Discord's Policies",
        description: 'Hey! we wanted to let you know that we are updating our Te...',
        date: addOrSubtractDaysFromDate(14),
        variant: 'danger',
    },
    {
        id: '2014',
        isStar: true,
        image: linkedinImg,
        name: 'Linkedin',
        subTitle: 'New job similar to UI/UX',
        description: 'Jobs similar to UI/UX Designer at St Trinity Property group and s...',
        IsAttachment: 4,
        date: addOrSubtractDaysFromDate(89),
        variant: 'success',
    },
];
