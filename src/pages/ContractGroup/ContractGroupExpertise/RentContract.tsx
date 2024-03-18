import HistoryIcon from "@mui/icons-material/History";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import { Button, Skeleton, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { eachDayOfInterval, isWeekend } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertComponent } from "../../../Components/AlertComponent";
import { useAppSelector } from "../../../hooks";
import {
  AppraisalRecordAction,
  getByIdAppraisalRecordReducerAsyncApi,
} from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import {
  carAction,
  getCarByIdAsyncApi,
} from "../../../redux/CarReducer/CarReducer";
import {
  putStatusCarContractgroupReducercarAsyncApi
} from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import {
  getRentContractByContractIdAsyncApi,
  getRentContractFilesByContractIdAsyncApi,
  postRentContractReducerAsyncApi,
  rentContractAction,
} from "../../../redux/RentContractReducer/RentContractReducer";
import {
  getProfileAsyncApi,
  userAction,
} from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { PopupFail } from "../Component/PopupFail";
import { PopupHistory } from "../Component/PopupHistory";
import { PopupPdf } from "../Component/PopupPdf";
import { NavLink } from 'react-router-dom';
function parseToVND(number: any) {
  let strNumber = number.toString().replace(/[.,]/g, "");
  strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return strNumber;
}
export default function RentContract(props: any) {
  let { parentCallbackAlert, parentCallbackMessageAlert } = props;
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [description, setDescription] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [
    carGeneralInfoAtRentPricePerHourExceed,
    setCarGeneralInfoAtRentPricePerHourExceed,
  ] = useState(0);
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);

  const [openHistory, setOpenHistory] = useState(false);
  function handeClickOpenHistory() {
    setOpenHistory(true);
  }
  let callbackFunctionPopupHistory = (childData: any) => {
    setOpenHistory(childData);
  };
  const dispatch: DispatchType = useDispatch();
  const { contractgroupDetails } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { CarResultDetail } = useAppSelector(
    (state: RootState) => state.CarResult
  );
  const { AppraisalRecord } = useAppSelector(
    (state: RootState) => state.AppraisalRecord
  );
  const { rentContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  const { user } = useAppSelector((state: RootState) => state.user);
  function ApiCarById(values: any) {
    const actionGetCarById = getCarByIdAsyncApi(values);
    dispatch(actionGetCarById);
  }
  function ApiAppraisalRecordById(values: any) {
    const actionGetCarById = getByIdAppraisalRecordReducerAsyncApi(values);
    dispatch(actionGetCarById);
  }

  function handlechangeTime() { }
  const handleChangeDeliveryFee = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // lọc bỏ tất cả ký tự không phải số
    const parsedValue = parseInt(value, 10); // chuyển về kiểu số hệ 10
    if (!isNaN(parsedValue) && parsedValue < 10000000000) { // kiểm tra giá trị nhỏ hơn 10 tỷ
      setDeliveryFee(parsedValue);
    }
  };
  const { rentContractFiles } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  function ApiGetRentContractFilter(values: any) {
    const actionGetRentContractFilter =
      getRentContractFilesByContractIdAsyncApi(values);
    dispatch(actionGetRentContractFilter);
  }
  function ApiGetRentContractByStatusContracId(values: any) {
    const actionGetRentContractByStatusContracId =
      getRentContractByContractIdAsyncApi(values);
    dispatch(actionGetRentContractByStatusContracId).then((response: any) => {
      if (response.payload != undefined) {
        dispatch(getProfileAsyncApi(response.payload.representativeId));
        ApiGetRentContractFilter(response.payload.id)
        setDeliveryFee(response.payload.deliveryFee)
      }
    });
  }


  function handleChangeCreateContract() {
    const actionPostRentContract = postRentContractReducerAsyncApi({
      contractGroupId: contractgroupDetails.id,
      representativeId: userProfile?.id,
      deliveryAddress: contractgroupDetails?.deliveryAddress,
      carGeneralInfoAtRentPriceForNormalDay: CarResultDetail.priceForNormalDay,
      carGeneralInfoAtRentPriceForWeekendDay:
        CarResultDetail.priceForWeekendDay,
      carGeneralInfoAtRentPricePerKmExceed: CarResultDetail.overLimitedMileage,
      carGeneralInfoAtRentPricePerHourExceed: 100000,
      carGeneralInfoAtRentLimitedKmForMonth: CarResultDetail.limitedKmForMonth,
      carGeneralInfoAtRentPriceForMonth: CarResultDetail.priceForMonth,
      createdDate: new Date(),
      paymentAmount: newPrice,
      deliveryFee: deliveryFee == null ? 0 : deliveryFee  ,
      // depositItemDescription: description,
    });
    dispatch(actionPostRentContract).then((response: any) => {
      if (response.payload != undefined) {
        parentCallbackAlert("success");
        parentCallbackMessageAlert("Tạo hợp đồng thành công");
      }
    });
  }
  useEffect(() => {
    if (contractgroupDetails.contractGroupStatusId != 5) {
      ApiGetRentContractByStatusContracId(contractgroupDetails.id)
    }
    ApiCarById(contractgroupDetails.carId);
    ApiAppraisalRecordById(contractgroupDetails.id);
    return () => {
      dispatch(carAction.resetCar());
      dispatch(userAction.resetUser());
      dispatch(rentContractAction.deleteRentContract());
      dispatch(AppraisalRecordAction.deleteAppraiselAction());
    };
  }, []);
  const handleClickOpenAdd = () => {
    setOpen(true);
  };
  const handleClickOpenFail = () => {
    setOpenFail(true);
  };
  let callbackFunctionAlert = (childData: any) => {
    //setAlert(childData);
    parentCallbackAlert(childData);
  };
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopupFaild = (childData: any) => {
    setOpenFail(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    //setMessageAlert(childData);
    parentCallbackMessageAlert(childData);
  };
  function handleChangeStatusContractGroup(values: any) {
    const actionPutContractGroup =
      putStatusCarContractgroupReducercarAsyncApi(values);
    dispatch(actionPutContractGroup).then((response: any) => {
      if (response.payload != undefined) {
        setAlert("success");
        setMessageAlert("Hoàn Thành hợp đồng thuê");
      }
    });
  }
  const peiceCarDay = CarResultDetail?.priceForNormalDay;
  const peiceCarWeek = CarResultDetail?.priceForWeekendDay;
  const peiceCarMonth = CarResultDetail?.priceForMonth;
  const startDate = contractgroupDetails?.rentFrom
    ? new Date(contractgroupDetails.rentFrom)
    : new Date(); // Ngày bắt đầu
  const endDate = contractgroupDetails?.rentTo
    ? new Date(contractgroupDetails.rentTo)
    : new Date(); // Ngày kết thúc
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = dates.filter((date) => !isWeekend(date));
  const weekends = dates.filter((date) => isWeekend(date));
  const newPrice = (weekdays.length + weekends.length) < 30 ?
    weekdays.length * peiceCarDay + weekends.length * peiceCarWeek
    : (weekdays.length + weekends.length) * peiceCarMonth;
  let ButtonView;
  let expertiseView;
  let carRentalFee;
  if (contractgroupDetails.contractGroupStatusId == 5) {
    ButtonView = (
      <>
        <Button
          type="submit"
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="success"
          onClick={handleChangeCreateContract}
        >
          TẠO HỢP ĐỒNG
        </Button>
      </>
    );
  } else if (contractgroupDetails.contractGroupStatusId == 6) {
    ButtonView = (
      <>
        <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleClickOpenAdd}
        >
          XEM PDF
        </Button>
        <Button
          color="error"
          className="btn-choose-car mr-5"
          variant="contained"
          onClick={handleClickOpenFail}
        >
          THẤT BẠI
        </Button>
      </>
    );
  } else if (contractgroupDetails.contractGroupStatusId == 7) {
    ButtonView = (
      <>
        <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleClickOpenAdd}
        >
          XEM PDF
        </Button>
        <Button
          className="btn-choose-car mr-5"
          variant="contained"
          onClick={() =>
            handleChangeStatusContractGroup({
              id: contractgroupDetails?.id,
              contractGroupStatusId: 8,
            })
          }
        >
          HOÀN THÀNH
        </Button>
      </>
    );
  } else {
    ButtonView = (
      <>
        <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleClickOpenAdd}
        >
          XEM PDF
        </Button>
      </>
    );
  }
  if (contractgroupDetails.contractGroupStatusId !== 5) {
    expertiseView = (
      <div className="grid grid-cols-3">
        <div>
          <h2 className="text-xl font-bold mb-2">Nhân viên thẩm định</h2>
          <p className="text-gray-400">
            Người thẩm định khách hàng và lên hợp đồng
          </p>
        </div>
        {user?.id != 0 ? (
          <div className="col-span-2 ml-4">
            <div className="mb-5">
              <p className="font-semibold mb-2">Họ và tên</p>
              <input
                value={user?.name}
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Số điện thoại</p>
              <input
                value={user?.phoneNumber}
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Email</p>
              <input
                value={user?.email}
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
              />
            </div>
          </div>
        ) : (
          <div className="col-span-2 ml-4">
            <div className="mb-5">
              <p className="font-semibold mb-2">Họ và tên</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Số điện thoại</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Email</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
          </div>
        )}
      </div>
    );
  }
  if (contractgroupDetails.contractGroupStatusId == 5) {
    carRentalFee =
      CarResultDetail?.id != 0 ? (
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Biểu phí thuê xe</h2>
            <p className="text-gray-400">Các mức giá thuê xe theo quy định</p>
          </div>
          <div className="col-span-2 ml-4 ">
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày thường(vnđ)</p>
              <input
                value={
                  CarResultDetail?.priceForNormalDay != null
                    ? parseToVND(CarResultDetail?.priceForNormalDay) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày cuối tuần(vnđ)</p>
              <input
                value={
                  CarResultDetail?.priceForWeekendDay != null
                    ? parseToVND(CarResultDetail?.priceForWeekendDay) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Theo tháng(vnđ)</p>
              <input
                value={
                  CarResultDetail?.priceForMonth != null
                    ? parseToVND(CarResultDetail?.priceForMonth) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Quá số Km(Km)</p>
              <input
                value={
                  CarResultDetail?.overLimitedMileage != null
                    ? parseToVND(CarResultDetail?.overLimitedMileage) + " Km"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Giới hạn(Km)</p>
              <input
                value={
                  CarResultDetail?.limitedKmForMonth != null
                    ? parseToVND(CarResultDetail?.limitedKmForMonth) + " Km"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400  bg-gray-100"
              />
            </div>
            {/* <div className="mb-5">
            <p className="font-semibold mb-2">Tiền phạt quá giờ</p>
            <input
              value={carGeneralInfoAtRentPricePerHourExceed}
              onChange={(e) => setCarGeneralInfoAtRentPricePerHourExceed(e.target.)}
              className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400  bg-gray-100"
            />
          </div> */}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Biểu phí thuê xe</h2>
            <p className="text-gray-400">Các mức giá thuê xe theo quy định</p>
          </div>
          <div className="col-span-2 ml-4 ">
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày thường(vnđ)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày cuối tuần(vnđ)</p>
              <input
                value={
                  CarResultDetail?.priceForWeekendDay != null
                    ? parseToVND(CarResultDetail?.priceForWeekendDay) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Theo tháng(vnđ)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Quá số Km(Km)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Giới hạn(Km)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            {/* <div className="mb-5">
            <p className="font-semibold mb-2">Tiền phạt quá giờ</p>
            <input
              value={carGeneralInfoAtRentPricePerHourExceed}
              onChange={(e) => setCarGeneralInfoAtRentPricePerHourExceed(e.target.)}
              className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400  bg-gray-100"
            />
          </div> */}
          </div>
        </div>
      );
  } else {
    carRentalFee =
      rentContractDetailByContractId != null ? (
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Biểu phí thuê xe</h2>
            <p className="text-gray-400">Các mức giá thuê xe theo quy định</p>
          </div>
          <div className="col-span-2 ml-4 ">
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày thường</p>
              <input
                value={
                  rentContractDetailByContractId?.carGeneralInfoAtRentPriceForNormalDay !=
                    null
                    ? parseToVND(
                      rentContractDetailByContractId?.carGeneralInfoAtRentPriceForNormalDay
                    )
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>

            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày cuối tuần</p>
              <input
                value={
                  rentContractDetailByContractId?.carGeneralInfoAtRentPriceForWeekendDay !=
                    null
                    ? parseToVND(
                      rentContractDetailByContractId?.carGeneralInfoAtRentPriceForWeekendDay
                    )
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Theo tháng</p>
              <input
                value={
                  rentContractDetailByContractId?.carGeneralInfoAtRentPriceForMonth !=
                    null
                    ? parseToVND(
                      rentContractDetailByContractId?.carGeneralInfoAtRentPriceForMonth
                    )
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Quá số Km</p>
              <input
                value={
                  rentContractDetailByContractId?.carGeneralInfoAtRentPricePerKmExceed !=
                    null
                    ? rentContractDetailByContractId?.carGeneralInfoAtRentPricePerKmExceed +
                    " Km"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Giới hạn</p>
              <input
                value={
                  rentContractDetailByContractId?.carGeneralInfoAtRentLimitedKmForMonth !=
                    null
                    ? rentContractDetailByContractId?.carGeneralInfoAtRentLimitedKmForMonth +
                    " Km"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400  bg-gray-100"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Biểu phí thuê xe</h2>
            <p className="text-gray-400">Các mức giá thuê xe theo quy định</p>
          </div>
          <div className="col-span-2 ml-4 ">
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày thường (vnđ)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Ngày cuối tuần(vnđ)</p>
              <input
                value={
                  CarResultDetail?.priceForWeekendDay != null
                    ? parseToVND(CarResultDetail?.priceForWeekendDay) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Theo tháng (vnđ)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Quá số Km (Km)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Giới hạn (Km)</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            {/* <div className="mb-5">
          <p className="font-semibold mb-2">Tiền phạt quá giờ</p>
          <input
            value={carGeneralInfoAtRentPricePerHourExceed}
            onChange={(e) => setCarGeneralInfoAtRentPricePerHourExceed(e.target.)}
            className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400  bg-gray-100"
          />
        </div> */}
          </div>
        </div>
      );
  }
  return (
    <>
      <div className="flex">
        <h2 className="font-sans  text-2xl font-bold uppercase ">
          Hợp đồng thuê xe
        </h2>
        <div onClick={handeClickOpenHistory} className="ml-auto xl:mr-10">
          <Button
            startIcon={<HistoryIcon />}
            className="bg-blue-500"
            variant="contained"
          >
            Lịch sử
          </Button>
        </div>
      </div>

      <div className="mt-5 max-w-6xl mx-auto">
        {expertiseView}
        <hr className="mt-2" />
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">Thông tin xe</h2>
            <p className="text-gray-400">
              Xe khách hàng sử dụng trong thời gian hợp đồng
            </p>
          </div>
          {CarResultDetail?.id != 0 ? (
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">Hình ảnh của xe</p>
                <div className="grid lg:grid-cols-2 gap-5 mb-5">
                  <div>
                    <img
                      className="h-72 w-72"
                      src={CarResultDetail?.rightImg}
                    />
                  </div>
                  <div>
                    <img className="h-72 w-72" src={CarResultDetail?.leftImg} />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <img
                      className="h-72 w-72"
                      src={CarResultDetail?.frontImg}
                    />
                  </div>
                  <div>
                    <img className="h-72 w-72" src={CarResultDetail?.backImg} />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Tên xe</p>
                <input
                  value={
                    CarResultDetail?.modelName != null
                      ? CarResultDetail?.modelName
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hãng xe</p>
                <input
                  value={
                    CarResultDetail?.makeName != null
                      ? CarResultDetail?.makeName
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phiên bản</p>
                <input
                  value={
                    CarResultDetail?.generationName != null
                      ? CarResultDetail?.generationName
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phân Khúc</p>
                <input
                  value={
                    CarResultDetail?.seriesName != null
                      ? CarResultDetail?.seriesName
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Truyền động</p>
                <input
                  value={
                    CarResultDetail?.trimName != null
                      ? CarResultDetail?.trimName
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Năm sản xuất</p>
                <input
                  value={
                    CarResultDetail?.modelYear != null
                      ? CarResultDetail?.modelYear
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Màu xe</p>
                <input
                  value={
                    CarResultDetail?.carColor != null
                      ? CarResultDetail?.carColor
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số ghế</p>
                <input
                  value={
                    CarResultDetail?.seatNumber != null
                      ? CarResultDetail?.seatNumber
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Biển số xe</p>
                <input
                  value={
                    CarResultDetail?.carLicensePlates != null
                      ? CarResultDetail?.carLicensePlates
                      : ""
                  }
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
            </div>
          ) : (
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">Hình ảnh của xe</p>
                <div className="grid lg:grid-cols-2 gap-5 mb-5">
                  <div>
                    <Skeleton variant="rectangular" className="w-full h-72 " />
                  </div>
                  <div>
                    <Skeleton variant="rectangular" className="w-full h-72" />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <Skeleton variant="rectangular" className="w-full h-72" />
                  </div>
                  <div>
                    <Skeleton variant="rectangular" className="w-full h-72" />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Tên xe</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hãng xe</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phiên bản</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phân Khúc</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Truyền động</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Năm sản xuất</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Màu xe</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số ghế</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Biển số xe</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
            </div>
          )}
        </div>
        <hr className="mt-2" />
        {carRentalFee}
        <hr className="mt-2" />
        <div className="grid grid-cols-3 mt-5">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Thông tin đặt cọc và thời gian thuê
            </h2>
            <p className="text-gray-400">
              các thông tin của bảng hợp đồng trước
            </p>
          </div>
          <div className="col-span-2 ml-4 ">
            <div className="mb-5 lg:grid lg:grid-cols-5">
              <div className="lg:mr-5 lg:col-span-2">
                <p className="font-semibold mb-2">Thuê từ ngày</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      value={contractgroupDetails.rentFrom}
                      className=""
                      inputFormat="DD/MM/YYYY "
                      onChange={handlechangeTime}
                      disabled
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              bgcolor: "rgb(243 244 246)",
                            },
                            '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator':
                            {
                              backgroundColor: "rgb(243 244 246)",
                            },
                          }}
                          {...params}
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
              <RepeatOutlinedIcon className="my-2 lg:mx-auto lg:mt-7 lg:my-0" />
              <div className="lg:ml-5 lg:col-span-2">
                <p className="font-semibold mb-2">đến ngày</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      value={contractgroupDetails.rentTo}
                      inputFormat="DD/MM/YYYY "
                      onChange={handlechangeTime}
                      disabled
                      className="lg:w-full "
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              bgcolor: "rgb(243 244 246)",
                            },
                          }}
                          {...params}
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </div>
            {/* <div className="mb-5">
              <p className="font-semibold mb-2">giá trị đặt cọc(vnđ)</p>
              <input
                value={
                  AppraisalRecord?.depositInfoCarRental != null
                    ? parseToVND(AppraisalRecord?.depositInfoCarRental) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div> */}
            <div className="mb-5">
              <p className="font-semibold mb-2">Giá trị thế chấp (vnđ)</p>
              <input
                value={
                  AppraisalRecord?.depositInfoDownPayment != null
                    ? parseToVND(AppraisalRecord?.depositInfoDownPayment) + " đ"
                    : ""
                }
                disabled
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Giá trị hợp đồng (vnđ)</p>
              <input
                onChange={handlechangeTime}
                disabled
                value={parseToVND(newPrice) + " đ"}
                className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Chi phí giao xe (nếu có)</p>
              <input
                onChange={handleChangeDeliveryFee}
                disabled={contractgroupDetails.contractGroupStatusId != 6 ? false : true}
                value={deliveryFee == null ? 0 + " đ" : parseToVND(deliveryFee) + " đ"}
                className={contractgroupDetails.contractGroupStatusId == 6 ? "border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  : " border-[1px] rounded-[4px] h-10 pl-2 w-full outline-blue-400 "}
              />
            </div>

            {/* <div className="mb-5">
              <p className="font-semibold mb-2">Mô tả tài sản</p>
              <textarea
                disabled={
                  contractgroupDetails.contractGroupStatusId == 5 ? false : true
                }
                onChange={(e) => setDescription(e.target.value)}
                value={
                  rentContractDetailByContractId == null
                    ? ""
                    : rentContractDetailByContractId.depositItemDescription
                }
                className=" border-[1px] rounded-[4px] h-32 pl-2  border-gray-400 w-full  outline-blue-400 "
              />
            </div> */}
          </div>
        </div>
        <PopupPdf
          pdf={rentContractDetailByContractId?.filePath}
          pdfFileWithSignsPath={
            rentContractDetailByContractId?.fileWithSignsPath
          }
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
          openDad={open}
          parentCallback={callbackFunctionPopup}
          data={rentContractDetailByContractId}
          signStaff={rentContractDetailByContractId?.staffSignature}
          signCustomer={rentContractDetailByContractId?.customerSignature}
          pdfName={"RentContract"}
          dataContract={contractgroupDetails}
          rentContractFiles={rentContractFiles}
        />
        <PopupFail
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
          openDad={openFail}
          parentCallback={callbackFunctionPopupFaild}
          isRentContract={true}
          dataRentContract={rentContractDetailByContractId}
          data={contractgroupDetails}
        />
        <PopupHistory
          openDad={openHistory}
          parentCallback={callbackFunctionPopupHistory}
          data={contractgroupDetails.id}
          isAppraisal={false}
        />
        <AlertComponent
          message={messageAlert}
          alert={alert}
          parentCallback={callbackFunctionAlert}
        />
        <hr className="mt-2" />
        <div className="mt-5 flex mb-20">
          {ButtonView}
          <NavLink to="/Expertise/ContractGroup" className="hover:underline">
          <Button
            color="inherit"
            className="btn-choose-car"
            variant="contained"
          >
            QUAY LẠI
          </Button>
          </NavLink>
        </div>
      </div>
    </>
  );
}
