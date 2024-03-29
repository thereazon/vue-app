import { defineStore } from 'pinia'
import DispatchApiCaller from '@/views/Dispatch/service'
import {
  DispatchStatusNumberToType,
  restaurantByStatus,
  LockTempNumberToType,
  DispatchStatusType,
  PluginNumberToType,
  PluginStatusType,
} from '@/views/Dispatch/helper'
import { useAlertModal } from '@/components/store/AlertModalStore'
import useAccountInfo from '@/views/Login/store'

const useDispatchInfo = defineStore('dispatch', {
  state: () => ({
    dispatchs: null,
    dispatch: null, //current dispatch
    restaurant: null,
    status: 'init',
    isLoading: false,
    message: '',
    currentRestaurant: null,
    showUnableDeliverMenu: false,
    showDelayMenu: false,
    unableDeliverID: null,
    plugin: null,
    currentPlugin: null,
  }),
  actions: {
    setCurrentPlugin(plugin) {
      this.currentPlugin = plugin
    },
    updateCurrentRestaurantStatus(restaurant) {
      this.currentRestaurant = restaurant
    },
    closeUnableDeliverMenu() {
      this.showUnableDeliverMenu = false
      this.showDelayMenu = false
    },
    openUnableDeliverMenu(id, type) {
      this.unableDeliverID = id
      if (type === 'UNABLE') {
        this.showUnableDeliverMenu = type
      } else if (type === 'DELAY') {
        this.showDelayMenu = type
      }
    },
    async setCurrentRestaurant(restaurant) {
      const tempZones = restaurant.temp_zone.split(',')
      const isNormal = tempZones ? tempZones.find((v) => v === 'D') && tempZones.length === 1 : null
      this.currentRestaurant = { ...restaurant, isNormal }
    },
    async setCurrentDispatch(dispatch) {
      const tempZones = dispatch.temp_zone.split(',')
      const isNormal = tempZones ? tempZones.find((v) => v === 'D') && tempZones.length === 1 : null
      this.dispatch = {
        ...dispatch,
        isNormal,
      }
    },
    async getDispatchDetailAction(id, cb) {
      const modal = useAlertModal()
      this.isLoading = true
      try {
        const response = await DispatchApiCaller.getDispatchDetail(id)
        if (response.status === 'success') {
          this.restaurant = restaurantByStatus(response.data)
          cb && cb()
        }
      } catch (err) {
        modal.open({
          type: 'error',
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async getRestaurantDetailAction(id, cb) {
      const modal = useAlertModal()
      this.isLoading = true
      try {
        const response = await DispatchApiCaller.getRestaurantDetail(id)
        if (response.status === 'success') {
          this.currentRestaurant = {
            ...response.data,
            temperature_count: 1, //餐廳溫度數量寫死1
            is_temp: !!response.data.is_temp,
            is_container: !!response.data.is_container,
            is_returned: !!response.data.is_returned,
            is_finish: !!response.data.is_finish,
            is_signature: !!response.data.is_signature,
            lock_temp_type: LockTempNumberToType[response.data.lock_temp_type],
          }
          this.status = response.status
          cb(response.data)
        }
      } catch (err) {
        modal.open({
          type: 'error',
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async getPluginAction(car_id, container_id) {
      const accountStore = useAccountInfo()
      this.isLoading = true
      try {
        const response = await DispatchApiCaller.getPlugin(
          accountStore.account.id,
          accountStore.account.fleet_id,
          car_id,
          container_id,
        )
        if (response.status === 'success') {
          this.plugin = response.data.map((v) => ({
            ...v,
            status: PluginNumberToType[v.status],
          }))
          return response.data
        }
      } catch (err) {
        this.status = err.status
        this.message = err.message
      } finally {
        this.isLoading = false
      }
    },
    async getDispatchAction(car_id, container_id) {
      const accountStore = useAccountInfo()
      this.isLoading = true
      try {
        const response = await DispatchApiCaller.getDispatch(
          accountStore.account.id,
          accountStore.account.fleet_id,
          car_id,
          container_id,
        )
        if (response.status === 'success') {
          this.dispatchs = response.data.map((v) => ({
            ...v,
            is_loading: Boolean(v.is_loading),
            status: DispatchStatusNumberToType[v.status],
          }))
          this.status = response.status
          return response.data
        }
      } catch (err) {
        this.status = err.status
        this.message = err.message
      } finally {
        this.isLoading = false
      }
    },
    async postUndeliveredAction(id) {
      this.isLoading = true
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postUndelivered(id)
        if (response.status === 'success') {
          await this.getDispatchDetailAction(this.dispatch.id)
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postCheckOut() {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postCheckOut(this.dispatch.id)
        if (response.status === 'success') {
          modal.open({
            type: 'success', //required
            title: '完成出車',
          })
          this.dispatch = {
            ...this.dispatch,
            status: DispatchStatusType.CHECK_OUT,
          }
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postBringAction(id, text) {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postBring(this.unableDeliverID, id, text)
        if (response.status === 'success') {
          await this.getDispatchDetailAction(this.dispatch.id)
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postArrivalAction(id) {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postArrival(id)
        if (response.status === 'success') {
          await this.getDispatchDetailAction(this.dispatch.id, () => null)
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postDelayAction(id, text) {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postDelayed(this.unableDeliverID, id, text)
        if (response.status === 'success') {
          await this.getDispatchDetailAction(this.dispatch.id, () => null)
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postPluginStartAction(id) {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postPluginStart(id)
        if (response.status === 'success') {
          modal.open({
            type: 'success', //required
            title: '開始配送成功',
          })
          this.plugin = this.plugin.map((v) => {
            if (v.id === id) {
              return {
                ...v,
                status: PluginStatusType.DELIVERING,
              }
            } else return v
          })
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postPluginArriveAction(id) {
      const modal = useAlertModal()
      try {
        const response = await DispatchApiCaller.postPluginArrive(id)
        if (response.status === 'success') {
          modal.open({
            type: 'success', //required
            title: '已抵達',
          })
          this.plugin = this.plugin.map((v) => {
            if (v.id === id) {
              return {
                ...v,
                status: PluginStatusType.ARRIVAL,
              }
            } else return v
          })
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
    async postPluginFinishAction(id, data, cb) {
      const modal = useAlertModal()
      const formData = new FormData()
      const driver_photo = await fetch(data.driver_photo).then((r) => r.blob())
      const customer_photo = await fetch(data.customer_photo).then((r) => r.blob())
      formData.append('driver_photo', driver_photo)
      if (data.customer_photo) {
        formData.append('customer_photo', customer_photo)
      }
      try {
        const response = await DispatchApiCaller.postPluginFinish(id, formData)
        if (response.status === 'success') {
          modal.open({
            type: 'success', //required
            title: '配送已完成',
            callback: cb,
          })
        }
      } catch (err) {
        modal.open({
          type: 'error', //required
          title: '錯誤',
          content: err.message,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useDispatchInfo
