import { defineStore } from 'pinia'

export default defineStore({
  id: 'appStore',
  state: () => {
    return {
      name: '张三',
      age: 18,
      gender: '男',
      globalLoading: false // 全局loading组件
    }
  },
  getters: {
    fullName: (state) => {
      return state.name + '丰'
    }
  },
  // 修改state都放在这里来，方便找到在哪里修改的，支持同步和异步
  actions: {
    // 修改姓名
    updateName (payload: string) {
      this.name = payload
    },
    // 修改全局加载状态
    updateGlobalLoading (payload: boolean) {
      this.globalLoading = payload
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['name', 'age']
      }
    ]
  }
})
