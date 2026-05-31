export interface DmxMapping {
  name?: string
  type: 'trigger' | 'color' | 'fixture'
  universe: number
  channels: number[] | Record<string, number>
  venue_id?: string
  pad_index?: number
  virtual_id?: string
  on_threshold?: number
  off_threshold?: number
  active?: boolean
}

export interface DmxInputData {
  mappings: DmxMapping[]
  live_dmx: Record<string, number[]>
  venues: Record<string, any>
  virtuals: Record<string, string>
}

const storeDmxInput = () => ({
  // keyed by integration id
  dmxInput: {} as Record<string, DmxInputData>
})

export default storeDmxInput
