import { produce } from 'immer'

const storeSongDectector = (set: any) => ({
  song: '',
  setSong: (url: string) => {
    set(
      produce((state: any) => {
        state.song = url
      }),
      false,
      'songDetector/setSong'
    )
  }
})

export default storeSongDectector
