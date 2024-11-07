import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuestionService } from "../../../services/question";

const Edit: FC = () => {
  const { id = "" } = useParams();
  console.log(id, "id_");
  
  const _id = "10";
  useEffect(() => {
    async function fn() {
      const data = await getQuestionService(id);
      console.log(data);
    }
    fn();
  }, []);
  return <>Edit </>;
};

export default Edit;
