import axios from 'axios'
import { message } from 'ant-design-vue'
import ApiUri from './api'
import store from '../store/app'
import router from '../router/index'
import { Throttle } from '../utils/index'

// 节流
const Throttle_: any = Throttle()

// restful的参数
interface IBindVars {
  key: string
  value: string | number
}
// 请求参数类型
export interface IParams {
  uriCode: any
  method?: string
  bindVars?: IBindVars[]
  [key: string]: any
}

// 配置的环境变量
const VITE_BASE_API: any = import.meta.env.VITE_BASE_API
// create an axios instance
export const request = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 30000
})

// request interceptor
request.interceptors.request.use(
  config => {
    if (config.data && Array.isArray(config.data.bindVars)) {
      config.data.bindVars.forEach((item: any) => {
        if (config.url) {
          config.url = config.url.replace(`:${item.key}`, `${item.value}`)
        }
      })
      delete config.data.bindVars
    }

    // 添加header
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json'
      config.headers['Access-Control-Allow-Origin'] = '*'
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
      config.headers['X-Token'] = sessionStorage.getItem('token') || ''

      // 判断是否需要展示加载组件
      // if (config.data._showLoading) {
      //   config.headers['_showLoading'] = true
      //   delete config.data._showLoading
      //   store().updateGlobalLoading(true)
      // }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: any) => {
    let { data, status, config } = response
    if (status >= 200 && status < 300 && data.code === 0) {
      const oldApi = ['/api/v1/getCaptcha', '/login']
      if (oldApi.includes(response.request.url)) {
        return data
      }
      return data.data
    } else if (data.code === 401) {
      // 登录状态过期
      message.error('登录状态已过期，请重新登录！')
      sessionStorage.clear()
      router.push({ name: 'login' })
      return Promise.reject(response)
    } else if (status >= 200 && status < 300) {
      // 判断如果是下载文件流的接口直接返回
      return data
    } else {
      message.error(data.msg || '系统错误！')
      return Promise.reject(response)
    }
  },
  error => {
    // 判断当前请求是否是需要显示加载组件，如果是就取消
    if (error.response.headers._showLoading) {
      store().updateGlobalLoading(false)
    }
    let errDescription = '服务异常，请重试！'
    switch (error.response.status) {
      case 400:
        errDescription = error?.data?.detail || '请求参数错误！'
        break
      case 401:
        errDescription = '登录状态已过期，请重新登录！'
        break
      case 404:
        errDescription = '请求资源未找到！'
        break
      default:
        errDescription = '服务异常，请重试！'
    }
    new Throttle_(() => {
      message.error(errDescription)
    }, 300)
    // token失效，鉴权失败
    if (error.response.status === 401) {
      sessionStorage.clear()
      router.push({ name: 'login' })
      return
    }
    return Promise.reject(error)
  }
)

const newApiUri: any = ApiUri
const fetch = (params: IParams) => {
  // 当前api对象
  const uriObj = newApiUri[params[`uriCode`]]
  // 请求的url
  const url = uriObj.restful ? uriObj.uri + '/' + params['id'] : uriObj.uri
  // 请求的方法类型
  let method
  if (!uriObj.method) {
    method = 'get'
  } else {
    method = uriObj.method
  }
  // 获取传给后端的参数
  const data = JSON.parse(JSON.stringify(params))
  delete data[`uriCode`]
  delete data.method
  if (uriObj.restful) {
    delete data.id
  }
  const _service: any = request
  if (['get', 'delete'].includes(method)) {
    return _service[method](url, { params: data })
  } else {
    return _service[method](url, data)
  }
}

export default fetch
