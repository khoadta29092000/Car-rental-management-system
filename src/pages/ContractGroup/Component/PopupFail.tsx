import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch } from "react-redux";
import { postAppraisalRecordReducerAsyncApi } from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import { putCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { postSendMailReducerAsyncApi, putRentContractReducerAsyncApi } from "../../../redux/RentContractReducer/RentContractReducer";
import { DispatchType } from "../../../redux/store";
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

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
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
export const PopupFail = (props: any) => {
  const {
    openDad,
    parentCallback,
    data,
    isCar,
    dataNewFiles,
    parentCallbackMessageAlert,
    parentCallbackAlert,
    isRentContract,
    dataRentContract,
  } = props;
  const dispatch: DispatchType = useDispatch();
  const [resultDescription, setResultDescription] = useState("");
  const [error, setError] = useState("");
  let { customerFiles, ...newData } = data;

  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  const dataNewFilesList =
    isCar == true || isCar == undefined
      ? {}
      : dataNewFiles.map((item: any) => (item.status == true ? {
        id: item.id,
        customerInfoId: item.customerInfoId,
        typeOfDocument: item.typeOfDocument,
        title: item.title,
        documentImg: null,
        documentDescription: item.documentDescription,
      } : {
        typeOfDocument: item.typeOfDocument,
        title: item.title,
        documentImg: null,
        documentDescription: item.documentDescription,
      }));

  const body = {
    ToEmail: `${data.staffEmail}`,
    Subject: `[ATSHARE] Thông báo yêu cầu thuê xe đơn ${data.id}`,
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
            Yêu cầu thất bại
        </h1>
        <p style=" padding-top: 5px;
        color: #404F5E;
        font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
           font-size: 20px;
           margin: 0;">Yêu cầu thuê:${data.id}</p>
           <p style=" padding-top: 5px;
           color: #404F5E;
           font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
              font-size: 20px;
              margin: 0;">Lý do:${resultDescription}</p>  
          
                 <p style=" padding-top: 5px;
                 color: ##DCDCDC;
                 font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
                    font-size: 20px;
                    margin: 0;">Lưu ý: Vui lòng cập nhật lại thông tin(<a href="https://atshare.vercel.app/profiledetail/${data.id}">tại đây</a>)</p>  
</body></html>`,

  };
  const handleUpdate = () => {
    if (resultDescription == "") {
      setError("Phải nhập lí do thất bại");
    } else {
      setError("");
      if (isRentContract == true) {
        dispatch(
          putRentContractReducerAsyncApi({
            ...dataRentContract,
            cancelReason: resultDescription,
          })
        ).then((response) => {
          if (response.payload != undefined) {
            parentCallback(false);
            parentCallbackAlert("success");
            parentCallbackMessageAlert("Tạm hủy hợp đồng thành công");
          }
        });
      }
      if (isCar == true) {
        dispatch(
          postAppraisalRecordReducerAsyncApi({
            id: 0,
            carId: null,
            contractGroupId: data.id,
            expertiserId: userProfile?.id,
            expertiseDate: new Date(),
            resultOfInfo: true,
            resultOfCar: false,
            resultDescription: resultDescription,
            depositInfoCarRental: 0,
            depositInfoDownPayment: 0,
            //filePath: null,
          })
        );
        dispatch(postSendMailReducerAsyncApi(body));
        parentCallbackMessageAlert("Đơn đã bị huỷ");
        parentCallbackAlert("success");
      } else if (isCar == false) {
        dispatch(
          postAppraisalRecordReducerAsyncApi({
            id: 0,
            carId: null,
            contractGroupId: data.id,
            expertiserId: userProfile?.id,
            expertiseDate: new Date(),
            resultOfInfo: false,
            resultOfCar: false,
            resultDescription: resultDescription,
            depositInfoCarRental: 0,
            depositInfoDownPayment: 0,
            //filePath: null,
          })
        );
        dispatch(postSendMailReducerAsyncApi(body));
        dispatch(
          putCarContractgroupReducercarAsyncApi({
            ...newData,
            customerFiles: dataNewFilesList,
          })
        );
        parentCallbackMessageAlert("Đơn đã bị huỷ");
        parentCallbackAlert("success");
      }
    }
  };
  const handleClose = () => {
    parentCallback(false);
  };
  const handleClear = () => {
    parentCallback(false);
  };

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
          <form>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Mô tả thất bại
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <div className="mb-1">
                <TextField
                  sx={{ my: 0 }}
                  name="rentPurpose"
                  fullWidth
                  multiline
                  rows={7}
                  id="outlined-basic"
                  label="Lí do thất bại*"
                  variant="outlined"
                  className="w-full"
                  error={error == "" ? false : true}
                  onChange={(e) => setResultDescription(e.target.value)}
                />
              </div>
              {error == "" ? null : (
                <div className="text-xs text-red-500 ">{error}</div>
              )}
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={handleClear}>
                Huỷ bỏ
              </Button>
              <Button color="success" onClick={handleUpdate}>
                Hoàn thành
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };
  return <>{renderPopupUI()}</>;
};
