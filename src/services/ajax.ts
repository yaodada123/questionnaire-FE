import axios from 'axios'
import { message } from 'antd'
import { getToken } from '../utils/user-token'

const instance = axios.create({
  timeout: 10 * 1000, //设置请求等待时间
})

// request 拦截：每次请求都带上 token
instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${getToken()}` // JWT 的固定格式
    return config
  },
  error => Promise.reject(error)
)

// response 拦截：统一处理 errno 和 msg
instance.interceptors.response.use(res => {
  const resData = (res.data || {}) as ResType
  const { errno, data, msg } = resData

  if (errno !== 0) {
    // 错误提示
    if (msg) {
      message.error(msg)
    }

    throw new Error(msg)
  }

  return data as any
})

export default instance

// 设置结果类型
export type ResType = {
  errno: number
  data?: ResDataType
  msg?: string
}

// 对象只要是字符串的键即可
export type ResDataType = {
  [key: string]: any
}
