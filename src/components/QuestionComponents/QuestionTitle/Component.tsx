import React, { FC } from "react";
import { QuestionTitlePropsType, QuestionTitleDefaultProps } from "./interface";
import { Typography } from "antd";

const { Title } = Typography;

const QuestionTitle: FC<QuestionTitlePropsType> = (props: QuestionTitlePropsType) => {
  let {
    text = "",
    level = 1,
    isCenter = false,
  } = { ...QuestionTitleDefaultProps, ...props };
  // console.log("看看传入的标题", props);
  
  let getFontSize = (level: number) => {
    if ((level = 1)) return 24;
    if ((level = 2)) return 20;
    if ((level = 3)) return 16;
  };
  return (
    <div>
      <Title
        style={{
          textAlign: isCenter ? "center" : "left",
          fontSize: getFontSize(level),
          marginBottom: 0,
        }}
      >
        {text}
      </Title>
    </div>
  );
};
export default QuestionTitle;
