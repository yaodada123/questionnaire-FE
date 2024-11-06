import React, { FC, useState } from "react";
import styles from "./List.module.scss";


const rawquestionList = [
  {
    id: "q1",
    title: "问卷1",
    isPublished: false,
    isStar: false,
    answerCount: 3,
    createAt: "3月11日 12:23",
  },
  {
    id: "q2",
    title: "问卷2",
    isPublished: true,
    isStar: false,
    answerCount: 4,
    createAt: "3月1日 18:03",
  },
  {
    id: "q3",
    title: "问卷3",
    isPublished: false,
    isStar: false,
    answerCount: 38,
    createAt: "3月13日 14:23",
  },
  {
    id: "q4",
    title: "问卷4",
    isPublished: true,
    isStar: false,
    answerCount: 89,
    createAt: "3月21日 12:23",
  },
];

const List: FC = () => {
  let [questionList, setQuestionList] = useState(rawquestionList);
  return (
    <>
      <div className={styles.header}>header</div>
      <div>left</div>
      <div>right</div>
    </>
  );
};

export default List;
