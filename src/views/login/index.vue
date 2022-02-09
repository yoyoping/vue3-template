<template>
  <div class="font-bold">login: {{ fullName }} {{ age }} {{ gender }}</div>
  <a-button @click="setUser">修改</a-button>
  <a-button @click="login" type="primary">登录</a-button>
</template>
<script lang="ts" setup>
import appStore from '../../store/app'
import { storeToRefs } from 'pinia'
import { sha256 } from 'js-sha256'
import Fetch from '../../fetch'

const store = appStore()
const { fullName, age, gender } = storeToRefs(store)

const setUser = () => {
  store.updateName('王五')
}

const login = async () => {
  const params = {
    uriCode: 'API001',
    type: 3,
    account: 's001',
    password: sha256('888888')
  }
  const res = await Fetch(params)
  sessionStorage.setItem('token', res.token)
  getUserinfo()
}

const getUserinfo = async () => {
  const params = {
    uriCode: 'API002',
  }
  const res = await Fetch(params)
  console.log(res)
}
</script>
<style lang="scss" scoped></style>
