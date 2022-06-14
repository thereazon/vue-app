<script setup>
import { Step, Steps } from 'vant'
import { computed } from 'vue'
import { splitFullDateTimeAsDateAndTime } from '@/utils/date'
import { tempCode } from './helper'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  no: {
    type: String,
    required: true,
  },
  temp_zone: {
    type: String,
    required: true,
  },
  departure_time: {
    type: String,
    required: true,
  },
  cube: {
    type: Number,
    required: true,
  },
  store: {
    type: Array,
    required: true,
  },
})

const departureDt = computed(() => splitFullDateTimeAsDateAndTime(props.departure_time))
const tempZones = computed(() => props.temp_zone.split(','))
</script>

<template>
  <section class="rounded-[20px] max-w-5xl shadow-lg overflow-hidden bg-white">
    <!-- card header -->
    <div class="flex justify-around items-baseline pt-1 px-7">
      <p class="text-primary text-[13px] mb-2"><b class="font-bold">單號 </b>{{ props.no }}</p>
      <ul class="list-disc flex flex-nowrap mt-4 mb-2 list-inside justify-center font-bold text-[10px]">
        <li v-for="(temp, index) in tempZones" :key="index" :class="tempCode[temp].markerColor">
          <small class="relative -left-3 whitespace-nowrap" :class="tempCode[temp].color">
            {{ tempCode[temp].name }}
          </small>
        </li>
      </ul>
    </div>
    <!-- divide -->
    <div class="divide py-1"></div>
    <!-- info -->
    <div class="flex justify-around px-7 py-1 my-1">
      <div>
        <img src="dispatching_calendar.png" class="h-4 align-sub px-1" alt="calanderIcon" />
        <span class="bg-zinc-100 text-[13px] px-1 py-px text-neutral-500">{{ departureDt.date }}</span>
      </div>
      <div>
        <img src="dispatching_clock.png" class="h-4 align-sub px-1" alt="clockIcon" />
        <span class="bg-zinc-100 text-[13px] px-1 py-px text-neutral-500">{{ departureDt.time }}</span>
      </div>
      <div>
        <img src="dispatching_box.png" class="h-4 align-sub px-1" alt="boxIcon" />
        <span class="bg-zinc-100 text-[13px] px-1 py-px text-neutral-500">{{ props.cube }}</span>
      </div>
    </div>
    <!-- record -->
    <div class="bg-zinc-100 px-7">
      <Steps direction="vertical" :active="0" class="bg-zinc-100 mt-2">
        <Step v-for="st in props.store" :key="st.id">
          <div class="flex justify-start flex-nowrap space-x-2">
            <p class="my-0 py-px px-2 rounded-md bg-white text-neutral-500 w-1/12 text-center">{{ st.bu }}</p>
            <p class="my-0 py-px px-2 rounded-md bg-white text-neutral-500 w-4/12 text-center truncate">
              {{ st.number }}
            </p>
            <p class="my-0 py-px px-2 rounded-md bg-white text-neutral-500 w-4/12 text-center truncate">
              {{ st.name }}
            </p>
          </div>
        </Step>
      </Steps>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.divide {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(to right, #086eb6 0%, #086eb6 70%, transparent 50%);
  background-size: 30px 2px;
  background-repeat: repeat-x;
}

:deep(.van-step__circle-container) {
  @apply text-sm;
  .van-icon-checked:before,
  .van-step__circle {
    @apply content-[''] w-3 h-3 bg-primary rounded-xl;
  }
}

:deep(.van-step__line) {
  @apply w-1 -left-[17px] bg-primary top-0;

  &:last-child {
    @apply w-1;
  }
}
</style>