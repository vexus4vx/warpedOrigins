import { create } from 'zustand'
import { AnimationMixer } from 'three'

export const useStore = create(() => ({
  groundObjects: {},
  actions: {},
  mixer: new AnimationMixer()
}))