import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserStateType = {
  username: string
  nickname: string
}

const INIT_STATE: UserStateType = { username: '', nickname: '' }

// 存储用户相关信息
export const userSlice = createSlice({
  name: 'user',
  initialState: INIT_STATE,
  reducers: {
    loginReducer: (state: UserStateType, action: PayloadAction<UserStateType>) => {
      return action.payload // 设置 username nickname 到 redux store
      // 用不到 immer
    },
    logoutReducer: () => INIT_STATE, // 清空 redux store
  },
})

export const { loginReducer, logoutReducer } = userSlice.actions

export default userSlice.reducer
