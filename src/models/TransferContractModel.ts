import { number } from "yup";

export interface TransferFilesDetailModel {
    id: number;
    transferContractId: number;
    title: string;
    documentImg: string;
    documentDescription: string;
}
export interface TransferContractModel {
    id: number,
    transfererId: number,
    contractGroupId: number,
    dateTransfer: Date | null,
    deliveryAddress: string,
    currentCarStateSpeedometerNumber: number,
    currentCarStateFuelPercent: number,
    currentCarStateCurrentEtcAmount: number,
    currentCarStateCarStatusDescription: string,
    currentCarStateCarFrontImg: string,
    currentCarStateCarBackImg: string,
    currentCarStateCarLeftImg: string,
    currentCarStateCarRightImg: string,
    currentCarStateCarInteriorImg: string,
    currentCarStateCarBackSeatImg: string,
    depositItemPaper: string,
    depositItemAsset: string,
    depositItemAssetInfo: string,
    createdDate: Date | null,
    isExported: boolean | null,
    customerSignature: string | null,
    staffSignature: string | null,
    filePath: string,
    fileWithSignsPath: string,
    contractStatusId: number,
    contractStatus: number | null,
    transferContractFileDataModels: TransferFilesDetailModel[]
    depositItemDescription: string,
    depositItemDownPayment: number,
}
