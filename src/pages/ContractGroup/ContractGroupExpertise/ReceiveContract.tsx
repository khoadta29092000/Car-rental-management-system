import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
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
import { NavLink } from 'react-router-dom';
import { useAppSelector } from "../../../hooks";
import { AppraisalRecordAction } from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import {
  carAction,
  getCarByIdAsyncApi,
} from "../../../redux/CarReducer/CarReducer";
import { putStatusCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import {
  ReceiveContractAction,
  getReceiveContractByContractIdAsyncApi,
  postReceiveContractModel,
  postReceiveContractReducerAsyncApi,
} from "../../../redux/ReceiveContractReducer/ReceiveContractReducer";
import { rentContractAction } from "../../../redux/RentContractReducer/RentContractReducer";
import {
  TransferContractAction,
  getTransferContractByContractIdAsyncApi,
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
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false,
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
};

export default function ReceiveContract(props: any) {
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(false);

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
  const { ReceiveContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.ReceiveContract
  );
  const { user } = useAppSelector((state: RootState) => state.user);
  function ApiCarById(values: any) {
    const actionGetCarById = getCarByIdAsyncApi(values);
    dispatch(actionGetCarById);
  }
  interface carFilesTranferContract {
    file: File | null;
    id: number;
    title: string;
    documentImg: string;
    documentDescription: string;
    status: boolean;
  }
  const [carFilesTransferAlready, setCarFilesTransferAlready] = useState(
    TransferContractDetailByContractId?.transferContractFileDataModels.map(
      (item) => ({
        title: item.title,
        documentImg: item.documentImg,
        documentDescription: item.documentDescription ?? null,
        status: item.title.slice(0, 13) == "Ảnh xe hư hại" ? false : true,
      })
    )
  );
  const [carFilesAlready, setCarFilesAlready] = useState(
    ReceiveContractDetailByContractId?.receiveContractFileDataModels.map(
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
  function ApiTransferContract(values: any) {
    const actionTransferContract =
      getTransferContractByContractIdAsyncApi(values);
    dispatch(actionTransferContract).then((response: any) => {
      if (response.payload != undefined) {
        setCarFilesTransferAlready(
          response?.payload?.transferContractFileDataModels.map(
            (item: any) => ({
              title: item.title,
              documentImg: item.documentImg,
              documentDescription: item.documentDescription ?? null,
              status: item.title.slice(0, 13) == "Ảnh xe hư hại" ? false : true,
            })
          )
        );
        frmReceiveContract.setFieldValue(
          "depositItemAsset",
          response?.payload?.depositItemAsset
        );
        frmReceiveContract.setFieldValue(
          "depositItemDescription",
          response?.payload?.depositItemDescription
        );
        frmReceiveContract.setFieldValue(
          "depositItemDownPayment",
          response?.payload?.depositItemDownPayment
        );
      }
    });
  }

  const handleClickOpenAdd = () => {
    setOpen(true);
  };
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  let initialValues: postReceiveContractModel = {
    receiverId: 0,
    contractGroupId: contractgroupDetails?.id,
    transferContractId: 0,
    dateReceive: contractgroupDetails?.rentTo,
    receiveAddress: "",
    originalCondition: true,
    currentCarStateSpeedometerNumber: 0,
    currentCarStateFuelPercent: 0,
    currentCarStateCurrentEtcAmount: 0,
    currentCarStateCarStatusDescription: "",
    depositItemAsset: "",
    depositItemDescription: "",
    depositItemDownPayment: 0,
    returnDepostiItem: true,
    createdDate: new Date(),
    totalKilometersTraveled: 0,
    currentCarStateCarDamageDescription: "",
    insuranceMoney: 0,
    extraTime: 0,
    detectedViolations: false,
    speedingViolationDescription: "",
    forbiddenRoadViolationDescription: "",
    trafficLightViolationDescription: "",
    ortherViolation: "",
    violationMoney: 0,

    receiveContractFileCreateModels: [
      {
        title: "",
        documentImg: "",
        documentDescription: "",
      },
    ],
  };
  useEffect(() => {
    if (
      contractgroupDetails.contractGroupStatusId == 12 ||
      contractgroupDetails.contractGroupStatusId == 13
    ) {
      dispatch(
        getReceiveContractByContractIdAsyncApi(contractgroupDetails?.id)
      ).then((response: any) => {
        if (response.payload != undefined) {
          dispatch(getProfileAsyncApi(response.payload.receiverId));
        }
      });
    }
    ApiCarById(contractgroupDetails.carId);
    ApiTransferContract(contractgroupDetails.id);
    return () => {
      dispatch(userAction.resetUser());
      dispatch(carAction.resetCar());
      dispatch(ReceiveContractAction.deleteReceiveContract());
      dispatch(rentContractAction.deleteRentContract());
      dispatch(AppraisalRecordAction.deleteAppraiselAction());
      dispatch(TransferContractAction.deleteTransferContract());
    };
  }, []);
  useEffect(() => {
    if (ReceiveContractDetailByContractId != null) {
      frmReceiveContract.setFieldValue(
        "currentCarStateSpeedometerNumber",
        ReceiveContractDetailByContractId?.currentCarStateSpeedometerNumber
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCurrentEtcAmount",
        ReceiveContractDetailByContractId?.currentCarStateCurrentEtcAmount
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateFuelPercent",
        ReceiveContractDetailByContractId?.currentCarStateFuelPercent
      );
      frmReceiveContract.setFieldValue(
        "violationMoney",
        ReceiveContractDetailByContractId?.violationMoney
      );
      frmReceiveContract.setFieldValue(
        "insuranceMoney",
        ReceiveContractDetailByContractId?.insuranceMoney
      );
      frmReceiveContract.setFieldValue(
        "dateReceive",
        ReceiveContractDetailByContractId?.dateReceive
      );
      frmReceiveContract.setFieldValue(
        "depositItemPaper",
        ReceiveContractDetailByContractId?.depositItemPaper
      );
      frmReceiveContract.setFieldValue(
        "depositItemAsset",
        ReceiveContractDetailByContractId?.depositItemAsset
      );
      frmReceiveContract.setFieldValue(
        "depositItemAssetInfo",
        ReceiveContractDetailByContractId?.depositItemAssetInfo
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarStatusDescription",
        ReceiveContractDetailByContractId?.currentCarStateCarStatusDescription
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarBackImg",
        ReceiveContractDetailByContractId?.currentCarStateCarBackImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarBackSeatImg",
        ReceiveContractDetailByContractId?.currentCarStateCarBackSeatImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarLeftImg",
        ReceiveContractDetailByContractId?.currentCarStateCarLeftImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarFrontImg",
        ReceiveContractDetailByContractId?.currentCarStateCarFrontImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarRightImg",
        ReceiveContractDetailByContractId?.currentCarStateCarRightImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarInteriorImg",
        ReceiveContractDetailByContractId?.currentCarStateCarInteriorImg
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarPhysicalDamage",
        ReceiveContractDetailByContractId?.currentCarStateCarPhysicalDamage
      );
      frmReceiveContract.setFieldValue(
        "currentCarStateCarDamageDescription",
        ReceiveContractDetailByContractId?.currentCarStateCarDamageDescription
      );
      frmReceiveContract.setFieldValue(
        "speedingViolationDescription",
        ReceiveContractDetailByContractId?.speedingViolationDescription
      );
      frmReceiveContract.setFieldValue(
        "trafficLightViolationDescription",
        ReceiveContractDetailByContractId?.trafficLightViolationDescription
      );
      frmReceiveContract.setFieldValue(
        "forbiddenRoadViolationDescription",
        ReceiveContractDetailByContractId?.forbiddenRoadViolationDescription
      );
      frmReceiveContract.setFieldValue(
        "extraTime",
        ReceiveContractDetailByContractId?.extraTime
      );
      frmReceiveContract.setFieldValue(
        "ortherViolation",
        ReceiveContractDetailByContractId?.ortherViolation
      );
      frmReceiveContract.setFieldValue(
        "unpaidTicketMoney",
        ReceiveContractDetailByContractId?.unpaidTicketMoney
      );
      frmReceiveContract.setFieldValue(
        "originalCondition",
        ReceiveContractDetailByContractId?.originalCondition
      );
      frmReceiveContract.setFieldValue(
        "detectedViolations",
        ReceiveContractDetailByContractId?.detectedViolations
      );
      setCarFilesAlready(
        ReceiveContractDetailByContractId?.receiveContractFileDataModels.map(
          (item: any) => ({
            title: item.title,
            documentImg: item.documentImg,
            documentDescription: item.documentDescription ?? null,
            status: item.title.slice(0, 13) == "Ảnh xe hư hại" ? false : true,
          })
        )
      );
    } else {
      frmReceiveContract.setValues(initialValues);
    }
  }, [ReceiveContractDetailByContractId]);
  const frmReceiveContract = useFormik<postReceiveContractModel>({
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      // dateReceive: yup
      //   .date()
      //   .required("Ngày giao xe không được trống!")
      //   .nullable()
      //   .typeError("Ngày giao xe Không hợp lệ!")
      //   .min(new Date(), "Ngày giao xe không hợp lệ"),
      depositItemAsset: yup
        .string()
        .required("Tài sản đặt cọc Không được trống!"),
      currentCarStateSpeedometerNumber: yup
        .string()
        .nullable()
        .matches(/^[0-9.]{4,12}$/, "Số Km hiện tại không hợp lệ!")
        .required("Số Km hiện tại không được trống!"),

      currentCarStateFuelPercent: yup
        .number()
        .typeError("phần % nhiên liệu phải là số")
        .positive("phần % nhiên liệu không hợp lệ")
        .integer("phần % nhiên liệu không hợp lệ")

        .max(100, "phần % nhiên liệu phải nhỏ hơn hoặc bằng 100")
        .required("phần % nhiên liệu không được để trống"),
      currentCarStateCurrentEtcAmount: yup
        .string()
        .nullable()
        .matches(/^[0-9.]{4,12}$/, "Phí cách ETC hiện tại không hợp lệ!")
        .required("Phí cách ETC hiện tại không được trống!"),
      extraTime: yup
        .number()
        .typeError("Số giờ vượt quá phải là số")
        .integer("Số giờ vượt quá không hợp lệ"),

      currentCarStateCarDamageDescription: yup
        .string()
        .when("originalCondition", {
          is: "true",
          then: yup
            .string()
            .required("Mô tả trạng thái hư hại không được để trống"),
          otherwise: undefined,
        }),

      InsuranceMoney: yup.number().when("originalCondition", {
        is: "false",
        then: yup
          .number()
          .typeError("Số tiền bảo hiểm phải là số")
          .positive("Số tiền bảo hiểm không hợp lệ")
          .integer("Số tiền bảo hiểm không hợp lệ")
          .required("Số tiền bảo hiểm không được để trống"),
        otherwise: undefined,
      }),
      speedingViolationDescription: yup.string().when("detectedViolations", {
        is: "true",
        then: yup.string().required("Vượt quá tốc độ không được để trống"),
        otherwise: undefined,
      }),
      forbiddenRoadViolationDescription: yup
        .string()
        .when("detectedViolations", {
          is: "true",
          then: yup
            .string()
            .required("Đi vào đường cấm vi phạm không được để trống"),
          otherwise: undefined,
        }),
      trafficLightViolationDescription: yup
        .string()
        .when("detectedViolations", {
          is: "true",
          then: yup
            .string()
            .required("Vi phạm vượt đèn giao thông không được để trống"),
          otherwise: undefined,
        }),

      // currentCarStateCarPhysicalDamage: yup.string().when(
      //   "originalCondition",
      //   (originalCondition, schema) => {
      //     return originalCondition ? schema.notRequired() : schema.required();
      //   }
      // ),
      // carInsuranceMoney: yup.number().when(
      //   "originalCondition",
      //   (originalCondition, schema) => {
      //     return originalCondition ? schema.notRequired() : schema.required();
      //   }
      // ),
    }),
    onSubmit: async (values: postReceiveContractModel, setSubmitting: any) => {
      try {
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
          receiveContractFileCreateModels: urls,
        };

        const actionPostTransferContract = postReceiveContractReducerAsyncApi({
          ...updatedValues,
          transferContractId:
            TransferContractDetailByContractId?.id == null
              ? 0
              : TransferContractDetailByContractId?.id,
          createdDate: new Date(),
          currentCarStateCurrentEtcAmount: parseInt(
            frmReceiveContract.values.currentCarStateCurrentEtcAmount
              .toString()
              .replace(/[.,]/g, "")
          ),
          currentCarStateFuelPercent: parseInt(
            frmReceiveContract.values.currentCarStateFuelPercent
              .toString()
              .replace(/[.,]/g, "")
          ),
          currentCarStateSpeedometerNumber: parseInt(
            frmReceiveContract.values.currentCarStateSpeedometerNumber
              .toString()
              .replace(/[.,]/g, "")
          ),
          detectedViolations: Boolean(
            frmReceiveContract.values.detectedViolations
          ),
          originalCondition: Boolean(
            frmReceiveContract.values.originalCondition
          ),
          receiverId: userProfile?.id,
          extraTime: parseInt(frmReceiveContract.values.extraTime.toString()),
        });
        dispatch(actionPostTransferContract).then((response: any) => {
          if (response.payload != undefined) {
            setAlert("success");
            setMessageAlert("Tạo hợp đồng thành công");
            dispatch(
              getReceiveContractByContractIdAsyncApi(contractgroupDetails?.id)
            );
          }
        });
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

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

  function handleChangeStatusContractGroup(values: any) {
    const actionPutContractGroup =
      putStatusCarContractgroupReducercarAsyncApi(values);
    dispatch(actionPutContractGroup);
  }
  const moment = require("moment");
  function handleChangeTimeRentForm(newTimestart: any) {
    if (newTimestart == null) {
      frmReceiveContract.setFieldValue(
        "receiv.dateReceive",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmReceiveContract.setFieldValue(
        "receiv.dateReceive",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  function handleChangeTimeRadioOriginalCondition() {
    frmReceiveContract.setFieldValue(
      "originalCondition",
      !frmReceiveContract.values.originalCondition
    );
  }
  function handleChangeTimeRadioReturnDepostiItem() {
    frmReceiveContract.setFieldValue(
      "returnDepostiItem",
      !frmReceiveContract.values.returnDepostiItem
    );
    frmReceiveContract.setFieldValue("originalCondition", true);
    frmReceiveContract.setFieldValue("detectedViolations", false);
  }
  function handleChangeTimeRadioDetectedViolations() {
    frmReceiveContract.setFieldValue(
      "detectedViolations",
      !frmReceiveContract.values.detectedViolations
    );
  }

  let ButtonView;
  let expertiseView;
  if (contractgroupDetails.contractGroupStatusId == 11) {
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
          TẠO HỢP ĐỒNG
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
  } else if (contractgroupDetails.contractGroupStatusId == 12) {
    ButtonView = (
      <Button
        className="btn-choose-car mr-5"
        sx={{ ml: 2 }}
        variant="contained"
        color="secondary"
        onClick={handleClickOpenAdd}
      >
        XEM PDF
      </Button>
    );
  } else if (contractgroupDetails.contractGroupStatusId == 13) {
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
        {/* <Button
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
        </Button> */}
      </>
    );
  }
  if (contractgroupDetails.contractGroupStatusId !== 11) {
    expertiseView = (
      <>
        <div className="grid grid-cols-3">
          <div>
            <h2 className="text-xl font-bold mb-2">Nhân viên thẩm định</h2>
            <p className="text-gray-400">
              Người thẩm định khách hàng và lên hợp đồng
            </p>
          </div>
          <div className="col-span-2 ml-4">
            <div className="mb-5">
              <p className="font-semibold mb-2">Họ và tên</p>
              {user?.id != 0 ? (
                <input
                  value={user?.name}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              )}
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Số điện thoại</p>
              {user?.id != 0 ? (
                <input
                  value={user?.phoneNumber}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              )}
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Email</p>
              {user?.id != 0 ? (
                <input
                  value={user?.email}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              )}
            </div>
          </div>
        </div>
        <hr className="mt-2" />
      </>
    );
  }
  return (
    <>
      <h2 className="font-sans  text-2xl font-bold uppercase ">
        Biên bản nhận xe
      </h2>
      <div className="mt-5 max-w-6xl mx-auto">
        <form onSubmit={frmReceiveContract.handleSubmit}>
          {expertiseView}

          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Thông tin xe</h2>
              <p className="text-gray-400">
                Xe khách hàng sử dụng trong thời gian hợp đồng
              </p>
            </div>
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">Tên xe</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.modelName != null
                        ? CarResultDetail?.modelName
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hãng xe</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.makeName != null
                        ? CarResultDetail?.makeName
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phiên bản</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.generationName != null
                        ? CarResultDetail?.generationName
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Phân Khúc</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.modelName != null
                        ? CarResultDetail?.modelName
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Truyền động</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.trimName != null
                        ? CarResultDetail?.trimName
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Năm sản xuất</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.modelYear != null
                        ? CarResultDetail?.modelYear
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Màu xe</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.carColor != null
                        ? CarResultDetail?.carColor
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số ghế</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.seatNumber != null
                        ? CarResultDetail?.seatNumber
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Biển số xe</p>
                {CarResultDetail?.id != 0 ? (
                  <input
                    value={
                      CarResultDetail?.carLicensePlates != null
                        ? CarResultDetail?.carLicensePlates
                        : ""
                    }
                    disabled
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={40}
                  />
                )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Ảnh xe lúc giao khách hàng</p>
                <div className="mb-5  xl:grid grid-cols-2 gap-5">
                  {TransferContractDetailByContractId != null
                    ? carFilesTransferAlready?.map((item, index) => {
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
                                  // onClick={() =>
                                  //   haneleClickOpenImg(item.documentImg)
                                  // }
                                  alt=""
                                  className="mx-auto h-[70px] w-24 mt-2 mb-[25px]"
                                  src={item.documentImg}
                                />
                              </div>
                            </FormControl>
                          );
                      })
                    : undefined}
                </div>

                <div className="mb-5">
                  <div className="flex mb-2 gap-2">
                    <p className="font-semibold mb-2">Ảnh xe hư hại(nếu có)</p>{" "}
                  </div>

                  <Slider className="w-full" {...settings}>
                    {TransferContractDetailByContractId != null
                      ? carFilesTransferAlready?.map((image, index) => {
                          if (image?.status == false)
                            return (
                              <div key={index}>
                                <img
                                  // onClick={() =>
                                  //   haneleClickOpenImg(image.documentImg)
                                  // }
                                  src={image?.documentImg}
                                  className="w-32 h-32"
                                />
                              </div>
                            );
                        })
                      : undefined}
                  </Slider>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Mô tả trạng thái*</p>
                {TransferContractDetailByContractId != null ? (
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled
                    value={
                      TransferContractDetailByContractId?.currentCarStateCarStatusDescription
                    }
                    onChange={frmReceiveContract.handleChange}
                    className="w-full"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={7}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className=" h-[178px] w-full "
                  />
                )}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Hiện trạng xe</h2>
              <p className="text-gray-400">Xe trước khi giao cho khách hàng</p>
            </div>
            <div className="col-span-2 ml-4 ">
              <div className="mb-5 ">
                <p className="font-semibold mb-2">Ngày nhận xe*</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      disabled={
                        contractgroupDetails?.contractGroupStatusId === 11
                          ? false
                          : true
                      }
                      value={frmReceiveContract.values.dateReceive}
                      inputFormat="DD/MM/YYYY "
                      onChange={handleChangeTimeRentForm}
                      minDate={dayjs().add(1, "day")}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          error={
                            frmReceiveContract.errors.dateReceive &&
                            frmReceiveContract.touched.dateReceive
                              ? true
                              : undefined
                          }
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
                  {frmReceiveContract.errors.dateReceive && (
                    <div className="text-red-600 text-xs font-semibold p-1 ">
                      {frmReceiveContract.errors.dateReceive as string}
                    </div>
                  )}
                </LocalizationProvider>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">
                  Số km trên đồng hồ hiện tại(Km)*
                </p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                  value={
                    frmReceiveContract.values
                      .currentCarStateSpeedometerNumber == 0
                      ? ""
                      : parseToVND(
                          frmReceiveContract.values
                            .currentCarStateSpeedometerNumber
                        )
                  }
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateSpeedometerNumber"
                  error={
                    frmReceiveContract.touched
                      .currentCarStateSpeedometerNumber &&
                    frmReceiveContract.errors.currentCarStateSpeedometerNumber
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.currentCarStateSpeedometerNumber &&
                frmReceiveContract.touched.currentCarStateSpeedometerNumber ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.currentCarStateSpeedometerNumber}
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
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                  value={
                    frmReceiveContract.values.currentCarStateFuelPercent == 0
                      ? ""
                      : frmReceiveContract.values.currentCarStateFuelPercent
                  }
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateFuelPercent"
                  error={
                    frmReceiveContract.touched.currentCarStateFuelPercent &&
                    frmReceiveContract.errors.currentCarStateFuelPercent
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.currentCarStateFuelPercent &&
                frmReceiveContract.touched.currentCarStateFuelPercent ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.currentCarStateFuelPercent}
                  </div>
                ) : null}
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">
                  Phí cách ETC hiện tại(VNĐ)*
                </p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                  value={
                    frmReceiveContract.values.currentCarStateCurrentEtcAmount ==
                    0
                      ? ""
                      : parseToVND(
                          frmReceiveContract.values
                            .currentCarStateCurrentEtcAmount
                        )
                  }
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="currentCarStateCurrentEtcAmount"
                  error={
                    frmReceiveContract.touched
                      .currentCarStateCurrentEtcAmount &&
                    frmReceiveContract.errors.currentCarStateCurrentEtcAmount
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.currentCarStateCurrentEtcAmount &&
                frmReceiveContract.touched.currentCarStateCurrentEtcAmount ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.currentCarStateCurrentEtcAmount}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Chi phí phát sinh</h2>
              <p className="text-gray-400">
                Nêu trong quá trình thuê khách hàng vi phạm hoặc hư hại xe bị
                phạt
              </p>
            </div>
            <div className="col-span-2 ml-4 ">
              <div className="mb-5">
                <p className="font-semibold mb-2">Số tiền phải đặt cọc(vnđ)*</p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={true}
                  value={parseToVND(
                    frmReceiveContract.values.depositItemDownPayment
                  )}
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="depositItemDownPayment"
                  error={
                    frmReceiveContract.touched.depositItemDownPayment &&
                    frmReceiveContract.errors.depositItemDownPayment
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.depositItemDownPayment &&
                frmReceiveContract.touched.depositItemDownPayment ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.depositItemDownPayment}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hình thức đặt cọc*</p>
                <FormControl className="w-full">
                  <Select
                    disabled={true}
                    displayEmpty
                    error={
                      frmReceiveContract.touched.depositItemAsset &&
                      frmReceiveContract.errors.depositItemAsset
                        ? true
                        : undefined
                    }
                    value={frmReceiveContract.values.depositItemAsset}
                    onChange={frmReceiveContract.handleChange}
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
                  {frmReceiveContract.errors.depositItemAsset &&
                  frmReceiveContract.touched.depositItemAsset ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {frmReceiveContract.errors.depositItemAsset}
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
                  disabled={true}
                  value={frmReceiveContract.values.depositItemDescription}
                  onChange={frmReceiveContract.handleChange}
                  className="w-full"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="depositItemDescription"
                  fullWidth
                  multiline
                  rows={7}
                  error={
                    frmReceiveContract.touched.depositItemDescription &&
                    frmReceiveContract.errors.depositItemDescription
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.depositItemDescription &&
                frmReceiveContract.touched.depositItemDescription ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.depositItemDescription}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Vượt quá thời gian(giờ)</p>
                <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                  value={
                    frmReceiveContract.values.extraTime == 0
                      ? ""
                      : frmReceiveContract.values.extraTime
                  }
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="extraTime"
                  error={
                    frmReceiveContract.touched.extraTime &&
                    frmReceiveContract.errors.extraTime
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.extraTime &&
                frmReceiveContract.touched.extraTime ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.extraTime}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Tình trạng xe khi nhận</h2>
              <p className="text-gray-400">
                Tình trạng của xe khi nhận từ khách hàng
              </p>
            </div>
            <div className="col-span-2 ml-4 ">
              <div className=" mb-5">
                <p className="font-semibold mb-2">Ảnh xe trước khi nhận*</p>
                <div className="grid lg:grid-cols-2">
                  {ReceiveContractDetailByContractId != null
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
                  <p className="font-semibold mb-2">Mô tả trạng thái</p>
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                    value={
                      frmReceiveContract.values
                        .currentCarStateCarStatusDescription
                    }
                    onChange={frmReceiveContract.handleChange}
                    className="w-full"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="currentCarStateCarStatusDescription"
                    fullWidth
                    multiline
                    rows={7}
                    error={
                      frmReceiveContract.touched
                        .currentCarStateCarStatusDescription &&
                      frmReceiveContract.errors
                        .currentCarStateCarStatusDescription
                        ? true
                        : undefined
                    }
                    onBlur={frmReceiveContract.handleBlur}
                  />
                  {frmReceiveContract.errors
                    .currentCarStateCarStatusDescription &&
                  frmReceiveContract.touched
                    .currentCarStateCarStatusDescription ? (
                    <div className="text-red-600  text-xs font-semibold p-1">
                      {
                        frmReceiveContract.errors
                          .currentCarStateCarStatusDescription
                      }
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <FormControl
                    fullWidth
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                  >
                    <p className="font-semibold mb-2">Hoàn tiền*</p>
                    <RadioGroup
                      id="demo-simple-select"
                      value={frmReceiveContract.values.returnDepostiItem}
                      onChange={handleChangeTimeRadioReturnDepostiItem}
                      name="returnDepostiItem"
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Hoàn tiền"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Tạm thời giữ lại"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div
                  className={
                    frmReceiveContract.values.returnDepostiItem == false
                      ? "mb-5"
                      : "hidden"
                  }
                >
                  <FormControl
                    fullWidth
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                  >
                    <p className="font-semibold mb-2">Xe hư hại*</p>
                    <RadioGroup
                      id="demo-simple-select"
                      value={frmReceiveContract.values.originalCondition}
                      onChange={handleChangeTimeRadioOriginalCondition}
                      name="originalCondition"
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Không có vấn đề"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="có vấn dề"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div
                  className={
                    frmReceiveContract.values.originalCondition == true
                      ? "hidden"
                      : ""
                  }
                >
                  <div className="flex mb-2 gap-2">
                    <p className="font-semibold mb-2">Ảnh xe hư hại(nếu có)</p>{" "}
                    <Button
                      variant="contained"
                      color="secondary"
                      className={
                        contractgroupDetails.contractGroupStatusId == 11
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
                  <div className="mb-5">
                    <p className="font-semibold mb-2">
                      Mô tả tình trạng hư hại*
                    </p>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                          bgcolor: "rgb(243 244 246)",
                        },
                      }}
                      disabled={
                        contractgroupDetails?.contractGroupStatusId === 11
                          ? false
                          : true
                      }
                      value={
                        frmReceiveContract.values
                          .currentCarStateCarDamageDescription
                      }
                      onChange={frmReceiveContract.handleChange}
                      className="w-full"
                      size="small"
                      id="outlined-basic"
                      variant="outlined"
                      name="currentCarStateCarDamageDescription"
                      fullWidth
                      multiline
                      rows={7}
                      error={
                        frmReceiveContract.touched
                          .currentCarStateCarDamageDescription &&
                        frmReceiveContract.errors
                          .currentCarStateCarDamageDescription
                          ? true
                          : undefined
                      }
                      onBlur={frmReceiveContract.handleBlur}
                    />
                    {frmReceiveContract.errors
                      .currentCarStateCarDamageDescription &&
                    frmReceiveContract.touched
                      .currentCarStateCarDamageDescription ? (
                      <div className="text-red-600  text-xs font-semibold p-1">
                        {
                          frmReceiveContract.errors
                            .currentCarStateCarDamageDescription
                        }
                      </div>
                    ) : null}
                  </div>
                </div>
                {/*<div className="mb-5">
                <p className="font-semibold mb-2">Tiền bảo hiểm xe*</p>
               <TextField
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      bgcolor: "rgb(243 244 246)",
                    },
                  }}
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                  value={
                    frmReceiveContract.values.carInsuranceMoney == 0
                      ? ""
                      : frmReceiveContract.values.carInsuranceMoney
                  }
                  onChange={frmReceiveContract.handleChange}
                  className="w-full outline-none"
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  name="carInsuranceMoney"
                  error={
                    frmReceiveContract.touched.carInsuranceMoney &&
                    frmReceiveContract.errors.carInsuranceMoney
                      ? true
                      : undefined
                  }
                  onBlur={frmReceiveContract.handleBlur}
                />
                {frmReceiveContract.errors.carInsuranceMoney &&
                frmReceiveContract.touched.carInsuranceMoney ? (
                  <div className="text-red-600 text-xs font-semibold p-1">
                    {frmReceiveContract.errors.carInsuranceMoney}
                  </div>
                ) : null} 
              </div>*/}
              </div>

              <div
                className={
                  frmReceiveContract.values.returnDepostiItem == false
                    ? "mb-5"
                    : "hidden"
                }
              >
                <FormControl
                  fullWidth
                  disabled={
                    contractgroupDetails?.contractGroupStatusId === 11
                      ? false
                      : true
                  }
                >
                  <p className="font-semibold mb-2">Vi phạm giao thông*</p>
                  <RadioGroup
                    id="demo-simple-select"
                    value={frmReceiveContract.values.detectedViolations}
                    onChange={handleChangeTimeRadioDetectedViolations}
                    name="detectedViolations"
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Không có vấn đề"
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="có vấn dề"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div
                className={
                  Boolean(frmReceiveContract.values.detectedViolations) == false
                    ? "hidden"
                    : ""
                }
              >
                <div className="mb-5">
                  <p className="font-semibold mb-2">Vượt quá tốc độ*</p>
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                    value={
                      frmReceiveContract.values.speedingViolationDescription
                    }
                    onChange={frmReceiveContract.handleChange}
                    className="w-full outline-none"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="speedingViolationDescription"
                    error={
                      frmReceiveContract.touched.speedingViolationDescription &&
                      frmReceiveContract.errors.speedingViolationDescription
                        ? true
                        : undefined
                    }
                    onBlur={frmReceiveContract.handleBlur}
                  />
                  {frmReceiveContract.errors.speedingViolationDescription &&
                  frmReceiveContract.touched.speedingViolationDescription ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {frmReceiveContract.errors.speedingViolationDescription}
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">
                    Đi vào đường cấm vi phạm*
                  </p>
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                    value={
                      frmReceiveContract.values
                        .forbiddenRoadViolationDescription
                    }
                    onChange={frmReceiveContract.handleChange}
                    className="w-full outline-none"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="forbiddenRoadViolationDescription"
                    error={
                      frmReceiveContract.touched
                        .forbiddenRoadViolationDescription &&
                      frmReceiveContract.errors
                        .forbiddenRoadViolationDescription
                        ? true
                        : undefined
                    }
                    onBlur={frmReceiveContract.handleBlur}
                  />
                  {frmReceiveContract.errors
                    .forbiddenRoadViolationDescription &&
                  frmReceiveContract.touched
                    .forbiddenRoadViolationDescription ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {
                        frmReceiveContract.errors
                          .forbiddenRoadViolationDescription
                      }
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">
                    Vi phạm vượt đèn giao thông*
                  </p>
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                    value={
                      frmReceiveContract.values.trafficLightViolationDescription
                    }
                    onChange={frmReceiveContract.handleChange}
                    className="w-full outline-none"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="trafficLightViolationDescription"
                    error={
                      frmReceiveContract.touched
                        .trafficLightViolationDescription &&
                      frmReceiveContract.errors.trafficLightViolationDescription
                        ? true
                        : undefined
                    }
                    onBlur={frmReceiveContract.handleBlur}
                  />
                  {frmReceiveContract.errors.trafficLightViolationDescription &&
                  frmReceiveContract.touched
                    .trafficLightViolationDescription ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {
                        frmReceiveContract.errors
                          .trafficLightViolationDescription
                      }
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Vi phạm khác</p>
                  <TextField
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                        bgcolor: "rgb(243 244 246)",
                      },
                    }}
                    disabled={
                      contractgroupDetails?.contractGroupStatusId === 11
                        ? false
                        : true
                    }
                    value={frmReceiveContract.values.ortherViolation}
                    onChange={frmReceiveContract.handleChange}
                    className="w-full outline-none"
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="ortherViolation"
                    error={
                      frmReceiveContract.touched.ortherViolation &&
                      frmReceiveContract.errors.ortherViolation
                        ? true
                        : undefined
                    }
                    onBlur={frmReceiveContract.handleBlur}
                  />
                  {frmReceiveContract.errors.ortherViolation &&
                  frmReceiveContract.touched.ortherViolation ? (
                    <div className="text-red-600 text-xs font-semibold p-1">
                      {frmReceiveContract.errors.ortherViolation}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
          <PopupPdf
            pdf={ReceiveContractDetailByContractId?.filePath}
            pdfFileWithSignsPath={
              ReceiveContractDetailByContractId?.fileWithSignsPath
            }
            parentCallbackAlert={callbackFunctionAlert}
            parentCallbackMessageAlert={callbackFunctionMessageAlert}
            openDad={open}
            parentCallback={callbackFunctionPopup}
            data={ReceiveContractDetailByContractId}
            pdfName={"ReceiveContract"}
            signStaff={ReceiveContractDetailByContractId?.staffSignature}
            signCustomer={ReceiveContractDetailByContractId?.customerSignature}
            dataContract={contractgroupDetails}
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
        </form>
      </div>
    </>
  );
}
