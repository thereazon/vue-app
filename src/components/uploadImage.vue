<script setup>
import { ref } from 'vue'
import { Popup } from 'vant'

const emit = defineEmits(['uploadImage', 'resetImageToNull'])
const props = defineProps({
  title: String,
  uploadToStore: Function,
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  defaultImage: {
    type: String,
    required: false,
    default: '',
  },
})

const previewImage = ref(props.defaultImage)
const camera = ref(null)
const imageFile = ref(null)
const showImage = ref(false)

const clickUpload = () => {
  if (previewImage.value === '') {
    camera.value.click()
  } else {
    showImage.value = true
  }
}
const uploadImage = (e) => {
  const reader = new FileReader()
  let file = e.target.files[0]
  imageFile.value = file
  props.uploadToStore(file)
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    previewImage.value = e.target.result
    emit('uploadImage', e.target.result)
  }
}

const deletePreviewImage = () => {
  if (!props.disabled) {
    props.uploadToStore(null)
    previewImage.value = ''
    emit('resetImageToNull')
  }
}
</script>

<template>
  <div class="w-full mb-6">
    <div class="mt-8 mb-[15px] text-[#959595] flex items-center justify-center relative">
      <div class="text-center text-[0.8125rem] font-bold">{{ title }}</div>
      <div
        class="w-[16%] absolute top-0 right-0 text-center text-[#eb5e55] text-[0.75rem] border border-1 border-solid border-[#eb5e55] rounded-full"
        disabled="props.disabled"
        @click="deletePreviewImage()"
      >
        清除
      </div>
    </div>
    <input
      :disabled="props.disabled"
      hidden
      type="file"
      accept="image/*"
      capture="camera"
      ref="camera"
      @change="uploadImage"
    />
    <div class="divide flex justify-center w-full h-28 border-1 border-solid border-transparent" @click="clickUpload()">
      <van-icon color="#959595" v-if="previewImage === ''" class="absolute" size="7rem" name="plus" />
      <div class="w-full h-full" v-if="previewImage === ''"></div>
      <img v-else class="h-full" :src="previewImage" />
    </div>

    <Popup v-model:show="showImage">
      <img class="w-full h-full" :src="previewImage" />
    </Popup>
  </div>
</template>

<style scoped>
.divide {
  background: linear-gradient(#fffcf6, #fffcf6) padding-box,
    repeating-linear-gradient(-45deg, #707070 0, #707070 0.6rem, #fffcf6 0, #fffcf6 1rem);
}
:deep(.van-popup) {
  width: 90%;
  border-radius: 10px;
}
</style>
