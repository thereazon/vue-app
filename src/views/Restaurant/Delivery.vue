<script setup>
import { ref, onMounted } from 'vue'
import { NavBar } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import useDispatchInfo from '@/views/Dispatch/store'
import useRestaurant from '@/views/Restaurant/store'
import RestaurantMenuPopup from './components/RestaurantMenuPopup.vue'
import RestaurantInfoCard from '@/components/RestaurantInfoCard.vue'

const { dispatch, currentRestaurant } = useDispatchInfo()
const { getDeliveryAction } = useRestaurant()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (!dispatch || !currentRestaurant) {
    router.push({
      path: '/dispatch',
      query: {
        ...route.query,
      },
    })
  } else {
    getDeliveryAction(currentRestaurant.id)
  }
})

const isShowMenu = ref(false)

const onClickLeft = () => {
  router.push({
    path: '/restaurantlist',
    query: {
      ...route.query,
    },
  })
}

const onClickRight = () => {
  isShowMenu.value = true
}
</script>

<template>
  <div class="bg-[#F2F8FB] h-screen">
    <RestaurantMenuPopup v-model:isShow="isShowMenu" />
    <NavBar safe-area-inset-top fixed left-arrow title="送貨單" @click-left="onClickLeft" @click-right="onClickRight"
      ><template #right> <van-icon name="wap-nav" size="14" color="black" /> </template>
    </NavBar>
    <div class="px-[26px] bg-[#F2F8FB] pt-20">
      <RestaurantInfoCard
        v-if="dispatch"
        :temp_zone="dispatch.temp_zone"
        :no="dispatch.no"
        :restaurant="currentRestaurant"
      />
    </div>
  </div>
</template>

<style scoped>
/* :deep(.van-icon-arrow-left) {
  color: gray;
}
:deep(.van-nav-bar__title) {
  font-size: 12px;
  color: #707070;
} */
</style>
