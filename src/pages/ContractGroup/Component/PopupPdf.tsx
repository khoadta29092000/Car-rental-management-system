import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  FormControl
} from "@mui/material";
import { v4 } from "uuid";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import {
  UploadResult,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { PDFDocumentProxy } from "pdfjs-dist";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import PopupLoading from "../../../Components/PopupLoading";
import {
  getReceiveContractByContractIdAsyncApi,
  putReceiveContractReducerAsyncApi,
} from "../../../redux/ReceiveContractReducer/ReceiveContractReducer";
import {
  getRentContractByContractIdAsyncApi,
  getRentContractFilesByContractIdAsyncApi,
  postRentContractFilesReducerAsyncApi,
  postSendMailReducerAsyncApi,
  putRentContractReducerAsyncApi,
} from "../../../redux/RentContractReducer/RentContractReducer";
import {
  getTransferContractByContractIdAsyncApi,
  putTransferContractReducerAsyncApi,
} from "../../../redux/TransferContractReducer/TransferContractReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { storage } from "../../../util/FirebaseConfig";
import { closestIndexTo } from "date-fns/esm";
import { putStatusCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { useAppSelector } from "../../../hooks";
import PopupImage from "../../../Components/PopupImage";

function generateUniqueId(existingIds: number[]): number {
  let newId: number;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (existingIds.includes(newId));
  return newId;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
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
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  const dispatch: DispatchType = useDispatch();
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
export const PopupPdf = (props: any) => {
  const {
    openDad,
    parentCallbackAlert,
    parentCallbackMessageAlert,
    parentCallback,
    pdf,
    data,
    signStaff,
    pdfName,
    signCustomer,
    pdfFileWithSignsPath,
    dataContract,
    rentContractFiles,
    role
  } = props;
  const dispatch: DispatchType = useDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  console.log("ngudandan2", data, dataContract, user && user.email)
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  interface DataListFileFireBase {
    documentImg: string;
    id: number;
    file: File | null;
  }
  const userEmail = user != null ? user.email : "";
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };
  const body = {
    ToEmail: `${dataContract && dataContract.staffEmail}`,
    Subject: `[ATSHARE] Thông báo hợp đồng thuê xe ${data && data.contractGroupId}`,
    Body: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style=" text-align: center; padding: 40px 0; background: #EBF0F5;  width: 100%; height: 100%;">
    <div style="
        background: white;
        padding-left: 300px;
    padding-right: 300px;
    padding-top: 50;
    padding-bottom: 50px;
        border-radius: 4px;
        box-shadow: 0 2px 3px #C8D0D8;
        display: inline-block;
        margin: 0 auto;
    " class="card">
        <h1 style=" color: #008CBA;font-size: 40px;"> ATSHARE</h1>
        <hr />
        <img style="" src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Flogo-color%20(1).pngeddab547-393c-4a52-8228-389b00aeacad?alt=media&token=a9fe5d57-b871-46a0-a9da-508902f09832&fbclid=IwAR0naf-IAgqC0ireg_vTPIvu9q0dK_n0gqKdNHhWFhvOyvhjWph-boPTWYk" />
        <h1 style=" color: #59c91c; font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
            font-weight: 900;
            font-size: 40px;
            margin-bottom: 10px;">
            Hợp đồng
        </h1>
        <p style=" padding-top: 5px;
        color: #404F5E;
        font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
           font-size: 20px;
           margin: 0;">Yêu cầu:${data && data.contractGroupId}</p>
           <p style=" padding-top: 5px;
           color: #404F5E;
           font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
              font-size: 20px;
              margin: 0;">Thông báo: đã lên hợp đồng thành công, đã gửi link PDF</p>  
          
                 <p style=" padding-top: 5px;
                 color: ##DCDCDC;
                 font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
                    font-size: 20px;
                    margin: 0;">Lưu ý: Vui lòng photo và mang cho khách ký, cập nhật lên lại hệ thống (<a href="https://atshare.vercel.app/profiledetail/${data && data.contractGroupId}">tại đây</a>)</p>  
</body></html>`,

  };
  const body1 = {
    ToEmail: `${userEmail}`,
    Subject: `[ATSHARE] Thông báo hợp đồng thuê xe ${data && data.contractGroupId}`,
    Body: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style=" text-align: center; padding: 40px 0; background: #EBF0F5;  width: 100%; height: 100%;">
    <div style="
        background: white;
        padding-left: 300px;
    padding-right: 300px;
    padding-top: 50;
    padding-bottom: 50px;
        border-radius: 4px;
        box-shadow: 0 2px 3px #C8D0D8;
        display: inline-block;
        margin: 0 auto;
    " class="card">
        <h1 style=" color: #008CBA;font-size: 40px;"> ATSHARE</h1>
        <hr />
        <img style="" src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Flogo-color%20(1).pngeddab547-393c-4a52-8228-389b00aeacad?alt=media&token=a9fe5d57-b871-46a0-a9da-508902f09832&fbclid=IwAR0naf-IAgqC0ireg_vTPIvu9q0dK_n0gqKdNHhWFhvOyvhjWph-boPTWYk" />
        <h1 style=" color: #59c91c; font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
            font-weight: 900;
            font-size: 40px;
            margin-bottom: 10px;">
            Hợp đồng
        </h1>
        <p style=" padding-top: 5px;
        color: #404F5E;
        font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
           font-size: 20px;
           margin: 0;">Yêu cầu:${data && data.contractGroupId}</p>
           <p style=" padding-top: 5px;
           color: #404F5E;
           font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
              font-size: 20px;
              margin: 0;">Thông báo: đã cập nhật ảnh hợp đồng có chữ ký khách hàng lên hệ thông</p>  
          
                 <p style=" padding-top: 5px;
                 color: ##DCDCDC;
                 font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
                    font-size: 20px;
                    margin: 0;">Lưu ý: Vui lòng cập nhật tình trạng hợp đồng (<a href="https://atshare.vercel.app/Expertise/ContractGroup/ContractGroupDetail/${data && data.contractGroupId}">tại đây</a>)</p>  
</body></html>`,

  };

  const [contractFiles, setContractFiles] = useState<DataListFileFireBase[]>([]);
  const handleClickOpenDelete = (id: number) => {
    console.log("ngunene1", contractFiles)
    const newArrayListFile = [...contractFiles];
    const filteredList = newArrayListFile.filter((x) => x.id !== id);
    setContractFiles(filteredList);
    console.log("ngunene12", contractFiles)
  };
  const handleFileOtherInputChange = (
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
        if (fileType !== "image/jpeg" && fileType !== "image/png" && fileType !== "image/jpg") {
          parentCallbackAlert("error");
          parentCallbackMessageAlert("Chỉ nhận ảnh");
          return;
        }
        const newArrayListFile = [...contractFiles];
        const existingIds = newArrayListFile.map((item) => item.id);
        const url = URL.createObjectURL(file1);
        const newDataListFileFireBase = { file: file1, documentImg: url, id: generateUniqueId(existingIds) };
        newArrayListFile.push(newDataListFileFireBase);
        setContractFiles(newArrayListFile);

        // const url = URL.createObjectURL(file1);
        // const newArrayListFileFireBase = [...selectedImageOtherUrl];
        // const newDataListFileFireBase = { id: newValue, url: url };
        // newArrayListFileFireBase.push(newDataListFileFireBase);
        // setSelectedImageOtherUrl(newArrayListFileFireBase);

        // setSelecteddrivingLisenceImage1Image1Option("file");
        // setSelectedImageGPLXBefore(file1);
      };
      reader.readAsDataURL(file1);
    }
  };


  const refNe = useRef<HTMLDivElement>(null);
  const signCanvasCustomer = useRef() as React.MutableRefObject<any>;
  const signCanvasExpertise = useRef() as React.MutableRefObject<any>;
  const [popupLoading, setPopupLoading] = useState(false);
  // const secretKey = "AcewqewqeAx3123afsx1";
  // const userId = dataContract.customerInfoId;
  // const token = jwt.sign({ userId }, secretKey, { expiresIn: "24h" });
  const secret = "123aSdzxv12312trascvS";
  // const token = jwt.sign({ id: "1" }, secret, { expiresIn: '24h' });

  const token = data != null ? data.id : "1";
  const url = `https://car-demo-share.vercel.app/signature/${token}`;

  const handleUpdatePdfRentContract = async () => {
    if (signStaff == null) {
      setPopupLoading(true);
      const imageRef = ref(storage, `images/${new Date().getTime()}.png`);
      fetch(signCanvasExpertise.current.toDataURL())
        .then((response) => response.blob())
        .then((blob) => {
          uploadBytes(imageRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              const {
                createdDate,
                contractGroup,
                downPayment,
                isExported,
                representative,
                fileWithSignsPath,
                ...newData
              } = data;
              dispatch(
                putRentContractReducerAsyncApi({
                  ...newData,
                  staffSignature: url,
                })
              ).then((response) => {
                if (response.payload != undefined) {
                  parentCallback(false);
                  parentCallbackAlert("success");
                  parentCallbackMessageAlert("Nhân viên ký tên thành công");
                  dispatch(getRentContractByContractIdAsyncApi(data.contractGroupId));
                  // dispatch(postSendMailReducerAsyncApi(body));
                  dispatch(postSendMailReducerAsyncApi(body));
                  setPopupLoading(false);
                } else {
                  setPopupLoading(false);
                }
              });

            });
          });
        })
        .catch((error) => {
         
          setPopupLoading(false);
        });
    } else {
      setPopupLoading(true);
      const promises: Promise<{

        documentImg: UploadResult;
      }>[] = [];

      if (contractFiles) {
        contractFiles.forEach((image: any) => {
          const imageName = new Date().getTime() + '.png';
          const imageRef = ref(storage, `imgContractFiles/${imageName}`);
          const imgaeSnapshot = uploadBytes(imageRef, image.file);
          const promise = imgaeSnapshot.then((uploadResult) => ({
            title: image.title,
            documentDescription: "",
            documentImg: {
              metadata: uploadResult.metadata,
              ref: uploadResult.ref,
              contentType: uploadResult.metadata.contentType,
              imageName: imageName, // Thêm tên file vào đây
            },
          }));
          promises.push(promise);
        });
      }
      const snapshots = await Promise.all(promises);
      const urls = await Promise.all(
        snapshots.map((snapshot) =>
          getDownloadURL(snapshot.documentImg.ref).then((documentImg) => ({
            rentContractId: data.id,
            title: "",
            documentImg: documentImg
          }))
        )
      );


      dispatch(
        postRentContractFilesReducerAsyncApi(urls)
      ).then((response) => {
        if (response.payload != undefined) {
          parentCallback(false);
          parentCallbackAlert("success");
          parentCallbackMessageAlert("Cập nhật hợp đồng thành công");
          dispatch(getRentContractByContractIdAsyncApi(data.contractGroupId));
          dispatch(getRentContractFilesByContractIdAsyncApi(data.id));
          setContractFiles([]);
          setPopupLoading(false);
          dispatch(postSendMailReducerAsyncApi(body1));
          dispatch(putStatusCarContractgroupReducercarAsyncApi({
            id: data.contractGroupId,
            contractGroupStatusId: 7,
          }))
        } else {
          setPopupLoading(false);
        }
      });

    }
  };

  async function handleUpdatePdfReceiveContract() {
    try {
      setPopupLoading(true);
      const promises: any = [];
      const timestamp = new Date().getTime();
      const imageRefStaff = ref(storage, `images/staff_${timestamp}.png`);
      const imageRefCustomer = ref(storage, `images/customer_${timestamp}.png`);

      const staffDataURL = signCanvasExpertise.current.toDataURL();
      const staffBlob = await fetch(staffDataURL).then((response) =>
        response.blob()
      );
      const staffSnapshot = await uploadBytes(imageRefStaff, staffBlob);
      promises.push(staffSnapshot);

      const customerDataURL = signCanvasCustomer.current.toDataURL();
      const customerBlob = await fetch(customerDataURL).then((response) =>
        response.blob()
      );
      const customerSnapshot = await uploadBytes(
        imageRefCustomer,
        customerBlob
      );
      promises.push(customerSnapshot);

      const snapshots = await Promise.all(promises);

      const urls = await Promise.all(
        snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
      );

      const { isExported, fileWithSignsPath, ...newData } = data;
      const response = await dispatch(
        putReceiveContractReducerAsyncApi({
          ...newData,
          staffSignature: urls[0],
          customerSignature: urls[1],
        })
      );

      if (response.payload != undefined) {
        parentCallback(false);
        parentCallbackAlert("success");
        parentCallbackMessageAlert("Ký tên thành công");
        dispatch(getReceiveContractByContractIdAsyncApi(data.contractGroupId));
        setPopupLoading(false);
      } else {
        setPopupLoading(false);
      }
    } catch (error) {
      
      setPopupLoading(false);
    }
  }
  async function handleUpdatePdfTransferContract() {
    try {
      setPopupLoading(true);
      const promises: any = [];
      const timestamp = new Date().getTime();
      const imageRefStaff = ref(storage, `images/staff_${timestamp}.png`);
      const imageRefCustomer = ref(storage, `images/customer_${timestamp}.png`);

      const staffDataURL = signCanvasExpertise.current.toDataURL();
      const staffBlob = await fetch(staffDataURL).then((response) =>
        response.blob()
      );
      const staffSnapshot = await uploadBytes(imageRefStaff, staffBlob);
      promises.push(staffSnapshot);

      const customerDataURL = signCanvasCustomer.current.toDataURL();
      const customerBlob = await fetch(customerDataURL).then((response) =>
        response.blob()
      );
      const customerSnapshot = await uploadBytes(
        imageRefCustomer,
        customerBlob
      );
      promises.push(customerSnapshot);

      const snapshots = await Promise.all(promises);

      const urls = await Promise.all(
        snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
      );

      const { isExported, fileWithSignsPath, ...newData } = data;
      dispatch(
        putTransferContractReducerAsyncApi({
          ...newData,
          staffSignature: urls[0],
          customerSignature: urls[1],
        })
      ).then((response) => {
        if (response.payload != undefined) {
          parentCallback(false);
          parentCallbackAlert("success");
          parentCallbackMessageAlert("Ký tên thành công");
          dispatch(
            getTransferContractByContractIdAsyncApi(data.contractGroupId)
          );
          setPopupLoading(false);
        }
      });
    } catch (error) {
     
      setPopupLoading(false);
    }
    // Call your API update function here
  }

  const handleClose = () => {
    parentCallback(false);
  };
  const handleDialogContentScroll = () => {
    if (refNe.current != null) {
      refNe.current.scrollTop = 100;
    }
  };

  const [numPages, setNumPages] = useState(0);
  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
  };

  let signView: any;
  if (pdfName == "RentContract") {
    if (signStaff == null && role != "sale") {
      signView = (
        <div>
          <div className="font-bold text-xl mb-2">chữ ký người thẩm định</div>
          <div className="border-2 w-[400px] h-[250px]">
            <SignatureCanvas
              ref={signCanvasExpertise}
              penColor="#000000"
              canvasProps={{
                width: 400,
                height: 250,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            className="btn-choose-car mr-5"
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={() => signCanvasExpertise.current.clear()}
          >
            Ký lại
          </Button>
        </div>
      );
    } else if (signCustomer == null) {
      signView = (
        <div className="">
          <FormControl className="mb-2">
            <div className="item_box_image ">
              <Button
                variant="contained"
                component="label"
                className={dataContract.contractGroupStatusId <= 7 && role == "sale" ? "bg-white text-[#1976d2] shadow-none rounded-md " : "hidden"}
              >
                <AddPhotoAlternateIcon /> Thêm ảnh
                <input
                  type="file"
                  hidden
                  id="image5"
                  onChange={(e) =>
                    handleFileOtherInputChange(e)
                  }
                />
              </Button>
              {contractFiles.length >= 0 ==
                true ?
                (
                  <div className="w-full flex mx-5 gap-5 justify-center">
                    {rentContractFiles.length > 0 && rentContractFiles?.map((image: any, index: number) => {
                      return (
                        <div key={index} className="relative">
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
                            className="w-32 h-32"
                          />
                        </div>
                      );
                    })}
                    {contractFiles.length > 0
                      ? contractFiles?.map((image, index) => {
                        return (
                          <div key={index} className="relative">
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
                              className="w-32 h-32"
                            />
                          </div>
                        );
                      })
                      : contractFiles.map((image, index) => {
                        return (
                          <div key={index}>
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
                ) : undefined}
            </div>
          </FormControl>
        </div>
      );
    } else { }
  } else if (
    pdfName == "TransferContract" &&
    signStaff == null &&
    signCustomer == null
  ) {
    signView = (
      <div className="grid md:grid-cols-2">
        <div>
          <div className="font-bold text-xl mb-2">chữ ký người thẩm định</div>
          <div className="border-2 w-[400px] h-[250px]">
            <SignatureCanvas
              ref={signCanvasExpertise}
              penColor="#000000"
              canvasProps={{
                width: 400,
                height: 250,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            className="btn-choose-car mr-5"
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={() => signCanvasExpertise.current.clear()}
          >
            Ký lại
          </Button>
        </div>
        <div>
          <div className="font-bold text-xl mb-2">chữ ký người khách hàng</div>
          <div className="border-2 w-[400px] h-[250px]">
            <SignatureCanvas
              ref={signCanvasCustomer}
              penColor="#000000"
              canvasProps={{
                width: 400,
                height: 250,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            className="btn-choose-car mr-5"
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={() => signCanvasCustomer.current.clear()}
          >
            Ký lại
          </Button>
        </div>
      </div>
    );
  } else if (
    pdfName == "ReceiveContract" &&
    signStaff == null &&
    signCustomer == null
  ) {
    signView = (
      <div className="grid md:grid-cols-2">
        <div>
          <div className="font-bold text-xl mb-2">chữ ký người thẩm định</div>
          <div className="border-2 w-[400px] h-[250px]">
            <SignatureCanvas
              ref={signCanvasExpertise}
              penColor="#000000"
              canvasProps={{
                width: 400,
                height: 250,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            className="btn-choose-car mr-5"
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={() => signCanvasExpertise.current.clear()}
          >
            Ký lại
          </Button>
        </div>
        <div>
          <div className="font-bold text-xl mb-2">chữ ký người khách hàng</div>
          <div className="border-2 w-[400px] h-[250px]">
            <SignatureCanvas
              ref={signCanvasCustomer}
              penColor="#000000"
              canvasProps={{
                width: 400,
                height: 250,
                className: "sigCanvas",
              }}
            />
          </div>
          <Button
            className="btn-choose-car mr-5"
            sx={{ mt: 2 }}
            variant="contained"
            color="error"
            onClick={() => signCanvasCustomer.current.clear()}
          >
            Ký lại
          </Button>
        </div>
      </div>
    );
  }
  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          {popupLoading == true ? <PopupLoading /> : undefined}
          <form>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Bản hợp đồng dưới dạng PDF
            </BootstrapDialogTitle>
            <DialogContent ref={refNe} dividers>

              <div className="md:ml-32">
                <Document
                  file={
                    signStaff != null || signCustomer != null
                      ? pdfFileWithSignsPath
                      : pdf
                  }
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
              </div>
              {signView}
              <p>Link PDF: <a href={signStaff != null || signCustomer != null
                ? pdfFileWithSignsPath
                : pdf} className="text-blue-400" target="_blank">tại đây</a></p>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={
                  (signCustomer != null && signStaff != null) ||
                    pdfName == "AppraisalRecord"
                    ? true
                    : false
                }
                onClick={
                  pdfName == "RentContract"
                    ? handleUpdatePdfRentContract
                    : pdfName == "TransferContract"
                      ? handleUpdatePdfTransferContract
                      : handleUpdatePdfReceiveContract
                }
              >
                Hoàn thành
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
        <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
      </>
    );
  };
  return <>{renderPopupUI()}</>;
};
