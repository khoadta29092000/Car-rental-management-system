export interface AppraisalRecordModel {
  id: number;
  carId: number | null;
  contractGroupId: number;
  expertiserId: number;
  expertiseDate: Date | null;
  resultOfInfo: boolean;
  resultOfCar: boolean;
  resultDescription: string;
  depositInfoCarRental: number;
  depositInfoDownPayment: number;
  //filePath: string | null;
}
