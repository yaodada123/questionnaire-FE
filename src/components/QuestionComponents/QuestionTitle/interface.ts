

export type QuestionTitlePropsType = {
  text?: string,
  level?: 1 | 2 | 3 | 4 | 5,
  isCenter?: boolean,
  onChange?: (newProps: QuestionTitlePropsType) => void
  disabled?: boolean
}

export const QuestionTitleDefaultProps : QuestionTitlePropsType = {
  text: "这是一个标题",
  level: 1 ,
  isCenter: false
}