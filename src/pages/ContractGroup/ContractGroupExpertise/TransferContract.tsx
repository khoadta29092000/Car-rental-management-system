import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NavLink } from 'react-router-dom';
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  UploadResult,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { v4 } from "uuid";
import * as yup from "yup";
import { AlertComponent } from "../../../Components/AlertComponent";
import PopupImage from "../../../Components/PopupImage";
import PopupLoading from "../../../Components/PopupLoading";
import { useAppSelector } from "../../../hooks";
import { AppraisalRecordAction } from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import {
  carAction,
  getCarByIdAsyncApi,
} from "../../../redux/CarReducer/CarReducer";
import { putStatusCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import {
  getRentContractByContractIdAsyncApi,
  rentContractAction,
} from "../../../redux/RentContractReducer/RentContractReducer";
import {
  TransferContractAction,
  getTransferContractByContractIdAsyncApi,
  postTransferContractModel,
  postTransferContractReducerAsyncApi
} from "../../../redux/TransferContractReducer/TransferContractReducer";
import {
  getProfileAsyncApi,
  userAction,
} from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { storage } from "../../../util/FirebaseConfig";
import { PopupPdf } from "../Component/PopupPdf";
function parseToVND(number: any) {
  let strNumber = number.toString().replace(/[.,]/g, "");
  strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return strNumber;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 1,
      },
    },
  ],
  className: "slider",
};

