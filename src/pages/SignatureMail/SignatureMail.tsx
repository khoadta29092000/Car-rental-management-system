import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PDFDocumentProxy } from "pdfjs-dist";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import { AlertComponent } from "../../Components/AlertComponent";
import { useAppSelector } from "../../hooks";
import {
  getRentContractByIdAsyncApi,
  putRentContractReducerAsyncApi,
  rentContractAction
} from "../../redux/RentContractReducer/RentContractReducer";
import { DispatchType, RootState } from "../../redux/store";
import { storage } from "../../util/FirebaseConfig";

export default function SignatureMail() {
  const param = useParams();
  const id: string | undefined = param.id;
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");
  const signCanvasCustomer = useRef() as React.MutableRefObject<any>;
  const signCanvasExpertise = useRef() as React.MutableRefObject<any>;
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  const [numPages, setNumPages] = useState(0);
  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
  };
  const { rentContractDetail } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  function ApiGetRentContractByStatusContracId(values: any) {
    const actionGetRentContractByStatusContracId =
      getRentContractByIdAsyncApi(values);
    dispatch(actionGetRentContractByStatusContracId);
  }
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    ApiGetRentContractByStatusContracId(id);
    return () => {
      dispatch(rentContractAction.deleteRentContract());
    };
  }, []);


  const dispatch: DispatchType = useDispatch();
  const handleUpdatePdfRentContract = () => {
    const imageRef = ref(storage, `images/${new Date().getTime()}.png`);
    fetch(signCanvasCustomer.current.toDataURL())
      .then((response) => response.blob())
      .then((blob) => {
        uploadBytes(imageRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            if (rentContractDetail) {
              const {
                createdDate,

                isExported,

                fileWithSignsPath,
                ...newData
              } = rentContractDetail;
              dispatch(
                putRentContractReducerAsyncApi({
                  ...rentContractDetail,
                  customerSignature: url,
                })
              ).then((response) => {
                if (response.payload != undefined) {
                  //   parentCallback(false);
                  //   parentCallbackAlert("success");
                  //   parentCallbackMessageAlert("Nhân viên ký tên thành công");
                  setMessageAlert("ký tên thành công");
                  setAlert("success");
                  ApiGetRentContractByStatusContracId(id);
                }
              });
            }
          });
        });
      })
      .catch((error) => {
  
      });
  };
  let buttonView;
  if (rentContractDetail?.customerSignature == null) {
    buttonView = (
      <div>
        <div className="font-bold text-xl mb-2">Chữ ký người khách hàng</div>
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
          className="btn-choose-car mr-5 mb-10"
          sx={{ mt: 2 }}
          variant="contained"
          color="error"
          onClick={() => signCanvasCustomer.current.clear()}
        >
          Ký lại
        </Button>
        <Button
          className="btn-choose-car mr-5 mb-10"
          sx={{ mt: 2 }}
          variant="contained"
          color="success"
          onClick={handleUpdatePdfRentContract}
        >
          Hoàn thành
        </Button>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", justifyContent: "center" }}>
      <Document
        file={
          rentContractDetail == null
            ? "https://carcontractv2.azurewebsites.net/pdfs/14/05abceda-3bd2-47c0-be2e-a69cc1b12c62.pdf"
            : rentContractDetail.fileWithSignsPath
        }
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      {buttonView}
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>
  );
}
