import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionService } from "../../../services/question";
import styles from "./index.module.scss";
import EditCanvas from "./EditCanvas";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import EditHeader from "./EditHeader";

const Edit: FC = () => {
  const { id = "" } = useParams();
  // const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState({});
  const { loading } = useLoadQuestionData();

  useEffect(() => {
    async function fn() {
      // setLoading(true);
      const data = await getQuestionService(id);
      setQuestionData(data);
      // setLoading(false);
    }
    fn();
  }, []);
  // return <>Edit
  //   {loading ? "loading.,," : JSON.stringify(questionData)}
  // </>;
  return (
    <div className={styles.container}>
      {/* <div style={{ backgroundColor: "#fff" }}></div> */}
      <EditHeader />
      <div className={styles["content-wrapper"]}>
        <div className={styles.content}>
          <div className={styles.left}>
            <LeftPanel />
          </div>
          <div className={styles.main}>
            <div className={styles["canvas-wrapper"]}>
              {/* <div style={{ height: "900px" }}>画布滚动测试</div> */}
              <EditCanvas loading={loading}></EditCanvas>
            </div>
          </div>
          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
