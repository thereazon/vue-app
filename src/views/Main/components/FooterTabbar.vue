<script setup>
import { Tabbar, TabbarItem } from 'vant'
import { useRoute } from 'vue-router'

const route = useRoute()
const { car_id, container_id, car_number, container_number } = route.query

const temperature = {
  active: './images/footer/menu_temperature_icon2.png',
  inactive: './images/footer/menu_temperature_icon1.png',
}
const dispatching = {
  active: './images/footer/menu_dispatching_icon2.png',
  inactive: './images/footer/menu_dispatching_icon1.png',
}
const gear = {
  active: './images/footer/menu_gear_icon2.png',
  inactive: './images/footer/menu_gear_icon1.png',
}
</script>

<template>
  <div>
    <Tabbar route fixed active-color="#086eb6" inactive-color="#707070">
      <TabbarItem
        :to="{
          path: '/temperature',
          query: { car_id: car_id, container_id: container_id, car_number, container_number },
        }"
      >
        <span>即時溫度</span>
        <template #icon="props">
          <img :src="props.active ? temperature.active : temperature.inactive" />
        </template>
      </TabbarItem>

      <TabbarItem
        :to="{
          path: '/dispatch',
          query: { car_id: car_id, container_id: container_id, car_number, container_number },
        }"
      >
        <span>派工單</span>
        <template #icon="props">
          <img :src="props.active ? dispatching.active : dispatching.inactive" />
        </template>
      </TabbarItem>

      <TabbarItem to="/setting">
        <span>設定</span>
        <template #icon="props">
          <img :src="props.active ? gear.active : gear.inactive" />
        </template>
      </TabbarItem>
    </Tabbar>
  </div>
</template>

<style scoped>
:deep(.van-tabbar) {
  height: 78px;
}
:deep(.van-tabbar-item__icon) img {
  min-height: 36px;
}
:deep(.van-tabbar-item__text) {
  height: 12px;
  margin: 3.8px 0 0;
  font-family: SegoeUI;
  font-size: 9px;
}
</style>
