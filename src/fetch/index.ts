/*
 * @Description: 请求封装
 * @Author: zhangping
 * @Date: 2019-07-19 17:40:49
 * @LastEditTime: 2019-09-24 17:37:29
 * @LastEditors: Please set LastEditors
 */
import Fly, { FlyRequestConfig } from 'flyio'
import ApiUri from './api'
import { Throttle } from '../utils/index'
import { message } from 'ant-design-vue'
import router from '../router/index'
import store from '../store/app'

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

interface FlyRequestProps extends FlyRequestConfig {
  params?: IParams
}

//添加请求拦截器
Fly.interceptors.request.use((config: FlyRequestProps) => {
  config.baseURL = process.env.NODE_ENV === 'production' ? '' : ''
  // 处理参数,针对于绑定id的路由
  if (config.body && Array.isArray(config.body.bindVars)) {
    config.body.bindVars.forEach((item: IBindVars) => {
      if (!!config.url) {
        config.url = config.url.replace(`:${item.key}`, `${item.value}`)
      }
    })
    delete config.body.bindVars
  }
  config.headers['Content-Type'] = 'application/json'
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  config.headers['Authorization'] = sessionStorage.getItem('token') || ''
  config.timeout = 30000
  // 判断是否需要展示加载组件
  if (config.body._showLoading) {
    config.headers['_showLoading'] = true
    delete config.body._showLoading
    store().updateGlobalLoading(true)
  }
  return config
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
Fly.interceptors.response.use(
  (response: any) => {
    // 判断当前请求是否是需要显示加载组件，如果是就取消
    if (response.request.headers._showLoading) {
      store().updateGlobalLoading(false)
    }
    let { data, status } = response
    if (status >= 200 && status < 300 && data.code === 0) {
      return data.data
    } else {
      message.error(data.msg || '系统错误！')
      return new Promise((response, reject) => {
        reject(response)
      })
    }
  },
  (error: any) => {
    // 判断当前请求是否是需要显示加载组件，如果是就取消
    if (error.request.headers._showLoading) {
      store().updateGlobalLoading(false)
    }
    let errDescription = '服务异常，请重试！'
    switch (error.status) {
      case 400:
        errDescription = error?.data?.detail || '参数错误！'
        break
      case 401:
        errDescription = '授权失败'
        break
      case 404:
        errDescription = '资源未找到！'
        break
      case 500:
        errDescription = '服务异常，请重试！'
        break
      default:
        errDescription = '服务异常，请重试！'
    }
    new Throttle_(() => {
      message.error(errDescription)
    }, 300)
    // token失效，鉴权失败
    if (error.status === 401) {
      sessionStorage.clear()
      router.push({ name: 'login' })
      return
    }
    return new Promise((response, reject) => {
      reject(error)
    })
    //发生网络错误后会走到这里
    //promise.resolve("ssss")
  }
)

let newApiUri: any = ApiUri
const Fetch = (params: IParams) => {
  // 当前api对象
  const uriObj = newApiUri[params[`uriCode`]]
  // 请求的url
  let uri = uriObj.restful ? uriObj.uri + '/' + params['id'] : uriObj.uri
  // 请求的方法类型
  let method_: 'get' | 'post' | 'patch' | 'delete' | 'put'
  if (!uriObj.method) {
    method_ = 'get'
  } else {
    method_ = uriObj.method
  }
  // 获取传给后端的参数
  let param = JSON.parse(JSON.stringify(params))
  delete param[`uriCode`]
  delete param.method
  if (uriObj.restful) {
    delete param.id
  }
  // 把是否展示加载组件添加到请求的参数里面，方便判断
  if (uriObj.showLoading) {
    param._showLoading = true
  }
  const _fly: any = Fly
  return _fly[method_](uri, param)
}

export default Fetch
