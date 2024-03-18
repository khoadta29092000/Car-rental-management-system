import vnLocale from "@fullcalendar/core/locales/vi";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridWeek from "@fullcalendar/timegrid";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CarscheduleAction, getCarscheduleAsyncApi } from "../../redux/CarscheduleReducer/CarscheduleReducer";
import { DispatchType, RootState } from "../../redux/store";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { PostCalender } from "./ModalCalender/PostCalender";
import { getcaractiveAsyncApi } from "../../redux/CarReducer/CarReducer";
import { AlertComponent } from "../../Components/AlertComponent";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { UpdateCalender } from "./ModalCalender/UpdateCalender";
type Props = {}

export default function Calendar({ }: Props) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [alert, setAlert] = useState("");

  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };

  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopup1 = (childData: any) => {
    setOpen1(childData);
  };
  const moment = require("moment");

  const dispatch: DispatchType = useDispatch();
  const { Carschedule, showPopup, alertAction, message } = useSelector((state: RootState) => state.Carschedule);
  const [userDad, setUserDad] = useState({});
  // const getAllCarschedule = useCallback(() => {
  //   const actionAsync = getCarscheduleAsyncApi();
  //   dispatch(actionAsync);
  // }, [dispatch]);

  const getAllCarschedule = () => {
    const actionAsync = getCarscheduleAsyncApi();
    dispatch(actionAsync);
  };

  useEffect(() => {

    getAllCarschedule()
    if (showPopup == false) {
      setOpen(false);
    }
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (message != null) {
      setMessageAlert(message);
    }
    if (showPopup == false) {
      setOpen1(false);
    }
  }, [alertAction]);
  const handleClickOpenAdd = () => {
    setOpen(true);
    dispatch(CarscheduleAction.showPopup());
  };

  const [id, setid] = useState<number | null>(null);
  const [event, setEvent] = useState(null);
  const [carStatusId, setCarStatusId] = useState<number>(0);
  const [carId, setCarId] = useState<number>(0);
  const handleClickOpenUpdate = (event: any, id: number, carid: number, carstatusid: number, car: object) => {

    setOpen1(true);
    setUserDad(car);
    dispatch(CarscheduleAction.showPopup());
    setid(id);
    setEvent(event);
    setCarId((carid));
    setCarStatusId(carstatusid);
    if (id != null) {
      setid(id)
    }
    if (carid != null) {
      setCarId(carid)
    }
  };

  const resources = Carschedule.map((schedule) => ({
    id: schedule.carLicensePlates,
    title: `${schedule.carLicensePlates}`,
    carLicensePlates: schedule.carLicensePlates,

  }));

  const handleEventClick = (info: any) => {
    const { extendedProps: { id1: id, carid1: carId, title1: carStatusId } } = info.event;
    handleClickOpenUpdate(info.event, id, carId, carStatusId, {});
  };
  const events = Carschedule.map((schedule) => {
    let color = '';
    switch (schedule.carStatusId) {
      case 1:
        color = 'yellow';
        break;
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'red';
        break;
      case 4:
        color = 'blue';
        break;
      case 5:
        color = 'purple';
        break;
      case 6:
        color = 'pink';
        break;
      case 7:
        color = 'gray';
        break;
      case 8:
        color = 'orange';
        break;
      case 9:
        color = 'teal';
        break;
      case 10:
        color = 'indigo';
        break;
      default:
        color = 'green';
        break;
    }
    const start = schedule.dateStart ? moment(schedule.dateStart).toDate() : null;
    const end = schedule.dateEnd ? moment(schedule.dateEnd).toDate() : null;
    return {
      title: schedule.carStatusName,
      title1: schedule.carStatusId,
      carid1: schedule.carId,
      id1: schedule.id,
      resourceId: schedule.carLicensePlates,
      start,
      end,
      color,
    };
  });


  return (
    <div className="w-full py-8 px-5 bg-white relative ">
      <div className="  xl:flex mb-2 w-full  absolute right-48 top-[32px]">
        <div className="ml-auto flex justify-between flex-wrap  gap-5 ">
          <Button
            className="text-gray-600 h-10 hover:text-green-400  border-gray-400 shadow-lg"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpenAdd}
          >

            Thêm Mới
          </Button>

        </div>
      </div>
      <FullCalendar
        plugins={[timeGridWeek, resourceTimelinePlugin]}
        locale={vnLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "resourceTimelineMonth,timeGridWeek",
        }}
        initialView="resourceTimelineMonth"
        events={events}
        resources={resources}
        resourceAreaWidth={120}
        height={"85vh"}
        eventClick={handleEventClick}

      />
      <PostCalender
        openDad={open}
        parentCallback={callbackFunctionPopup}

      />
      <UpdateCalender
        openDad={open1}
        parentCallback={callbackFunctionPopup1}
        event={event}
        userDad={userDad}
        carId={carId}
        id={id}
        carStatusId={carStatusId}
      />
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>


  );
}