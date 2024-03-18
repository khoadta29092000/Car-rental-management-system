import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertComponent } from "../../../Components/AlertComponent";
import { useAppSelector } from "../../../hooks";
import { getByIdCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { DispatchType, RootState } from "../../../redux/store";
import AppraisalRecord from "./AppraisalRecord";
import ContractGroupDetail from "./ContractGroupDetails";
import CustomStepper from "./CustomStepper";
import RentContract from "./RentContract";

export default function CheckingProgress(props: any) {
  let { check } = props;
  const [contractGrId, setContractGrId] = useState();
  const [currentStep, setCurrentStep] = useState<number | null>();
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");
  const [message, setMessage] = useState(false);
  let callbackFunction = (childData: any) => {
    setMessage(childData);
  };
  let callbackFunctionChecking = (childData: any) => {
    setCurrentStep(childData);
  };
  const dispatch: DispatchType = useDispatch();
  const { status, loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const getContractByIdAPi = () => {
    const actionAsync = getByIdCarContractgroupReducercarAsyncApi(check);
    dispatch(actionAsync).then((response) => {
      if (response.payload != undefined) {
        getViewForValue(response.payload.contractGroupStatusId);
        setContractGrId(response.payload.contractGroupStatusId);
      }
    });
  };

  const { statusAppraisalRecord } = useAppSelector(
    (state: RootState) => state.AppraisalRecord
  );
  const { statusRentContract } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  const { statusTransferContract } = useAppSelector(
    (state: RootState) => state.TransferContract
  );
  const { statusReceiveContract } = useAppSelector(
    (state: RootState) => state.ReceiveContract
  );
  function getViewForValue(value: any) {
    if (value === 1 || value === 2) {
      if (message == true) {
        return setCurrentStep(1);
      } else {
        return setCurrentStep(0);
      }
    } else if (value === 3 || value === 4) {
      return setCurrentStep(1);
    } else if (value === 5 || value === 6 || value === 7) {
      return setCurrentStep(2);
    }
    else if (value === 8 || value === 9 || value === 10) {
      return setCurrentStep(3);
    }
    else {
      return setCurrentStep(3);
    }
  }
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  useEffect(() => {
    getContractByIdAPi();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return () => {
      setCurrentStep(undefined);
    };
  }, [
    status,
    statusAppraisalRecord,
    statusRentContract,
    statusTransferContract,
    statusReceiveContract,
    message,
  ]);
  let viewDetail;
  switch (currentStep) {
    case 0:
      viewDetail = (
        <ContractGroupDetail
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
          parentCallback={callbackFunction}
        />
      );
      break;
    case 1:
      viewDetail = (
        <AppraisalRecord
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
        />
      );
      break;

    case 2:
      viewDetail = (
        <RentContract
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
        />
      );

      break;
    case 3:
      viewDetail = (
        <RentContract
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
        />
      );
      break;
    default:
      break;
  }

  let Progress;
  if (contractGrId != undefined)
    switch (contractGrId) {
      case 1:
        if (message == false) {
          Progress = (
            <CustomStepper
              parentCallback={callbackFunctionChecking}
              activeStep={0}
              completed={{}}
            />
          );
        } else {
          Progress = (
            <CustomStepper
              parentCallback={callbackFunctionChecking}
              activeStep={1}
              completed={{ 0: true }}
            />
          );
        }
        break;
      case 2:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            isCancelCar={false}
            activeStep={0}
            completed={{}}
          />
        );
        break;
      case 3:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            isCancelCar={true}
            activeStep={1}
            completed={{ 0: true }}
          />
        );
        break;
      case 4:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={1}
            completed={{ 0: true, 1: true }}
          />
        );
        break;
      case 5:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true }}
          />
        );
        break;
      case 6:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true }}
          />
        );
        break;
      case 7:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true, 2: true }}
          />
        );
        break;
      case 8:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true, 2: true }}
          />
        );
        break;
      case 11:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true, 2: true }}
          />
        );
        break;
      default:
        Progress = (
          <CustomStepper
            parentCallback={callbackFunctionChecking}
            activeStep={2}
            completed={{ 0: true, 1: true, 2: true }}
          />
        );
  break;
    }
  // return loading == true ? (
  //   <Loading />
  // ) : (
  //   <>
  //     {Progress}
  //     {viewDetail}
  //   </>
  // );
  return (
    <>
      {Progress}
      {viewDetail}
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </>
  );
}
