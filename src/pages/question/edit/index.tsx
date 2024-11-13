import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionService } from "../../../services/question";

const Edit: FC = () => {
  const { id = "" } = useParams();
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState({});
  useEffect(() => {
    async function fn() {
      setLoading(true)
      const data = await getQuestionService(id);
      setQuestionData(data);
      setLoading(false);
    }
    fn();
  }, []);
  return <>Edit 
    {loading ? "loading.,," : JSON.stringify(questionData)}
  </>;
};

export default Edit;
