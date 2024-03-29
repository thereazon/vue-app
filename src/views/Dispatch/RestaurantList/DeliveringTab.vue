<script setup>
import { Button } from 'vant'
import { onMounted, computed, defineProps, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlertModal } from '@/components/store/AlertModalStore'
import useDispatchInfo from '@/views/Dispatch/store'
import useRestaurant from '@/views/Restaurant/store'
import { RestaurantStatusTypeToZh, RestaurantStatusBackgroundColor } from '@/views/Dispatch/helper'
import RestaurantDetailTable from '@/components/RestaurantDetailTable.vue'
import useAccountInfo from '@/views/Login/store'

defineProps({
  openConfirmDialog: Function,
})

const route = useRoute()
const router = useRouter()
const modal = useAlertModal()
const dispatchStore = useDispatchInfo()
const restaurantStore = useRestaurant()
const { dispatch, getRestaurantDetailAction, postArrivalAction } = dispatchStore

const { handleLogout } = useAccountInfo()
const { car_id, container_id } = route.query

const currentRestaurant = computed(() => {
  const arrival = dispatchStore.restaurant?.ARRIVAL ? dispatchStore.restaurant.ARRIVAL : []
  const delivering = dispatchStore.restaurant?.DELIVERING ? dispatchStore.restaurant.DELIVERING : []
  const list = [...arrival, ...delivering].sort((a, b) => {
    const d1 = new Date(a.arrival_time)
    const d2 = new Date(b.arrival_time)
    return d1 - d2
  })
  return list[0]
})

onMounted(async () => {
  Promise.all([
    dispatchStore.getDispatchAction(car_id, container_id),
    dispatchStore.getPluginAction(car_id, container_id),
  ]).then((res) => {
    const [dispatchs, plugins] = res
    if (dispatchs.length === 0 && plugins.length === 0) {
      return handleLogout(() => router.push('/'))
    } else if (!currentRestaurant.value) {
      modal.open({
        type: 'hint', //required
        title: '提示',
        content: '沒有訂單需配送',
      })
    }
  })
})

watch(
  () => currentRestaurant.value,
  (newVal) => {
    if (!newVal) {
      modal.open({
        type: 'hint', //required
        title: '提示',
        content: '沒有訂單需配送',
      })
    }
  },
)

const handleRouteToDetail = (currentRestaurant) => {
  restaurantStore.setPreviewMode(false)
  getRestaurantDetailAction(currentRestaurant.id, (res) => {
    if (res.status === 2) {
      return router.push({
        path: '/restaurant/temperature',
        query: {
          ...route.query,
        },
      })
    } else {
      modal.open({
        type: 'error',
        title: '錯誤',
        content: '抵達餐廳後才能進行作業',
      })
    }
  })
}

const handlePreview = (currentRestaurant) => {
  restaurantStore.setPreviewMode(true)
  getRestaurantDetailAction(currentRestaurant.id, () =>
    router.push({
      path: '/restaurant/temperature',
      query: {
        ...route.query,
      },
    }),
  )
}

const handleArrival = () => {
  postArrivalAction(currentRestaurant.value.id)
}
</script>

<template>
  <div class="h-screen py-10" v-if="currentRestaurant">
    <RestaurantDetailTable
      :title="RestaurantStatusTypeToZh.DELIVERING"
      :dispatch="dispatch"
      :restaurant="currentRestaurant"
      :backgroundColor="RestaurantStatusBackgroundColor.DELIVERING"
      :handleRouteToDetail="() => handleRouteToDetail(currentRestaurant)"
    />
    <Button
      v-if="!currentRestaurant?.actual_arrival_time"
      round
      type="primary"
      class="w-full bg-warning border-none text-white px-[43px] mt-20"
      :onClick="handleArrival"
    >
      抵達餐廳
    </Button>
    <Button
      v-if="currentRestaurant?.actual_arrival_time"
      round
      type="primary"
      class="w-full bg-white border-none text-warning px-[43px] mt-20"
    >
      已抵達 {{ currentRestaurant?.actual_arrival_time }}</Button
    >
    <Button
      :onClick="() => handlePreview(currentRestaurant)"
      round
      type="primary"
      class="w-full bg-primary border-none text-white rounded-full px-[43px] mt-10"
    >
      預先查看作業明細
    </Button>
    <div
      :onClick="() => openConfirmDialog(currentRestaurant.id)"
      class="w-full text-center text-[#707070] mt-20 underline pointer"
    >
      無法配送
    </div>
  </div>
</template>

<style scoped></style>
