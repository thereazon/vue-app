<script setup>
import { ref, onMounted } from 'vue'
import { NavBar, Button } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import useDispatchInfo from '@/views/Dispatch/store'
import RestaurantSignInCard from '@/components/RestaurantSignInCard.vue'
import RestaurantMenuPopup from './components/RestaurantMenuPopup.vue'
import SignatureComponent from '@/components/SignatureComponent.vue'
const { dispatch, currentRestaurant } = useDispatchInfo()
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
    <NavBar safe-area-inset-top fixed left-arrow title="餐廳簽收" @click-left="onClickLeft" @click-right="onClickRight"
      ><template #right> <van-icon name="wap-nav" size="14" color="black" /> </template>
    </NavBar>
    <div class="px-[26px] bg-[#F2F8FB] pt-20">
      <RestaurantSignInCard
        v-if="dispatch"
        :departure_time="dispatch.departure_time"
        :no="dispatch.no"
        :restaurant="currentRestaurant"
      />
      <SignatureComponent title="司機簽名" />

      <Button class="w-full mt-7 text-white font-bold text-[1.0625rem] bg-success rounded-full"> 完成 </Button>
    </div>
  </div>
</template>

<style scoped></style>
