import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import useStore from '../useStore'
import { GetScenesApiResponse, StoredSceneConfig } from '../../api/ledfx.types'

export interface ISceneOrder {
  sceneId: string
  order: number
}

const storeScenes = (set: any) => ({
  scenes: {} as Record<string, StoredSceneConfig>,
  mostUsedScenes: {} as any,
  recentScenes: [] as string[],
  count: {} as any,
  scenePL: [] as any,
  sceneUseIntervals: false,
  scenePLintervals: [0],
  scenePLplay: false,
  scenePLrepeat: false,
  scenePLactiveIndex: -1,
  scenePLinterval: 2,
  sceneOrder: [] as ISceneOrder[],
  setSceneOrder: (order: ISceneOrder[]) => {
    set(
      produce((s: IStore) => {
        s.sceneOrder = order
      }),
      false,
      'setSceneOrder'
    )
  },
  setSceneOrderUp: (sceneId: string) => {
    let target = null
    const sceneOrder = useStore.getState().sceneOrder
    const current = sceneOrder.find((s: ISceneOrder) => s.sceneId === sceneId) || null
    if (!current || current.order < 1) return
    target = sceneOrder.find((s: ISceneOrder) => s.order === current?.order - 1) || null
    if (!target) return
    // console.log('Move up', sceneId, current, target)

    const newSceneOrder = sceneOrder.map((o: ISceneOrder) => {
      if (o.sceneId === sceneId) {
        return { ...o, order: target.order }
      }
      if (o.sceneId === target.sceneId) {
        return { ...o, order: current.order }
      }
      return o
    })

    // console.log('changing from ', sceneOrder, 'to',  newSceneOrder)
    set(
      produce((s: IStore) => {
        s.sceneOrder = newSceneOrder
      }),
      false,
      'setSceneOrderUp'
    )
  },
  setSceneOrderDown: (sceneId: string) => {
    let target = null
    const sceneOrder = useStore.getState().sceneOrder
    const current = sceneOrder.find((s: ISceneOrder) => s.sceneId === sceneId) || null
    if (!current || current.order >= sceneOrder.length - 1) return
    target = sceneOrder.find((s: ISceneOrder) => s.order === current?.order + 1) || null
    if (!target) return
    // console.log('Move down', sceneId, current, target)

    const newSceneOrder = sceneOrder.map((o: ISceneOrder) => {
      if (o.sceneId === sceneId) {
        return { ...o, order: target.order }
      }
      if (o.sceneId === target.sceneId) {
        return { ...o, order: current.order }
      }
      return o
    })

    // console.log('changing from ', sceneOrder, 'to',  newSceneOrder)
    set(
      produce((s: IStore) => {
        s.sceneOrder = newSceneOrder
      }),
      false,
      'setSceneOrderDown'
    )
  },
  toggleSceneUseIntervals: () => {
    set(
      produce((s: IStore) => {
        s.sceneUseIntervals = !s.sceneUseIntervals
      }),
      false,
      'toggleSceneUseIntervals'
    )
  },
  toggleScenePLplay: () => {
    set(
      produce((s: IStore) => {
        s.scenePLplay = !s.scenePLplay
      }),
      false,
      'toggleScenePLplay'
    )
  },
  toggleScenePLrepeat: () => {
    set(
      produce((s: IStore) => {
        s.scenePLrepeat = !s.scenePLrepeat
      }),
      false,
      'toggleScenePLrepeat'
    )
  },
  setScenePLinterval: (seconds: number) => {
    set(
      produce((s: IStore) => {
        s.scenePLinterval = seconds
      }),
      false,
      'setScenePLinterval'
    )
  },
  setScenePLintervals: (intervals: number[]) => {
    set(
      produce((s: IStore) => {
        s.scenePLintervals = intervals
      }),
      false,
      'setScenePlIntervals'
    )
  },
  setMostUsedScenes: (key: string, count: number) => {
    set(
      produce((s: IStore) => {
        s.mostUsedScenes[key] = {
          ...s.scenes[key],
          used: count
        }
      }),
      false,
      'setMostUsedScenes'
    )
  },
  clearMostUsedScenes: () => {
    set(
      produce((s: IStore) => {
        s.mostUsedScenes = {}
      }),
      false,
      'clearMostUsedScenes'
    )
  },
  setScenePL: (scenes: string[]) => {
    set(
      produce((s: IStore) => {
        s.scenePL = scenes
      }),
      false,
      'setScenePLactiveIndex'
    )
  },
  setScenePLactiveIndex: (index: number) => {
    set(
      produce((s: IStore) => {
        s.scenePLactiveIndex = index
      }),
      false,
      'setScenePLactiveIndex'
    )
  },
  addScene2PL: (sceneId: string) => {
    set(
      produce((s: IStore) => {
        s.scenePL = [...s.scenePL, sceneId]
      }),
      false,
      'addScene2PL'
    )
  },
  removeScene2PL: (id: number) => {
    set(
      produce((s: IStore) => {
        s.scenePL = s.scenePL.filter((p: string, i: number) => i !== id)
      }),
      false,
      'removeScene2PL'
    )
  },
  getScenes: async () => {
    const resp: GetScenesApiResponse = await Ledfx('/api/scenes')
    if (resp && resp.scenes) {
      set(
        produce((s: IStore) => {
          s.scenes = resp.scenes
        }),
        false,
        'gotScenes'
      )
      return resp.scenes
    }
    return null
  },
  getScene: async (id: string) => {
    const resp: any = await Ledfx('/api/scenes/' + id)
    if (resp && resp.scene) {
      return resp.scene
    }
    return null
  },
  addScene: async (
    name: string,
    scene_image?: string | null,
    scene_tags?: string | null,
    scene_puturl?: string | null,
    scene_payload?: string | null,
    scene_midiactivate?: string | null,
    virtuals?: Record<string, any>
  ) =>
    virtuals
      ? await Ledfx('/api/scenes', 'POST', {
          name,
          scene_image,
          scene_tags,
          scene_puturl,
          scene_payload,
          scene_midiactivate,
          virtuals
        })
      : await Ledfx('/api/scenes', 'POST', {
          name,
          scene_image,
          scene_tags,
          scene_puturl,
          scene_payload,
          scene_midiactivate
        }),
  overrideScene: async (id: string, name: string) =>
    await Ledfx('/api/scenes', 'POST', {
      id,
      name,
      snapshot: true
    }),
  updateScene: async (
    name: string,
    id: string,
    scene_image?: string | null,
    scene_tags?: string | null,
    scene_puturl?: string | null,
    scene_payload?: string | null,
    scene_midiactivate?: string | null,
    virtuals?: Record<string, any>
  ) =>
    virtuals
      ? await Ledfx('/api/scenes', 'POST', {
          name,
          id,
          scene_image,
          scene_tags,
          scene_puturl,
          scene_payload,
          scene_midiactivate,
          virtuals
        })
      : await Ledfx('/api/scenes', 'POST', {
          name,
          id,
          scene_image,
          scene_tags,
          scene_puturl,
          scene_payload,
          scene_midiactivate
        }),
  renameScene: async (name: string, id: string) =>
    await Ledfx('/api/scenes', 'PUT', {
      name,
      id,
      action: 'rename'
    }),
  activateScene: async (id: string) => {
    set(
      produce((s: IStore) => {
        s.recentScenes = s.recentScenes
          ? s.recentScenes.indexOf(id) > -1
            ? [id, ...s.recentScenes.filter((t: any) => t !== id)]
            : [id, ...s.recentScenes].slice(0, 5)
          : [id]
      }),
      false,
      'setScenes'
    )
    set(
      produce((s: IStore) => {
        s.count[id] = (s.count[id] || 0) + 1
      }),
      false,
      'setScenes'
    )
    return await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate'
    })
  },
  activateSceneIn: async (id: string, ms: number) =>
    await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate_in',
      ms
    }),
  deleteScene: async (name: string) =>
    await Ledfx(`/api/scenes/${name}`, 'DELETE', { data: { id: name } }),

  captivateScene: async (scene_puturl: string, scene_payload: string) =>
    await Ledfx(scene_puturl, 'PUT', JSON.parse(scene_payload))
})

export default storeScenes
