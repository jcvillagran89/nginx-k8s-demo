import { addOrSubtractDaysFromDate } from '@/utils/date';

export type CheckFilesType = {
    name: string;
    storage: number;
};

export type MedicalHistoryType = {
    icon: string;
    variant: string;
    title: string;
    description: string;
};

export type DietType = {
    icon: string;
    title: string;
    isDay?: boolean;
};

export type TreatmentType = {
    id: string;
    TreatmentType: string;
    date: Date;
    paymentStatus: 'Pending' | 'Paid';
};

export const checkFilesData: CheckFilesType[] = [
    {
        name: 'Agreement Meditation.zip',
        storage: 40.6,
    },
    {
        name: 'Lab Results Document',
        storage: 2.7,
    },
    {
        name: 'ECG Report (2 Page)',
        storage: 6.7,
    },
    {
        name: 'Cardio-report.pdf',
        storage: 4.7,
    },
    {
        name: 'Cardiology-invoice',
        storage: 1.2,
    },
];

export const medicalHistoryData: MedicalHistoryType[] = [
    {
        icon: 'solar:heart-pulse-bold',
        variant: 'danger',
        title: 'Chronic Disease',
        description: 'IHD, Obesity, Chronic thyroid disorder',
    },
    {
        icon: 'solar:waterdrop-bold',
        variant: 'primary',
        title: 'Diabetes Emergencies',
        description: 'Diabetic Ketoacidosis',
    },
    {
        icon: 'solar:medical-kit-bold',
        variant: 'warning',
        title: 'Sugary',
        description: 'Liposuction',
    },
    {
        icon: 'solar:users-group-two-rounded-bold',
        variant: 'info',
        title: 'Family Disease',
        description: 'Obesity (Father)',
    },
    {
        icon: 'solar:dropper-3-bold',
        variant: 'success',
        title: 'Diabetes Related Complication',
        description: 'Nephropathy, Neuropathy, Retinopathy, Diabetic foot',
    },
];

export const dietData: DietType[] = [
    {
        icon: 'solar:chef-hat-heart-bold-duotone',
        title: 'Intermittent fasting, Intermittent fasting,',
    },
    {
        icon: 'solar:chart-2-bold-duotone',
        title: 'Table Sugar , Daily Avg 3/6',
    },
    {
        icon: 'solar:virus-bold-duotone',
        title: 'Lactose , Beans',
    },
    {
        icon: 'solar:sleeping-circle-bold-duotone',
        title: '8 H (Continues) Sleeping',
    },
];

export const treatmentData: TreatmentType[] = [
    {
        id: 'ID3524',
        TreatmentType: 'Surgery',
        date: addOrSubtractDaysFromDate(10),
        paymentStatus: 'Pending',
    },
    {
        id: 'ID5723',
        TreatmentType: 'Physical Therapy',
        date: addOrSubtractDaysFromDate(110),
        paymentStatus: 'Paid',
    },
    {
        id: 'ID8563',
        TreatmentType: 'Chemotherapy',
        date: addOrSubtractDaysFromDate(210),
        paymentStatus: 'Paid',
    },
    {
        id: 'ID5233',
        TreatmentType: 'Radiation Therapy',
        date: addOrSubtractDaysFromDate(89),
        paymentStatus: 'Paid',
    },
    {
        id: 'ID4624',
        TreatmentType: 'Immunotherapy',
        date: addOrSubtractDaysFromDate(510),
        paymentStatus: 'Paid',
    },
];
