import React, { FC } from "react";
import { QuestionTitleProps, QuestionTitleDefaultProps } from "./interface";
import { Typography } from "antd";

const { Title } = Typography;

const QuestionTitle: FC<QuestionTitleProps> = (props: QuestionTitleProps) => {
  let {
    title = "",
    level = 1,
    isCenter = false,
  } = { ...QuestionTitleDefaultProps, ...props };
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
        {title}
      </Title>
    </div>
  );
};
export default QuestionTitle;
