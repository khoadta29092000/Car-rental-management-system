import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { NavLink, useParams } from "react-router-dom";
import CheckingProgress from "./CheckingProgress";
function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();

}
export default function DetailsTemplateAdmin(props: any) {
  const { id } = useParams();
  return (
    <div className=" bg-white">
      <div
        className="pt-2 md:mx-5 mx-2"
        role="presentation"
        onClick={handleClick}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink to="/Admin/ContractGroup" className="hover:underline">
            Hợp đồng
          </NavLink>
          <Typography className="text-sm" color="text.primary">
            Chi tiết hợp đồng
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="pt-2 py-5 md:mx-5 mx-2">
        <CheckingProgress check={id} />
      </div>
    </div>
  );
}
