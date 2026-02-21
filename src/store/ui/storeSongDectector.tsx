import { produce } from 'immer'

interface SongDetectorTrigger {
  id: string
  songName: string
  songHash: string
  duration: number
  position: number
  sceneId: string
  createdAt: number
}

const STORAGE_KEY = 'songDetector_triggers'

// Load triggers from localStorage
const loadTriggers = (): SongDetectorTrigger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load song detector triggers:', e)
    return []
  }
}

// Save triggers to localStorage
const saveTriggers = (triggers: SongDetectorTrigger[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers))
  } catch (e) {
    console.error('Failed to save song detector triggers:', e)
  }
}

// Simple hash function for song matching (normalized name + rounded duration)
export const generateSongHash = (songName: string, duration: number): string => {
  const normalized = songName.toLowerCase().trim()
  const roundedDuration = Math.round(duration)
  const str = `${normalized}:${roundedDuration}`
  // Simple hash using string charCodeAt
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

const storeSongDectector = (set: any) => ({
  song: '',
  thumbnailPath: '',
  albumArtCacheBuster: 0,
  // Position tracking (from song-detector-plus)
  position: null as number | null,
  duration: null as number | null,
  playing: false,
  timestamp: null as number | null,
  setSong: (url: string) => {
    set(
      produce((state: any) => {
        state.song = url
      }),
      false,
      'songDetector/setSong'
    )
  },
  setThumbnailPath: (path: string) => {
    set(
      produce((state: any) => {
        state.thumbnailPath = path
      }),
      false,
      'songDetector/setThumbnailPath'
    )
  },
  incrementAlbumArtCache: () => {
    set(
      produce((state: any) => {
        state.albumArtCacheBuster += 1
      }),
      false,
      'songDetector/incrementAlbumArtCache'
    )
  },
  setPositionData: (data: {
    position: number | null
    duration: number | null
    playing: boolean
    timestamp: number | null
  }) => {
    set(
      produce((state: any) => {
        state.position = data.position
        state.duration = data.duration
        state.playing = data.playing
        state.timestamp = data.timestamp
      }),
      false,
      'songDetector/setPositionData'
    )
  },
  // Text auto-apply state
  textAutoApply: false,
  textVirtuals: [] as string[],
  textVisualisers: [] as string[],
  isActiveVisualisers: false,
  setIsActiveVisualisers: (active: boolean) => {
    set(
      produce((state: any) => {
        state.isActiveVisualisers = active
      }),
      false,
      'songDetector/setIsActiveVisualisers'
    )
  },
  setTextAutoApply: (active: boolean) => {
    set(
      produce((state: any) => {
        state.textAutoApply = active
      }),
      false,
      'songDetector/setTextAutoApply'
    )
  },
  setTextVirtuals: (virtuals: string[]) => {
    set(
      produce((state: any) => {
        state.textVirtuals = virtuals
      }),
      false,
      'songDetector/setTextVirtuals'
    )
  },
  setTextVisualisers: (visualisers: string[]) => {
    set(
      produce((state: any) => {
        state.textVisualisers = visualisers
      }),
      false,
      'songDetector/setTextVisualisers'
    )
  },
  // Gradient auto-apply state
  gradientAutoApply: false,
  gradientVirtuals: [] as string[],
  selectedGradient: null as number | null,
  gradients: [] as string[],
  extractedColors: [] as string[],
  setGradientAutoApply: (active: boolean) => {
    set(
      produce((state: any) => {
        state.gradientAutoApply = active
      }),
      false,
      'songDetector/setGradientAutoApply'
    )
  },
  setGradientVirtuals: (virtuals: string[]) => {
    set(
      produce((state: any) => {
        state.gradientVirtuals = virtuals
      }),
      false,
      'songDetector/setGradientVirtuals'
    )
  },
  setSelectedGradient: (index: number | null) => {
    set(
      produce((state: any) => {
        state.selectedGradient = index
      }),
      false,
      'songDetector/setSelectedGradient'
    )
  },
  setGradients: (gradients: string[]) => {
    set(
      produce((state: any) => {
        state.gradients = gradients
      }),
      false,
      'songDetector/setGradients'
    )
  },
  setExtractedColors: (colors: string[]) => {
    set(
      produce((state: any) => {
        state.extractedColors = colors
      }),
      false,
      'songDetector/setExtractedColors'
    )
  },
  // Image auto-apply state
  imageAutoApply: false,
  imageVirtuals: [] as string[],
  imageConfig: {
    background_brightness: 1,
    background_color: '#000000',
    blur: 0,
    brightness: 1,
    clip: false,
    flip_horizontal: false,
    flip_vertical: false,
    min_size: 1
  },
  setImageAutoApply: (active: boolean) => {
    set(
      produce((state: any) => {
        state.imageAutoApply = active
      }),
      false,
      'songDetector/setImageAutoApply'
    )
  },
  setImageVirtuals: (virtuals: string[]) => {
    set(
      produce((state: any) => {
        state.imageVirtuals = virtuals
      }),
      false,
      'songDetector/setImageVirtuals'
    )
  },
  setImageConfig: (config: any) => {
    set(
      produce((state: any) => {
        state.imageConfig = config
      }),
      false,
      'songDetector/setImageConfig'
    )
  },
  // Scene triggers
  triggers: loadTriggers() as SongDetectorTrigger[],
  sceneTriggerActive: false,
  triggerLatencyMs: 0,
  setSceneTriggerActive: (active: boolean) => {
    set(
      produce((state: any) => {
        state.sceneTriggerActive = active
      }),
      false,
      'songDetector/setSceneTriggerActive'
    )
  },
  setTriggerLatencyMs: (latencyMs: number) => {
    set(
      produce((state: any) => {
        state.triggerLatencyMs = latencyMs
      }),
      false,
      'songDetector/setTriggerLatencyMs'
    )
  },
  addTrigger: (trigger: Omit<SongDetectorTrigger, 'id' | 'createdAt'>) => {
    set(
      produce((state: any) => {
        // Use position in ID to allow multiple triggers per song
        const positionMs = Math.round(trigger.position * 1000)
        const newTrigger: SongDetectorTrigger = {
          ...trigger,
          id: `${trigger.songHash}_${positionMs}`,
          createdAt: Date.now()
        }
        state.triggers.push(newTrigger)
        saveTriggers(state.triggers)
      }),
      false,
      'songDetector/addTrigger'
    )
  },
  updateTrigger: (id: string, changes: Partial<SongDetectorTrigger>) => {
    set(
      produce((state: any) => {
        const index = state.triggers.findIndex((t: SongDetectorTrigger) => t.id === id)
        if (index !== -1) {
          state.triggers[index] = { ...state.triggers[index], ...changes }
          saveTriggers(state.triggers)
        }
      }),
      false,
      'songDetector/updateTrigger'
    )
  },
  deleteTrigger: (id: string) => {
    set(
      produce((state: any) => {
        state.triggers = state.triggers.filter((t: SongDetectorTrigger) => t.id !== id)
        saveTriggers(state.triggers)
      }),
      false,
      'songDetector/deleteTrigger'
    )
  }
})

export default storeSongDectector
