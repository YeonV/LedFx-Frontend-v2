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
  /** Fixture-wash only: probability (0-1) that a detected strobe pulse
   * actually renders instead of being forced black; 1 = every pulse
   * renders (today's default, no desync from real fixtures simulated). */
  strobe_probability?: number
  /** Frontend-only bookkeeping: remembers each mapping type's last-entered
   * field values (channels/thresholds/target/strobe settings) so switching
   * a mapping's type in the editor re-populates previous values instead of
   * resetting to schema defaults. Opaque to the backend, persisted as-is. */
  _type_field_cache?: Record<string, Record<string, unknown>>
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
