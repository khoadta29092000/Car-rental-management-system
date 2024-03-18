import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  unstable_HistoryRouter as HistoryBrowser,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./index.css";
import Calendar from "./pages/Calendar/Calendar";
import Car from "./pages/Car/Car";
import CarDetail from "./pages/Car/CarDetail";
import Customerinfo from "./pages/Customerinfo/Customerinfo";
import Admindashboard from "./pages/Dashboard/Admindashboard/Admindashboard";
import Login from "./pages/Login/Login";
import Parking from "./pages/Parking/Parking";
import Profile from "./pages/Profile/Profile";
import ProfileDetail from "./pages/Profile/ProfileDetail";
import UserManagement from "./pages/UserManagement/UserManagement";
import { store } from "./redux/store";
import AdminTemplate from "./templates/AdminTemplate";
import HomeTemplate from "./templates/HomeTemplate";
import { history } from "./util/config";
// import '@apexcharts/css/apexcharts.css';
import CarActive from "./pages/Car/CarOperatorStaff/CarActive";
import ContractGroupAdmin from "./pages/ContractGroup/ContractGroupAdmin/ContractGroup";
import DetailsTemplateAdmin from "./pages/ContractGroup/ContractGroupAdmin/DetailsTemplate";
import ContractGroupExpertise from "./pages/ContractGroup/ContractGroupExpertise/ContractGroup";
import DetailsTemplateExpertise from "./pages/ContractGroup/ContractGroupExpertise/DetailsTemplate";
import CustomerinfoDetail from "./pages/Customerinfo/CustomerinfoDetail";
import Expertisedashboard from "./pages/Dashboard/Expertisedashboard/Expertisedashboard";
import Operatordashboard from "./pages/Dashboard/OperatorStaffdashboard/Operatordashboard";
import CarMaintenanceInfo from "./pages/Maintenance/CarMaintenanceInfo";
import CarMaintenanceInfoDetail from "./pages/Maintenance/CarMaintenanceInfoDetail";
import Parkingdetail from "./pages/Parking/Parkingdetail";
import ProfileAdmin from "./pages/Profile/ProfileAdmin";
import CarNeedRegistry from "./pages/Registry/CarNeedRegistry";
import CarNeedRegistryDetail from "./pages/Registry/CarNeedRegistryDetail";
import SignatureMail from "./pages/SignatureMail/SignatureMail";
import Statistic from "./pages/statistics/Statistic";
import StatisticCar from "./pages/statistics/StatisticCar";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <HistoryBrowser history={history}>
      <Routes>
      <Route index element={<Login />}></Route>
          <Route path="" element={<Navigate to="" />}></Route>

        <Route path="" element={<HomeTemplate />}>
          
          <Route path="profile" element={<Profile />}>
            {" "}

          </Route>
          {/* <Route path="retalcar" element={<Retalcar />}></Route> */}
          <Route path="profiledetail" element={<ProfileDetail />}>
            <Route path=":id"></Route>
          </Route>
        </Route>
        <Route path="signature" element={<SignatureMail />}>
          <Route path=":id"></Route>
        </Route>
        <Route path="Admin" element={<AdminTemplate />}>
          <Route path="CarManagement" element={<Car />}></Route>
          {/* <Route path="Setting" element={<Setting />}></Route> */}
          <Route path="parking" element={<Parking />}></Route>
          <Route
            path="parking/Parkingdetail"
            element={<Parkingdetail />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="Calendar" element={<Calendar />}></Route>
          <Route path="Statistic/Time" element={<Statistic />}></Route>
          <Route path="Statistic/Car" element={<StatisticCar />}></Route>
          <Route path="Profile" element={<ProfileAdmin />}></Route>
          <Route
            path="CarMaintenanceInfo"
            element={<CarMaintenanceInfo />}
          ></Route>
          <Route
            path="CarMaintenanceInfo/CarMaintenanceInfoDetail"
            element={<CarMaintenanceInfoDetail />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="CarNeedRegistry" element={<CarNeedRegistry />}></Route>
          <Route
            path="CarNeedRegistry/CarNeedRegistryDetail"
            element={<CarNeedRegistryDetail />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="Customerinfo" element={<Customerinfo />}></Route>
          <Route
            path="Customerinfo/CustomerinfoDetail"
            element={<CustomerinfoDetail />}
          >
            <Route path=":id"></Route>
          </Route>

          {/* <Route path="CarDetail" element={<CarDetail />}></Route> */}
          <Route path="ContractGroup" element={<ContractGroupAdmin />}></Route>



          <Route
            path="ContractGroup/ContractGroupDetail"
            element={<DetailsTemplateAdmin />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="Admindashboard" element={<Admindashboard />}></Route>
          <Route path="UserManagement" element={<UserManagement />}></Route>
          <Route path="CarManagement/CarDetail" element={<CarDetail />}>
            <Route path=":id"></Route>
          </Route>
        </Route>
        <Route path="Expertise" element={<AdminTemplate />}>
          <Route path="parking" element={<Parking />}></Route>
          <Route
            path="parking/Parkingdetail"
            element={<Parkingdetail />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route
            path="Expertisedashboard"
            element={<Expertisedashboard />}
          ></Route>
          <Route
            path="ContractGroup"
            element={<ContractGroupExpertise />}
          ></Route>
          <Route
            path="ContractGroup/ContractGroupDetail"
            element={<DetailsTemplateExpertise />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="CarManagement" element={<Car />}></Route>
          <Route path="CarManagement/CarDetail" element={<CarDetail />}>
            {/* <Route path=':id'element={<CarDetail />} ></Route> */}
            <Route path=":id"></Route>
          </Route>
          <Route path="Customerinfo" element={<Customerinfo />}></Route>
          <Route path="Customerinfo/CustomerinfoDetail"
            element={<CustomerinfoDetail />}>
            <Route path=":id"></Route>
          </Route>
        </Route>

        <Route path="Operator" element={<AdminTemplate />}>
          <Route path="CarActiveManagement" element={<CarActive />}></Route>
          <Route path="CarActiveManagement/CarDetail" element={<CarDetail />}>
            <Route path=":id"></Route>
          </Route>
          <Route path="Calendar" element={<Calendar />}></Route>
          <Route path="CarNeedRegistry" element={<CarNeedRegistry />}></Route>
          <Route
            path="CarNeedRegistry/CarNeedRegistryDetail"
            element={<CarNeedRegistryDetail />}
          >
            <Route path=":id"></Route>
          </Route>
          <Route path="Customerinfo" element={<Customerinfo />}></Route>
          <Route path="Customerinfo/CustomerinfoDetail"
            element={<CustomerinfoDetail />}>
            <Route path=":id"></Route>
          </Route>
          <Route path="CarMaintenanceInfo" element={<CarMaintenanceInfo />}  ></Route>
          <Route path="CarMaintenanceInfo/CarMaintenanceInfoDetail" element={<CarMaintenanceInfoDetail />}>
            <Route path=":id"></Route>
          </Route>
          <Route path="Operatordashboard" element={<Operatordashboard />}></Route>
        </Route>

      </Routes>
    </HistoryBrowser>
  </Provider>
);
