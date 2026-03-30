import {
    appointmentsData,
    brandListData,
    customersData,
    dataTableRecords,
    departmentData,
    doctorListData,
    doctorsData,
    filesData,
    invoicesData,
    patientsData,
    paymentData,
    reviewData,
    sellersData,
    socialUserData,
    transactionData,
    userData,
} from '@/data/other';
import { orderData, productData } from '@/data/products';
import { emailsData } from '@/data/social';
import {
    AppointmentType,
    BrandListType,
    CustomersType,
    DepartmentType,
    DoctorListType,
    DoctorsType,
    EmailType,
    Employee,
    FilesType,
    InvoicesType,
    OrderType,
    PatientsType,
    PaymentType,
    ProductType,
    ReviewType,
    SellersType,
    SocialUserType,
    TransactionType,
    UserType,
} from '@/types/data';
import { sleep } from '@/utils/promise';

export const getProducts = async (): Promise<ProductType[]> => {
    await sleep();
    return productData;
};

export const getBrandsList = async (): Promise<BrandListType[]> => {
    return brandListData;
};

export const getAllUsers = async (): Promise<UserType[]> => {
    return userData;
};

export const getAllDoctors = async (): Promise<DoctorsType[]> => {
    await sleep();
    return doctorsData;
};

export const getAllDoctorList = async (): Promise<DoctorListType[]> => {
    await sleep();
    return doctorListData;
};

export const getAllSellers = async (): Promise<SellersType[]> => {
    await sleep();
    return sellersData;
};

export const getAllDepartments = async (): Promise<DepartmentType[]> => {
    await sleep();
    return departmentData;
};

export const getAllDataTableRecords = async (): Promise<Employee[]> => {
    await sleep();
    return dataTableRecords;
};

export const getAllTransaction = async (): Promise<TransactionType[]> => {
    await sleep();
    return transactionData;
};

export const getAllEmails = async (): Promise<EmailType[]> => {
    await sleep();
    return emailsData;
};

export const getAllAppointment = async (): Promise<AppointmentType[]> => {
    const data = appointmentsData.map((item: AppointmentType) => {
        const doctors = doctorsData.find((doctor: DoctorsType) => doctor.id === item.doctorsId);
        return {
            ...item,
            doctors,
        };
    });
    await sleep();
    return data;
};

export const getUserById = async (id: UserType['id']): Promise<UserType | void> => {
    const user = userData.find((user: UserType) => user.id === id);
    if (user) {
        await sleep();
        return user;
    }
};

export const getAllFiles = async (): Promise<FilesType[]> => {
    const data = filesData.map((item: FilesType) => {
        const user = socialUserData.find((user: SocialUserType) => user.id == item.userId);
        return {
            ...item,
            user,
        };
    });
    await sleep();
    return data;
};

export const getAllPatients = async (): Promise<PatientsType[]> => {
    const data = patientsData.map((item: PatientsType) => {
        const user = socialUserData.find((user: SocialUserType) => user.id == item.userId);
        return {
            ...item,
            user,
        };
    });
    await sleep();
    return data;
};

export const getAllOrders = async (): Promise<OrderType[]> => {
    const data = orderData.map((item: OrderType) => {
        const users = socialUserData.find((user: SocialUserType) => user.id == item.userId);
        return {
            ...item,
            users,
        };
    });
    await sleep();
    return data;
};

export const getAllCustomers = async (): Promise<CustomersType[]> => {
    const data = customersData.map((item: CustomersType) => {
        const users = socialUserData.find((user: SocialUserType) => user.id == item.userId);
        return {
            ...item,
            users,
        };
    });
    await sleep();
    return data;
};

export const getAllPayments = async (): Promise<PaymentType[]> => {
    const data = paymentData.map((item: PaymentType) => {
        const user = socialUserData.find((user: SocialUserType) => user.id === item.userId);
        const doctors = doctorsData.find((doctor: DoctorsType) => doctor.id === item.doctorsId);
        return {
            ...item,
            user,
            doctors,
        };
    });
    await sleep();
    return data;
};

//invoicesData : InvoicesType
export const getAllInvoices = async (): Promise<InvoicesType[]> => {
    const data = invoicesData.map((item: InvoicesType) => {
        const users = socialUserData.find((user: SocialUserType) => user.id === item.userId);
        const products = productData.find((product: ProductType) => product.id === item.productId);
        return {
            ...item,
            users,
            products,
        };
    });
    await sleep();
    return data;
};

export const getAllReviews = async (): Promise<ReviewType[]> => {
    const data = reviewData.map((item: ReviewType) => {
        const doctors = doctorListData.find((doctor: DoctorListType) => doctor.id == item.doctorsId);
        return {
            ...item,
            doctors,
        };
    });
    await sleep();
    return data;
};
