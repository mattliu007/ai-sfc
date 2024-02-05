import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { SprintFestivalCouplets } from '~/packages/ai/src'

const ns = 'ai-sfc'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const prompt = useStorage(`${ns}:prompt`, '')

  const coupletsData = useStorage<SprintFestivalCouplets>(`${ns}:couplets-data`, {
    上联: '这里是上联',
    下联: '这里是下联',
    横批: '这里是横批',
    总结: '福',
  })

  const options = useStorage(`${ns}:options`, {
    /**
     * 是否翻转对联
     */
    inverseCouplets: false,
    /**
     * 是否反转福字
     */
    inverseFu: false,
  })

  const route = useRoute()
  onMounted(() => {
    if (route.query.couplets)
      coupletsData.value = JSON.parse(decodeURIComponent(route.query.couplets as string))
    if (route.query.prompt)
      prompt.value = decodeURIComponent(route.query.prompt as string)
  })

  return {
    loading,
    prompt,
    options,

    coupletsData,

    setCoupletsData(data: SprintFestivalCouplets) {
      coupletsData.value = data
    },
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
