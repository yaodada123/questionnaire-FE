

export type QuestionTitleProps = {
  title?: string,
  level?: 1 | 2 | 3 | 4 | 5,
  isCenter?: boolean
}

export const QuestionTitleDefaultProps : QuestionTitleProps = {
  title: "这是一个标题",
  level: 1 ,
  isCenter: false
}