import { defineStore } from 'pinia'
import { StatusType, StorageKeys } from '@/views/Login/helper'
import { login, postSecurityCode } from '@/views/Login/service'
import { getItem, setItem, removeItem } from '@/utils/storage.js'

// const mockAccount = {
//   id: 'DM605b050589e38',
//   fleet: '夏暉車隊',
//   fleet_id: 'FM5fdc96995092e', //車隊id
//   name: '威寶456',
//   number: '456',
//   car_id: '',
//   container_id: '',
//   dc: [
//     { code: 'NDC', tel: '(03)322-3550' },
//     { code: 'CDC', tel: '(04)894-1868' },
//     { code: 'VDC', tel: '' },
//   ],
// }

const useAccountInfo = defineStore('account', {
  state: () => ({
    account: getItem(StorageKeys.ACCOUNT),
    status: StatusType.INIT,
    isLoading: false,
    error: {
      times: 0,
      message: '',
      seconds: 0,
    },
  }),
  actions: {
    async handleLogin(account, password) {
      this.isLoading = true
      try {
        const response = await login(account, password)
        if (response.status === 'success') {
          this.account = response.data
          this.status = StatusType.LOGIN_SUCCESS
          this.error = {
            times: 0,
            message: '',
            seconds: 0,
          }
          setItem(StorageKeys.ACCOUNT, this.account)
        }
      } catch (err) {
        this.status = StatusType.LOGIN_FAIL
        this.error = {
          message: err.message,
          times: err.times,
          seconds: err.seconds,
        }
      } finally {
        this.isLoading = false
      }
    },
    async handlePostSecurityCode(securityCode) {
      this.isLoading = true
      try {
        const response = await postSecurityCode(securityCode)
        if (response.status === 'success') {
          this.account = response.data
          this.status = StatusType.CODE_SUCCESS
          this.error = {
            times: 0,
            message: '',
            seconds: 0,
          }
        }
      } catch (err) {
        this.status = StatusType.CODE_FAIL
        this.error = {
          message: err.message,
          times: err.times,
          seconds: err.seconds,
        }
      } finally {
        this.isLoading = false
      }
    },
    handleLogout() {
      this.isLoading = true
      this.account = null
      this.status = StatusType.INIT
      removeItem(StorageKeys.ACCOUNT)
      this.isLoading = false
    },
  },
})

export default useAccountInfo
