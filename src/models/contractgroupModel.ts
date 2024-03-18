import dayjs, { Dayjs } from "dayjs";
export interface CustomerFiles {
    typeOfDocument: string,
    title: string,
    documentImg: string,
    documentDescription: string | null,
}
export interface contractgroupModel {
    userId: number;
    carId: number | null;
    rentPurpose: string;
    rentFrom: Date | Dayjs ;
    rentTo: Date | Dayjs | null;
    requireDescriptionInfoCarBrand: string;
    requireDescriptionInfoSeatNumber: number | null;
    requireDescriptionInfoPriceForDay: number; // giá tiền
    //requireDescriptionInfoYearCreate: number | null; // cái gì dây
    requireDescriptionInfoCarColor: string;
    requireDescriptionInfoGearBox: string; // thêm
    deliveryAddress: string;
    customerName: string;
    customerPhoneNumber: string;
    customerEmail: string; // thêm
    customerAddress: string;
    customerSocialInfoZalo: string;
    customerSocialInfoFacebook: string;
    customerCitizenIdentificationInfoNumber: string;
    customerCitizenIdentificationInfoAddress: string;
    customerCitizenIdentificationInfoDate: Date | Dayjs | null
    relativeTel: string;
    companyInfo: string;
    customerFiles: CustomerFiles[];
}
