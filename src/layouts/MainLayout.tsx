import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const MainLayout: FC = () => {
  return (<>
    MainLayout
    <br />
    <Outlet />
  </>)
}

export default MainLayout;