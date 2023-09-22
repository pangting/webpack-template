import axios from 'axios'
import qs from 'qs'
import errorCode from './errorCode'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

const request_timeout = 30000
const result_code = 200

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: request_timeout, // 请求超时时间
  withCredentials: false // 禁用 Cookie 等信息
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    const params = config.params || {}
    const data = config.data || false
      if (
      config.method?.toUpperCase() === 'POST' &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data)
      }
    // get参数编码
    if (config.method?.toUpperCase() === 'GET' && params) {
      let url = config.url + '?'
      for (const propName of Object.keys(params)) {
        const value = params[propName]
        if (value !== void 0 && value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const val of Object.keys(value)) {
              const params = propName + '[' + val + ']'
              const subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[val]) + '&'
            }
          } else {
            url += `${ propName }=${ encodeURIComponent(value) }&`
          }

        }
      }
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据
      // const now = new Date().getTime()
      // params = params.substring(0, url.length - 1) + `?_t=${now}`
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error) => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  async (response) => {
    const { data } = response
    if (!data) {
      // 返回“[HTTP]请求没有返回值”;
      throw new Error()
    }
    // 未设置状态码则默认成功状态
    const code = data.code || result_code
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response.data
    }
    // 获取错误信息
    const msg = data.msg || errorCode[code] || errorCode['default']
    if (code === 401) {
        goLogin()
    } else if (code !== 200) {
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    } else {
      return data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
      if (error?.response?.status === 401) {
        goLogin()
      } else {
        ElMessage.error(error)
      }
    return Promise.reject(error)
  }
)

const goLogin = () => {
  ElMessageBox.confirm('用户鉴权失败，请重新登陆', '警告', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false,
    showCancelButton: false,
    closeOnClickModal: false
  }).then(() => {
    location.reload()
  })
}
export { service }
