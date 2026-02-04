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
  }
})

export default storeSongDectector
