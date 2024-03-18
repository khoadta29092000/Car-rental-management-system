import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../layouts/Layout/NavbarAdmin";
import { DispatchType } from "../redux/store";

export default function AdminTemplate() {
  const dispatch: DispatchType = useDispatch();

  
  return (
    <>
      <div className="grid grid-cols-1 ">
        <NavbarAdmin />
        <div className="pt-[60px] h-screen  md:ml-64 flex-auto bg-gray-100 ">
          <Outlet />
        </div>
      </div>
    </>
  );
}
//phần dùng chung
