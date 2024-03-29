import axios from 'axios'
import { defineStore } from 'pinia'

const getAbnormalList = async () => {
  return await axios
    .get(`/api/info/abnormal`)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err.response.data))
}

const getUndeliverable = async () => {
  return await axios
    .get(`/api/info/undeliverable`)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err.response.data))
}

const useCommonStore = defineStore('common', {
  state: () => ({
    abnormalReasons: [],
    onkAbnormalReasons: [],
    undeliverableReasons: [],
    delayReasons: [],
    unableReasons: [],
    status: 'init',
    isLoading: false,
    message: '',
  }),
  actions: {
    // 取得所有 info data
    async getAllInfosAction() {
      try {
        this.isLoading = true
        const response = await Promise.all([getAbnormalList(), getUndeliverable()])
        const [abnormalReasons, undeliverableReasons] = response
        this.abnormalReasons = abnormalReasons.data
        this.onkAbnormalReasons = abnormalReasons.data.filter((e) => e.code == 'O' || e.code == 'K')
        this.undeliverableReasons = undeliverableReasons.data
        this.delayReasons = undeliverableReasons.data.filter((v) => v.type === 1)
        this.unableReasons = undeliverableReasons.data.filter((v) => v.type === 2)
      } catch (err) {
        this.status = err.status
        this.message = err.message
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useCommonStore
