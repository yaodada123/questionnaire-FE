import React, { FC, useCallback } from "react";
import { nanoid } from "nanoid";
import { Typography } from "antd";
import { useDispatch } from "react-redux";
import {
  componentConfGroup,
  ComponentConfType,
} from "../../../components/QuestionComponents";
import { addComponent } from "../../../store/componentsReducer";
import styles from "./ComponentLib.module.scss";

const { Title } = Typography;

function GetComponent(c: ComponentConfType) {
  const { title, type, Component, defaultProps } = c;
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(
      addComponent({
        fe_id: nanoid(), // 前端生成的 id
        title,
        type,
        props: defaultProps,
      })
    );
  }, []);

  return (
    <div key={type} className={styles.wrapper} onClick={handleClick}>
      {/* <div key={type} className={styles.wrapper}> */}
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  );
}

const Lib: FC = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => {
        const { groupId, groupName, components } = group;

        return (
          <div key={groupId} >
            <Title
              level={3}
              style={{
                fontSize: "16px",
                marginTop: index > 0 ? "20px" : "0",
              }}
            >
              {groupName}
            </Title>
            <div >{components.map((c) => GetComponent(c))}</div>
          </div>
        );
      })}
    </>
  );
};

export default Lib;
