// 集中管理请求地址，所有的接口地址：

/**
 * title: 接口描述
 * uri: 请求地址
 * method: 请求方式
 * showLoding: 此请求在请求中是否展示全局加载状态
 * const params = {
    uriCode: 'TEST01',
    // restful
    bindVars: [{
        key: "id",
        value: 'xxx',
    }, {
        key: "type",
        value: 'xxx'
    }]
  }
 */

// 公用的接口
const API = {
  API001: { title: '登录', uri: '/ctis/common/login', method: 'post', showLoading: true },
  API002: { title: '获取用户信息', uri: '/ctis/common/profile', showLoading: true },
}


export default {
  ...API
}
