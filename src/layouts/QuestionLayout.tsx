import React, { FC } from "react";
import { Outlet } from "react-router-dom";


const QuestionLayout: FC = () => {
  return (<>
    {/* QuestionLayout */}
    {/* <br /> */}
    <Outlet />
  </>)
}

export default QuestionLayout;