export default function TransferContract(props: any) {
  let { parentCallbackAlert, parentCallbackMessageAlert } = props;
  const userString = localStorage.getItem("user");
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = JSON.parse(userString == null ? "" : userString);
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };

  interface carFilesTranferContract {
    file: File | null;
    id: number;
    title: string;
    documentImg: string;
    documentDescription: string;
    status: boolean;
  }

  const dispatch: DispatchType = useDispatch();
  const { contractgroupDetails } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { CarResultDetail } = useAppSelector(
    (state: RootState) => state.CarResult
  );
  const { TransferContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.TransferContract
  );
  const { rentContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  const { user } = useAppSelector((state: RootState) => state.user);
  function ApiCarById(values: any) {
    const actionGetCarById = getCarByIdAsyncApi(values);
    dispatch(actionGetCarById).then((response: any) => {
      if (response.payload != undefined) {
        frmTransferContract.setFieldValue(
          "currentCarStateSpeedometerNumber",
          response?.payload?.speedometerNumber
        );
        frmTransferContract.setFieldValue(
          "currentCarStateFuelPercent",
          response?.payload?.fuelPercent
        );
        frmTransferContract.setFieldValue(
          "currentCarStateCurrentEtcAmount",
          response?.payload?.currentEtcAmount
        );
      }
    });
  }
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickOpenAdd = () => {
    setOpen(true);
  };
  let callbackFunctionAlert = (childData: any) => {
    parentCallbackAlert(childData);
  };
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
    parentCallbackMessageAlert(childData);
  };
  function ApiGetRentContractByStatusContracId(values: any) {
    const actionGetRentContractByStatusContracId =
      getRentContractByContractIdAsyncApi(values);
    dispatch(actionGetRentContractByStatusContracId).then((response: any) => {
      if (response.payload != undefined) {
        frmTransferContract.setFieldValue(
          "depositItemDownPayment",
          response?.payload?.depositItemDownPayment
        );
      }
    });
  }

  let initialValues = {
    transfererId: userProfile?.id,
    contractGroupId: contractgroupDetails.id,
    dateTransfer: contractgroupDetails.rentFrom, // làm thêm select day
    deliveryAddress: contractgroupDetails?.deliveryAddress,
    currentCarStateSpeedometerNumber: CarResultDetail?.speedometerNumber,
    currentCarStateFuelPercent: CarResultDetail?.fuelPercent,
    currentCarStateCurrentEtcAmount: CarResultDetail?.currentEtcAmount,
    currentCarStateCarStatusDescription: "", // làm thêm mô tả trạng thái xe
    depositItemDownPayment:
      rentContractDetailByContractId?.depositItemDownPayment != undefined
        ? rentContractDetailByContractId?.depositItemDownPayment
        : 0,
    depositItemAsset: "",
    depositItemDescription: "",
    createdDate: new Date(),
    transferContractFileCreateModels: [],
  };
  useEffect(() => {
    if (contractgroupDetails.contractGroupStatusId !== 8) {
      dispatch(
        getTransferContractByContractIdAsyncApi(contractgroupDetails?.id)
      ).then((response: any) => {
        if (response.payload != undefined) {
          dispatch(getProfileAsyncApi(response.payload.transfererId));
        }
      });
    }
    ApiGetRentContractByStatusContracId(contractgroupDetails.id);

    ApiCarById(contractgroupDetails.carId);
    return () => {
      dispatch(carAction.resetCar());
      dispatch(userAction.resetUser());
      dispatch(rentContractAction.deleteRentContract());
      dispatch(AppraisalRecordAction.deleteAppraiselAction());
      dispatch(TransferContractAction.deleteTransferContract());
    };
  }, []);

  useEffect(() => {
    if (TransferContractDetailByContractId != null) {
      frmTransferContract.setFieldValue(
        "dateTransfer",
        TransferContractDetailByContractId?.dateTransfer
      );
      frmTransferContract.setFieldValue(
        "dateTransfer",
        TransferContractDetailByContractId?.dateTransfer
      );

      frmTransferContract.setFieldValue(
        "depositItemPaper",
        TransferContractDetailByContractId?.depositItemPaper
      );
      frmTransferContract.setFieldValue(
        "depositItemAsset",
        TransferContractDetailByContractId?.depositItemAsset
      );
      frmTransferContract.setFieldValue(
        "depositItemAssetInfo",
        TransferContractDetailByContractId?.depositItemAssetInfo
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarStatusDescription",
        TransferContractDetailByContractId?.currentCarStateCarStatusDescription
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarBackImg",
        TransferContractDetailByContractId?.currentCarStateCarBackImg
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarBackSeatImg",
        TransferContractDetailByContractId?.currentCarStateCarBackSeatImg
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarLeftImg",
        TransferContractDetailByContractId?.currentCarStateCarLeftImg
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarFrontImg",
        TransferContractDetailByContractId?.currentCarStateCarFrontImg
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarRightImg",
        TransferContractDetailByContractId?.currentCarStateCarRightImg
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCarInteriorImg",
        TransferContractDetailByContractId?.currentCarStateCarInteriorImg
      );
      frmTransferContract.setFieldValue(
        "depositItemDescription",
        TransferContractDetailByContractId?.depositItemDescription
      );
      frmTransferContract.setFieldValue(
        "depositItemDownPayment",
        TransferContractDetailByContractId?.depositItemDownPayment
      );
      frmTransferContract.setFieldValue(
        "currentCarStateCurrentEtcAmount",
        TransferContractDetailByContractId?.currentCarStateCurrentEtcAmount
      );
      frmTransferContract.setFieldValue(
        "currentCarStateFuelPercent",
        TransferContractDetailByContractId?.currentCarStateFuelPercent
      );
      frmTransferContract.setFieldValue(
        "currentCarStateSpeedometerNumber",
        TransferContractDetailByContractId?.currentCarStateSpeedometerNumber
      );
      setCarFilesAlready(
        TransferContractDetailByContractId?.transferContractFileDataModels.map(
          (item) => ({
            title: item.title,
            documentImg: item.documentImg,
            documentDescription: item.documentDescription ?? null,
            status: item.title.slice(0, 13) == "Ảnh xe hư hại" ? false : true,
          })
        )
      );
    } else {
      frmTransferContract.setValues(initialValues);
    }
    // dispatch(getcarAsyncApi({ page: 1, pageSize: 1000, carMakeName: contractgroupDetails.requireDescriptionInfoCarBrand, carColor: contractgroupDetails.requireDescriptionInfoCarColor, seatNumber: contractgroupDetails.requireDescriptionInfoSeatNumber }))
  }, [TransferContractDetailByContractId]);
  function handlechangeTime(values: any) {}

  const frmTransferContract = useFormik<postTransferContractModel>({
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      // currentCarStateCarFrontImg: yup
      //   .mixed()
      //   .required("Ảnh phía trước không được trống!"),
      // currentCarStateCarBackImg: yup
      //   .mixed()
      //   .required("Ảnh phía sau không được trống!"),
      // currentCarStateCarLeftImg: yup
      //   .mixed()
      //   .required("Ảnh phía bên trái không được trống!"),
      // currentCarStateCarRightImg: yup
      //   .mixed()
      //   .required("Ảnh phía bên phải sau không được trống!"),
      // currentCarStateCarInteriorImg: yup
      //   .mixed()
      //   .required("Ảnh nội thất sau không được trống!"),
      // currentCarStateCarBackSeatImg: yup
      //   .mixed()
      //   .required("Ảnh ghế ngồi không được trống!"),
      // depositItemAsset: yup
      //   .string()
      //   .required("Tài sản đặt cọc Không được trống!"),
      // depositItemAssetInfo: yup
      //   .string()
      //   .required("Mô tả tài sản Không được trống!"),
      // currentCarStateCarStatusDescription: yup
      //   .string()
      //   .required("Mô tả trạng thái Không được trống!"),
      // currentCarStateSpeedometerNumber: yup
      //   .string()
      //   .nullable()
      //   .matches(/^[0-9.]{4,12}$/, "Số trên đồng hồ hiện tại không hợp lệ!")
      //   .required("Số trên đồng hồ hiện tại không được trống!"),
      // currentCarStateFuelPercent: yup
      //   .number()
      //   .typeError("phần % nhiên liệu phải là số")
      //   .positive("phần % nhiên liệu không hợp lệ")
      //   .integer("phần % nhiên liệu không hợp lệ")
      //   .max(100, "phần % nhiên liệu phải nhỏ hơn hoặc bằng 100")
      //   .required("phần % nhiên liệu không được để trống"),
      // currentCarStateCurrentEtcAmount: yup
      //   .string()
      //   .nullable()
      //   .matches(/^[0-9.]{4,12}$/, "Số trên đồng hồ hiện tại không hợp lệ!")
      //   .required("Số trên đồng hồ hiện tại không được trống!"),
      // depositItemPaper: yup
      //   .string()
      //   .required("Hình thức đặt cọc Không được trống!"),
    }),
    onSubmit: async (values: postTransferContractModel, setSubmitting: any) => {
      try {
        setIsLoading(true);
        const promises: Promise<{
          title: string;
          documentImg: UploadResult;
          documentDescription: string;
        }>[] = [];

        if (carFiles) {
          carFiles.forEach((image: any) => {
            const imageRef = ref(storage, `imgCCCD/${new Date() + v4()}`);
            const imgaeSnapshot = uploadBytes(imageRef, image.file);
            const promise = imgaeSnapshot.then((uploadResult) => ({
              title: image.title,
              documentDescription: "",
              documentImg: {
                metadata: uploadResult.metadata,
                ref: uploadResult.ref,
                contentType: uploadResult.metadata.contentType,
              },
            }));
            promises.push(promise);
          });
        }
        const snapshots = await Promise.all(promises);
        const urls = await Promise.all(
          snapshots
            .map((snapshot) => getDownloadURL(snapshot.documentImg.ref))
            .map((promise, index) =>
              promise.then((documentImg) => ({
                title: snapshots[index].title,
                documentDescription: "",
                documentImg,
              }))
            )
        );

        const updatedValues = {
          ...values,
          transferContractFileCreateModels: urls,
          currentCarStateCurrentEtcAmount: parseInt(
            values.currentCarStateCurrentEtcAmount.toString()
          ),
          currentCarStateFuelPercent: parseInt(
            values.currentCarStateFuelPercent.toString()
          ),
          currentCarStateSpeedometerNumber: parseInt(
            values.currentCarStateSpeedometerNumber.toString()
          ),
        };

        const actionPostTransferContract = postTransferContractReducerAsyncApi({
          ...updatedValues,
        });
        dispatch(actionPostTransferContract).then((response: any) => {
          if (response.payload != undefined) {
            parentCallbackAlert("success");
            parentCallbackMessageAlert("Tạo biên bản thành công");
            dispatch(
              getTransferContractByContractIdAsyncApi(contractgroupDetails?.id)
            );
            setIsLoading(false);
          }
        });
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });
  const [carFilesAlready, setCarFilesAlready] = useState(
    TransferContractDetailByContractId?.transferContractFileDataModels.map(
      (item) => ({
        title: item.title,
        documentImg: item.documentImg,
        documentDescription: item.documentDescription ?? null,
        status: item.title.slice(0, 13) == "Ảnh xe hư hại" ? false : true,
      })
    )
  );
  const [carFiles, setCarFiles] = useState<carFilesTranferContract[]>([
    {
      id: 1,
      title: "Ảnh xe mặt trước",
      documentImg: "",
      documentDescription: "",
      status: true,
      file: null,
    },
    {
      id: 2,
      title: "Ảnh xe mặt sau",
      documentImg: "",
      documentDescription: "",
      status: true,
      file: null,
    },
    {
      id: 3,
      title: "Ảnh xe mặt trái",
      documentImg: "",
      documentDescription: "",
      status: true,
      file: null,
    },
    {
      id: 4,
      title: "Ảnh xe mặt phải",
      documentImg: "",
      documentDescription: "",
      status: true,
      file: null,
    },
    {
      id: 5,
      title: "Ảnh nội thất xe",
      documentImg: "",
      documentDescription: "",
      status: true,
      file: null,
    },
  ]);
 
  function handleChangeStatusContractGroup(values: any) {
    const actionPutContractGroup =
      putStatusCarContractgroupReducercarAsyncApi(values);
    dispatch(actionPutContractGroup);
  }
  const moment = require("moment");
  function handleChangeTimeRentForm(newTimestart: any) {
    if (newTimestart == null) {
      frmTransferContract.setFieldValue(
        "dateTransfer",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmTransferContract.setFieldValue(
        "dateTransfer",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }

  const handleFileOtherInputChange = (
    newValue: carFilesTranferContract,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file1 = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = reader.result
          ?.toString()
          ?.split(";")[0]
          ?.split(":")[1];
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          return;
        }
        if (newValue.status == true) {
          const newArrayListFile = [...carFiles];
          const url = URL.createObjectURL(file1);
          newArrayListFile[newValue.id - 1].file = file1;
          newArrayListFile[newValue.id - 1].documentImg = url;
          setCarFiles(newArrayListFile);
        }

        // const url = URL.createObjectURL(file1);
        // const newArrayListFileFireBase = [...selectedImageOtherUrl];
        // const newDataListFileFireBase = { id: newValue, url: url };
        // newArrayListFileFireBase.push(newDataListFileFireBase);
        // setSelectedImageOtherUrl(newArrayListFileFireBase);

        //setSelecteddrivingLisenceImage1Image1Option("file");
        //setSelectedImageGPLXBefore(file1);
      };
      reader.readAsDataURL(file1);
    }
  };
  const handleFileOtherWrongInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file1 = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = reader.result
          ?.toString()
          ?.split(";")[0]
          ?.split(":")[1];
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          return;
        }
        const url = URL.createObjectURL(file1);
        const newArrayListFile = [...carFiles];
        const newDataListFile = {
          id: carFiles.length + 1,
          title: `Ảnh xe hư hại thứ ${carFiles.length - 4}`,
          documentImg: url,
          documentDescription: "",
          status: false,
          file: file1,
        };
        newArrayListFile.push(newDataListFile);
        setCarFiles(newArrayListFile);

        // const url = URL.createObjectURL(file1);
        // const newArrayListFileFireBase = [...selectedImageOtherUrl];
        // const newDataListFileFireBase = { id: newValue, url: url };
        // newArrayListFileFireBase.push(newDataListFileFireBase);
        // setSelectedImageOtherUrl(newArrayListFileFireBase);

        //setSelecteddrivingLisenceImage1Image1Option("file");
        //setSelectedImageGPLXBefore(file1);
      };
      reader.readAsDataURL(file1);
    }
  };
  const handleClickOpenDelete = (id: number) => {
    const newArrayListFile = [...carFiles];
    const filteredList = newArrayListFile.filter((x) => x.id !== id);
    setCarFiles(filteredList);
  };

  let ButtonView;
  let expertiseView;
  if (contractgroupDetails.contractGroupStatusId == 8) {
    ButtonView = (
      <>
        <Button
          type="submit"
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="success"
          // onClick={handleChangeCreateContract}
        >
          Tạo biên bản
        </Button>
        <Button
          color="error"
          className="btn-choose-car mr-5"
          variant="contained"
        >
          THẤT BẠI
        </Button>
      </>
    );
  } else if (contractgroupDetails.contractGroupStatusId == 9) {
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
  } else if (contractgroupDetails.contractGroupStatusId == 10) {
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
              contractGroupStatusId: 11,
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
  if (contractgroupDetails.contractGroupStatusId !== 8) {
    expertiseView = (
      <>
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
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số điện thoại</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Email</p>
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
      </>
    );
  }
  return (
    <>
      <h2 className="font-sans  text-2xl font-bold uppercase ">
        Biên bản giao xe
      </h2>

      <div className="mt-5 max-w-6xl mx-auto">
        <form onSubmit={frmTransferContract.handleSubmit}>
          {expertiseView}

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
                        onClick={() =>
                          haneleClickOpenImg(CarResultDetail?.rightImg)
                        }
                        className="h-72 w-full"
                        src={CarResultDetail?.rightImg}
                      />
                    </div>
                    <div>
                      <img
                        onClick={() =>
                          haneleClickOpenImg(CarResultDetail?.leftImg)
                        }
                        className="h-72 w-full"
                        src={CarResultDetail?.leftImg}
                      />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div>
                      <img
                        onClick={() =>
                          haneleClickOpenImg(CarResultDetail?.frontImg)
                        }
                        className="h-72 w-full"
                        src={CarResultDetail?.frontImg}
                      />
                    </div>
                    <div>
                      <img
                        onClick={() =>
                          haneleClickOpenImg(CarResultDetail?.backImg)
                        }
                        className="h-72 w-full"
                        src={CarResultDetail?.backImg}
                      />
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
                      <Skeleton
                        variant="rectangular"
                        className="w-full h-72 "
                      />
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
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Hiện trạng xe</h2>
              <p className="text-gray-400">Xe trước khi giao cho khách hàng</p>
            </div>
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">
                  Số trên đồng hồ hiện tại(Km)*
                </p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8
                      ? false
                      : true
                  }
                  value={
                    frmTransferContract.values
                      .currentCarStateSpeedometerNumber == 0
                      ? ""
                      : parseToVND(
                          frmTransferContract.values
                            .currentCarStateSpeedometerNumber
                        )
                  }
                  onChange={frmTransferContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateSpeedometerNumber"
                  error={
                    frmTransferContract.touched
                      .currentCarStateSpeedometerNumber &&
                    frmTransferContract.errors.currentCarStateSpeedometerNumber
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors.currentCarStateSpeedometerNumber &&
                frmTransferContract.touched.currentCarStateSpeedometerNumber ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {
                      frmTransferContract.errors
                        .currentCarStateSpeedometerNumber
                    }
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">
                  Mức nhiên liệu hiện tại(%)*
                </p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8
                      ? false
                      : true
                  }
                  value={
                    frmTransferContract.values.currentCarStateFuelPercent == 0
                      ? ""
                      : frmTransferContract.values.currentCarStateFuelPercent
                  }
                  onChange={frmTransferContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateFuelPercent"
                  error={
                    frmTransferContract.touched.currentCarStateFuelPercent &&
                    frmTransferContract.errors.currentCarStateFuelPercent
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors.currentCarStateFuelPercent &&
                frmTransferContract.touched.currentCarStateFuelPercent ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmTransferContract.errors.currentCarStateFuelPercent}
                  </div>
                ) : null}
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">
                  Phí cách ETC hiện tại(vnđ)*
                </p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8
                      ? false
                      : true
                  }
                  value={
                    frmTransferContract.values
                      .currentCarStateCurrentEtcAmount == 0
                      ? ""
                      : parseToVND(
                          frmTransferContract.values
                            .currentCarStateCurrentEtcAmount
                        )
                  }
                  onChange={frmTransferContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateCurrentEtcAmount"
                  error={
                    frmTransferContract.touched
                      .currentCarStateCurrentEtcAmount &&
                    frmTransferContract.errors.currentCarStateCurrentEtcAmount
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors.currentCarStateCurrentEtcAmount &&
                frmTransferContract.touched.currentCarStateCurrentEtcAmount ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmTransferContract.errors.currentCarStateCurrentEtcAmount}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Khách hàng thanh toán</h2>
              <p className="text-gray-400">
                Khách hàng trả tiền cọc trước khi giao xe và ghi nhận lại
              </p>
            </div>
            <div className="col-span-2 ml-4 ">
              <div className="mb-5 ">
                <p className="font-semibold mb-2">Ngày giao xe*</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disabled={
                        contractgroupDetails?.contractGroupStatusId === 8
                          ? false
                          : true
                      }
                      value={frmTransferContract.values.dateTransfer}
                      inputFormat="DD/MM/YYYY "
                      onChange={handleChangeTimeRentForm}
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
                  {frmTransferContract.errors.dateTransfer && (
                    <div className="text-red-600 text-xs font-semibold p-1 ">
                      {frmTransferContract.errors.dateTransfer as string}
                    </div>
                  )}
                </LocalizationProvider>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số tiền phải đặt cọc(vnđ)*</p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8
                      ? false
                      : true
                  }
                  value={parseToVND(
                    frmTransferContract.values.depositItemDownPayment
                  )}
                  onChange={frmTransferContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="depositItemDownPayment"
                  error={
                    frmTransferContract.touched.depositItemDownPayment &&
                    frmTransferContract.errors.depositItemDownPayment
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors.depositItemDownPayment &&
                frmTransferContract.touched.depositItemDownPayment ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmTransferContract.errors.depositItemDownPayment}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hình thức đặt cọc*</p>
                <FormControl className="w-full">
                  <Select
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 8
                        ? false
                        : true
                    }
                    displayEmpty
                    error={
                      frmTransferContract.touched.depositItemAsset &&
                      frmTransferContract.errors.depositItemAsset
                        ? true
                        : undefined
                    }
                    value={frmTransferContract.values.depositItemAsset}
                    onChange={frmTransferContract.handleChange}
                    className="w-full outline-none"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="depositItemAsset"
                  >
                    <MenuItem value="1" disabled>
                      Chọn hình thức đặt cọc
                    </MenuItem>
                    <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                    <MenuItem value="Giấy tờ">Giấy tờ</MenuItem>
                    <MenuItem value="Hình thức khác">Hình thức khác</MenuItem>
                  </Select>
                  {frmTransferContract.errors.depositItemAsset &&
                  frmTransferContract.touched.depositItemAsset ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {frmTransferContract.errors.depositItemAsset}
                    </div>
                  ) : null}
                </FormControl>
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">Mô tả tài sản*</p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8
                      ? false
                      : true
                  }
                  value={frmTransferContract.values.depositItemDescription}
                  onChange={frmTransferContract.handleChange}
                  className="w-full"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="depositItemDescription"
                  fullWidth
                  multiline
                  rows={7}
                  error={
                    frmTransferContract.touched.depositItemDescription &&
                    frmTransferContract.errors.depositItemDescription
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors.depositItemDescription &&
                frmTransferContract.touched.depositItemDescription ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmTransferContract.errors.depositItemDescription}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Ảnh xe hiện tại</h2>
              <p className="text-gray-400">
                Tình trạng xe trước khi giao đến khách hàng (bằng hình ảnh)
              </p>
            </div>
            <div className="col-span-2">
              <div className="mb-5  xl:grid grid-cols-2 gap-5">
                {TransferContractDetailByContractId != null
                  ? carFilesAlready?.map((item, index) => {
                      if (item.status == true)
                        return (
                          <FormControl key={index} className="mb-2">
                            <div className="item_box_image ">
                              <Button
                                variant="contained"
                                component="label"
                                className="bg-white text-[#1976d2] shadow-none rounded-md "
                              >
                                {item.title}
                              </Button>

                              <img
                                onClick={() =>
                                  haneleClickOpenImg(item.documentImg)
                                }
                                alt=""
                                className="mx-auto h-[70px] w-24 mt-2 mb-[25px]"
                                src={item.documentImg}
                              />
                            </div>
                          </FormControl>
                        );
                    })
                  : carFiles.map((item, index) => {
                      if (item.status == true)
                        return (
                          <FormControl key={index} className="mb-2">
                            <div className="item_box_image ">
                              <Button
                                variant="contained"
                                component="label"
                                className="bg-white text-[#1976d2] shadow-none rounded-md "
                              >
                                <AddPhotoAlternateIcon /> {item.title}*
                                <input
                                  type="file"
                                  hidden
                                  id="image5"
                                  onChange={(e) =>
                                    handleFileOtherInputChange(item, e)
                                  }
                                />
                              </Button>

                              {item.file && (
                                <img
                                  onClick={() =>
                                    haneleClickOpenImg(item.documentImg)
                                  }
                                  alt=""
                                  className="mx-auto h-[70px] w-24 mt-2 mb-[25px]"
                                  src={
                                    item.file == null
                                      ? undefined
                                      : window.URL.createObjectURL(item.file)
                                  }
                                />
                              )}
                            </div>
                          </FormControl>
                        );
                    })}
              </div>

              <div className="mb-5">
                <div className="flex mb-2 gap-2">
                  <p className="font-semibold mb-2">Ảnh xe hư hại(nếu có)</p>{" "}
                  <Button
                    variant="contained"
                    color="secondary"
                    className={
                      contractgroupDetails.contractGroupStatusId == 8
                        ? "h-6"
                        : "hidden"
                    }
                    component="label"
                  >
                    Thêm ảnh
                    <input
                      type="file"
                      hidden
                      id="image5"
                      onChange={(e) => handleFileOtherWrongInputChange(e)}
                    />
                  </Button>
                </div>
                {(carFiles.length > 8 || (carFilesAlready?.length ?? 0) > 3) ==
                true ? (
                  <Slider
                    className="w-full"
                    dots={settings.dots}
                    infinite={settings.infinite}
                    speed={settings.speed}
                    slidesToShow={settings.slidesToShow}
                  >
                    {TransferContractDetailByContractId != null
                      ? carFilesAlready?.map((image, index) => {
                          if (image.status == false)
                            return (
                              <div key={index}>
                                <img
                                  onClick={() =>
                                    haneleClickOpenImg(image.documentImg)
                                  }
                                  src={image.documentImg}
                                  className="w-32 h-32"
                                />
                              </div>
                            );
                        })
                      : carFiles.map((image) => {
                          if (image.status == false)
                            return (
                              <div key={image.id} className="relative ">
                                <ClearOutlinedIcon
                                  onClick={() =>
                                    handleClickOpenDelete(image.id)
                                  }
                                  className="absolute    left-0 top-0  mt-1 mx-1 items-start flex-nowrap    m-2 hover:text-red-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                                />
                                <img
                                  onClick={() =>
                                    haneleClickOpenImg(image.documentImg)
                                  }
                                  src={image.documentImg}
                                  className={
                                    image.documentImg == ""
                                      ? "hidden"
                                      : "w-32 h-32 "
                                  }
                                />
                              </div>
                            );
                        })}
                  </Slider>
                ) : (
                  <div className="w-full flex gap-5 justify-center">
                    {TransferContractDetailByContractId != null
                      ? carFilesAlready?.map((image, index) => {
                          if (image.status == false)
                            return (
                              <div key={index}>
                                <img
                                  onClick={() =>
                                    haneleClickOpenImg(image.documentImg)
                                  }
                                  src={image.documentImg}
                                  className="w-32 h-32"
                                />
                              </div>
                            );
                        })
                      : carFiles.map((image) => {
                          if (image.status == false)
                            return (
                              <div key={image.id}>
                                <img
                                  onClick={() =>
                                    haneleClickOpenImg(image.documentImg)
                                  }
                                  src={image.documentImg}
                                  className={
                                    image.documentImg == ""
                                      ? "hidden"
                                      : "w-32 h-32"
                                  }
                                />
                              </div>
                            );
                        })}
                  </div>
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Mô tả xe*</p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 8 ||
                    contractgroupDetails?.contractGroupStatusId === 9
                      ? false
                      : true
                  }
                  value={
                    frmTransferContract.values
                      .currentCarStateCarStatusDescription
                  }
                  onChange={frmTransferContract.handleChange}
                  className="w-full"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateCarStatusDescription"
                  fullWidth
                  multiline
                  rows={7}
                  error={
                    frmTransferContract.touched
                      .currentCarStateCarStatusDescription &&
                    frmTransferContract.errors
                      .currentCarStateCarStatusDescription
                      ? true
                      : undefined
                  }
                  onBlur={frmTransferContract.handleBlur}
                />
                {frmTransferContract.errors
                  .currentCarStateCarStatusDescription &&
                frmTransferContract.touched
                  .currentCarStateCarStatusDescription ? (
                  <div className="text-red-600  text-xs font-semibold p-1">
                    {
                      frmTransferContract.errors
                        .currentCarStateCarStatusDescription
                    }
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <PopupPdf
            pdf={TransferContractDetailByContractId?.filePath}
            pdfFileWithSignsPath={
              TransferContractDetailByContractId?.fileWithSignsPath
            }
            parentCallbackAlert={callbackFunctionAlert}
            parentCallbackMessageAlert={callbackFunctionMessageAlert}
            openDad={open}
            parentCallback={callbackFunctionPopup}
            data={TransferContractDetailByContractId}
            pdfName={"TransferContract"}
            signStaff={TransferContractDetailByContractId?.staffSignature}
            signCustomer={TransferContractDetailByContractId?.customerSignature}
            dataContract={contractgroupDetails}
          />
          <AlertComponent
            message={messageAlert}
            alert={alert}
            parentCallback={callbackFunctionAlert}
          />
          {isLoading == true ? <PopupLoading /> : undefined}
          <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
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
        </form>
      </div>
    </>
  );
}
