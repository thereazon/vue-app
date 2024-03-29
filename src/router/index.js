import { createRouter, createWebHashHistory } from 'vue-router'
import useAccountInfo from '@/views/Login/store'
import Login from '@/views/Login/index.vue'
import Cars from '@/views/Cars/index.vue'
import Temperature from '@/views/Temperature/index.vue'
import Containers from '@/views/Containers/index.vue'
import Dispatch from '@/views/Dispatch/index.vue'
import RestaurantList from '@/views/Dispatch/RestaurantList/index.vue'
import Main from '@/views/Main/index.vue'
import EntryRecord from '@/views/EntryRecord/index.vue'
import Pallet from '@/views/Pallet/index.vue'
import PreCool from '@/views/PreCool/index.vue'
import Sign from '@/views/PreCool/sign.vue'
import Setting from '@/views/Setting/index.vue'
import Plugin from '@/views/Dispatch/Plugin/index.vue'
import RestaurantTemperature from '@/views/Restaurant/Temperature.vue'
import RestaurantContainer from '@/views/Restaurant/Container.vue'
import RestaurantSignature from '@/views/Restaurant/Signature.vue'
import RestaurantDelivery from '@/views/Restaurant/Delivery.vue'
import RestaurantOsnd from '@/views/Restaurant/Osnd.vue'
import RestaurantReturn from '@/views/Restaurant/Return.vue'
import RestaurantReturnDetail from '@/views/Restaurant/ReturnDetail.vue'
import RestaurantOnkAbnormal from '@/views/Restaurant/onkAbnormal.vue'
import RestaurantExceptionRegistration from '@/views/Restaurant/ExceptionRegistration.vue'
import RestaurantExceptionRegistrationEdit from '@/views/Restaurant/ExceptionRegistrationEdit.vue'
import OnKAbnormal from '@/views/Restaurant/OnKAbnormal.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Login',
      path: '/',
      component: Login,
    },
    {
      path: '/cars',
      component: Cars,
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: 'temperature',
          component: Temperature,
          alias: '/temperature',
        },
        {
          name: 'Dispatch',
          path: 'dispatch',
          component: Dispatch,
          alias: '/dispatch',
        },
        {
          path: 'setting',
          component: Setting,
          alias: '/setting',
        },
      ],
    },
    {
      path: '/containers',
      component: Containers,
    },
    {
      path: '/entryRecord',
      component: EntryRecord,
    },
    {
      path: '/pallet',
      component: Pallet,
    },
    {
      path: '/plugin',
      component: Plugin,
    },
    {
      path: '/restaurantlist',
      component: RestaurantList,
    },
    {
      path: '/precool',
      component: PreCool,
    },
    {
      path: '/precool/sign',
      component: Sign,
    },
    {
      path: '/restaurant/temperature',
      component: RestaurantTemperature,
    },
    {
      path: '/restaurant/container',
      component: RestaurantContainer,
    },
    {
      path: '/restaurant/ExceptionRegistration',
      component: RestaurantExceptionRegistration,
    },
    {
      path: '/restaurant/ExceptionRegistrationEdit',
      component: RestaurantExceptionRegistrationEdit,
    },
    {
      path: '/restaurant/signature',
      component: RestaurantSignature,
    },
    {
      path: '/restaurant/delivery',
      component: RestaurantDelivery,
    },
    {
      path: '/restaurant/osnd',
      component: RestaurantOsnd,
    },
    {
      path: '/restaurant/returned',
      component: RestaurantReturn,
    },
    {
      path: '/restaurant/returned/detail',
      component: RestaurantReturnDetail,
    },
    {
      path: '/restaurant/onkabnormal',
      component: OnKAbnormal,
    },
    {
      path: '/restaurant/abnormal',
      component: RestaurantOnkAbnormal,
    },
  ],
})

router.beforeEach(async (to, from) => {
  const accountStore = useAccountInfo()
  const isAccountStored = !!accountStore.account

  if (!isAccountStored) {
    if (to.name === 'Login') return true

    return { name: 'Login' }
  }

  if (to.name === 'Login') {
    return { name: 'Dispatch' }
  }
})

export default router
