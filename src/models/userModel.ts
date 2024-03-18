export interface UserModel {
  id: number;
  name: string;
  phoneNumber: string;
  job: string;
  currentAddress: string;
  email: string;
  password: string;
  role: string;
  //GPLX: string,
  citizenIdentificationInfoNumber: string;
  citizenIdentificationInfoAddress: string;
  citizenIdentificationInfoDateReceive: Date | null;
  passportInfoNumber: string | null;
  passportInfoAddress: string | null;
  passportInfoDateReceive: Date | null;
  createdDate: Date | null;
  isDeleted: boolean;
  // passwordHash: string | null,
  // passwordSalt: string | null,
  cardImage: string;
  parkingLot: string | null;
  parkingLotId: number | null;
  //Avatar: string,
}
