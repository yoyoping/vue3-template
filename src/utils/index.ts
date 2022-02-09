// 函数节流
export const Throttle = () => {
  let flags = true // 是否首次调用
  let timeout: any = null
  return function (func: Function, time: number) {
    let _fn = func // 保存需要被延迟的函数引用
    if (flags) {
      _fn()
      flags = false
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        // 延迟执行
        flags = true
      }, time)
    }
  }
}

/**
 *防抖函数
 *@param fn 事件触发的操作
 *@param delay 多少毫秒内连续触发事件，不会执行
 *@returns {Function}
 */
export function Debounce() {
  let timer: any = null
  return function (fn: Function, delay: number) {
    // @ts-ignore
    let self: any = this,
      args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(self, args)
    }, delay)
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time: any, cFormat?: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} '
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function parseTimeHms(time: any, cFormat?: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} '
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = `${formatObj.h < 10 ? '0' + formatObj.h : formatObj.h} : ${formatObj.i < 10 ? '0' + formatObj.m : formatObj.i} : ${
    formatObj.s < 10 ? '0' + formatObj.s : formatObj.s
  }`
  return time_str
}

//生成从minNum到maxNum的随机数
export function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return Math.floor(Math.random() * minNum + 1)
    case 2:
      return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
    default:
      return 0
  }
}

export class RandomUtil {
  static randomString(ranStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz', length: number) {
    var chars = ranStr.split('')
    var str = ''
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  }

  static getPrivateKey() {
    var str = RandomUtil.randomString(`0123456789abcdef`, 64)
    return str
  }
  static getPublicKey() {
    var head = Math.random() > 0.5 ? `02` : `03`
    var str = head + RandomUtil.randomString(`0123456789abcdef`, 64)
    return str
  }
  //0000000000000000000000000000000000
  static getAddressKey() {
    var head = `1`
    var str = head + RandomUtil.randomString(`123456789ABCDEFGHJKLMNPQRSTUVWXTZabcdefghikmnopqrstuvwxyz`, 33)
    return str
  }
  //0000000000000000000000000000000000000000000000000000000000000000
  static getLastHash() {
    var str = ``
    var ran = 2 //2个0
    for (var i = 0; i < ran; i++) {
      str += `0`
    }
    while (str.length < 64) {
      str += RandomUtil.randomString(`123456789abcdef`, 1)
    }
    return str
  }
  static getMokeergen() {
    var str = RandomUtil.randomString(`0123456789abcdef`, 64)
    return str
  }
  static getHash(zeroNum: number) {
    var str = ``
    var ran = zeroNum //zeroNum个0
    for (var i = 0; i < ran; i++) {
      str += `0`
    }
    while (str.length < 64) {
      str += RandomUtil.randomString(`123456789abcdef`, 1)
    }
    return str
  }
  static getCurrentHash() {
    var str = ``
    var ran = 2 //2个0
    for (var i = 0; i < ran; i++) {
      str += `0`
    }
    while (str.length < 64) {
      str += RandomUtil.randomString(`123456789abcdef`, 1)
    }
    return str
  }
  static getTradeHash() {
    var str = ``
    // var ran = 8;//8个0
    // for (var i = 0; i < ran; i++) {
    //  str += `0`;
    // }
    while (str.length < 64) {
      str += RandomUtil.randomString(`0123456789abcdef`, 1)
    }
    return str
  }
  static getSignData() {
    var num = 0
    var ran = Math.random()
    if (ran < 0.3) {
      num = 142
    } else if (ran < 0.6) {
      num = 144
    } else {
      num = 146
    }
    var str = RandomUtil.randomString(`0123456789abcdef`, num)
    return str
  }
  static getRanByList(list: any) {
    return list[Math.floor(Math.random() * list.length)]
  }
}

// 数字转汉字
export const sectionToChinese = (section: number) => {
  let originSection = section
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let chnUnitChar = ['', '十', '百', '千', '万', '亿', '万亿', '亿亿']
  let strIns = '',
    chnStr = ''
  let unitPos = 0
  let zero = true
  while (section > 0) {
    let v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  // 如果是‘一十三’就换成‘十三’
  if (originSection >= 10 && originSection < 20) {
    chnStr = chnStr.substr(1)
  }
  return chnStr
}
// 正整数
export const IsNumber = (rule: any, value: any, callback: any) => {
  const reg = /^[1-9][0-9]{0,}$/
  if (reg.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject('请输入正确数值')
  }
}

// 手机号
export const phone = (rule: any, value: any, callback: any) => {
  const reg = /^[1][2-9][0-9]{9}$/
  if (reg.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject('请输入正确值')
  }
}
// 字母和数字
export const numberAdd = (rule: any, value: any, callback: any) => {
  const reg = /^[0-9a-zA-Z]*$/g
  if (reg.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject('请输入数字或者字母')
  }
}
export const unique = (arr: any) => {
  const res = new Map()
  return arr.filter((arr: any) => !res.has(arr.title) && res.set(arr.title, 1))
}

// 获取数字
export const getQueryVariable = (variable: string, url: string = window.location.search) => {
  var query = url.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}

// 格式化oss返回的文件名
export const parseFileName = (str: string) => {
  const fileLib = sessionStorage.getItem('fileLib') || 'fileLib'
  let name = str.split(fileLib + '/').slice(-1)[0]
  name = decodeURIComponent(name.substring(13))
  return name
}

// 将秒转换成 1小时10分10秒的格式
export const changetime = (value: number) => {
  var secondTime: number = Math.floor(value) // 秒
  var minuteTime: any = 0 // 分
  var hourTime = 0 // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(secondTime / 60)
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(secondTime % 60)
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60)
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60)
    }
  }
  var time = Math.floor(secondTime) < 10 ? '0' + Math.floor(secondTime) + '秒' : '' + Math.floor(secondTime) + '秒'

  if (minuteTime > 0) {
    time = '' + Math.floor(minuteTime) + '分' + time
  }
  if (hourTime > 0) {
    time = '' + Math.floor(hourTime) + '小时' + time
  }
  return time
}

export const percentNum = (num: any, num2: any) => {
  return Math.round((num / num2) * 10000) / 100.0 //小数点后两位百分比
}

// 下载跨域地址的文件
export const downloadFile = async (url: string, filename: string) => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true) // 异步
  xhr.responseType = 'blob' // blob 类型
  xhr.onload = function () {
    if (xhr.status != 200) {
      alert('下载异常！')
      return
    }
    const navigator: any = window.navigator
    if (navigator.msSaveOrOpenBlob) {
      // IE
      navigator.msSaveBlob(xhr.response, filename)
    } else {
      var newUrl = window.URL.createObjectURL(xhr.response)
      var a = document.createElement('a')
      a.setAttribute('href', newUrl)
      a.setAttribute('target', '_blank')
      a.setAttribute('download', filename) // 自定义文件名（有效）
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
  xhr.send()
}
