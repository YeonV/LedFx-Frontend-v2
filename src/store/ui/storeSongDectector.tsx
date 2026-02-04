import { produce } from 'immer'

const storeSongDectector = (set: any) => ({
  song: '',
  thumbnailPath: '',
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
  // Text auto-apply state
  textAutoApply: false,
  textVirtuals: [] as string[],
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
  }
})

export default storeSongDectector
