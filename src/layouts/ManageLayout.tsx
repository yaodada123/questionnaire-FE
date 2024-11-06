import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const ManageLayout: FC = () => {
  return (<>
    ManageLayout
    <br />
    <Outlet />
  </>)
}

export default ManageLayout;