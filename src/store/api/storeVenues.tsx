import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import useStore from '../useStore'

export interface ColorPad {
  color?: string
  gradient?: string
}

export interface VenueColorPads {
  rows: number
  cols: number
  pads: ColorPad[]
}

export interface Venue {
  id: string
  name: string
  virtual_ids: string[]
  color_pads: VenueColorPads
  /** True if this venue is currently paused for DMX Input processing. */
  paused?: boolean
  /** True if a DMX Input mapping currently targets this venue (or one of its virtuals). */
  dmx_mapped?: boolean
}

const storeVenues = (set: any) => ({
  venues: {} as Record<string, Venue>,
  activeVenueId: null as string | null,
  activeOverridePadIndex: null as number | null,

  setActiveVenueId: (id: string | null) =>
    set(
      produce((s: IStore) => {
        s.activeVenueId = id
        s.activeOverridePadIndex = null
      }),
      false,
      'venues/setActiveVenueId'
    ),

  setActiveOverridePadIndex: (index: number | null) =>
    set(
      produce((s: IStore) => {
        s.activeOverridePadIndex = index
      }),
      false,
      'venues/setActiveOverridePadIndex'
    ),

  getVenues: async () => {
    const resp = await Ledfx('/api/venues')
    if (resp && resp.venues) {
      const byId: Record<string, Venue> = {}
      for (const v of resp.venues) {
        byId[v.id] = v
      }
      set(
        produce((s: IStore) => {
          s.venues = byId
        }),
        false,
        'venues/gotVenues'
      )
      return byId
    }
    return null
  },

  createVenue: async (name: string, rows = 4, cols = 4) => {
    const resp = await Ledfx('/api/venues', 'POST', { name, rows, cols })
    const venue = resp?.data?.venue
    if (venue) {
      set(
        produce((s: IStore) => {
          s.venues[venue.id] = venue
        }),
        false,
        'venues/created'
      )
      return venue as Venue
    }
    return null
  },

  updateVenue: async (venueId: string, data: Partial<Pick<Venue, 'name' | 'color_pads'>>) => {
    const resp = await Ledfx(`/api/venues/${venueId}`, 'PUT', data)
    const venue = resp?.data?.venue
    if (venue) {
      set(
        produce((s: IStore) => {
          s.venues[venueId] = venue
        }),
        false,
        'venues/updated'
      )
      return venue as Venue
    }
    return null
  },

  deleteVenue: async (venueId: string) => {
    const resp = await Ledfx(`/api/venues/${venueId}`, 'DELETE')
    if (resp) {
      set(
        produce((s: IStore) => {
          delete s.venues[venueId]
          if (s.activeVenueId === venueId) {
            s.activeVenueId = null
            s.activeOverridePadIndex = null
          }
        }),
        false,
        'venues/deleted'
      )
      return true
    }
    return false
  },

  addVirtualToVenue: async (venueId: string, virtualId: string) => {
    const resp = await Ledfx(`/api/venues/${venueId}`, 'PUT', {
      action: 'add_virtual',
      virtual_id: virtualId
    })
    const venue = resp?.data?.venue
    if (venue) {
      set(
        produce((s: IStore) => {
          s.venues[venueId] = venue
        }),
        false,
        'venues/addedVirtual'
      )
      return venue as Venue
    }
    return null
  },

  removeVirtualFromVenue: async (venueId: string, virtualId: string) => {
    const resp = await Ledfx(`/api/venues/${venueId}`, 'PUT', {
      action: 'remove_virtual',
      virtual_id: virtualId
    })
    const venue = resp?.data?.venue
    if (venue) {
      set(
        produce((s: IStore) => {
          s.venues[venueId] = venue
        }),
        false,
        'venues/removedVirtual'
      )
      return venue as Venue
    }
    return null
  },

  activateVenueOverride: async (venueId: string, padIndex: number) => {
    const resp = await Ledfx(`/api/venues/${venueId}/override`, 'POST', {
      pad_index: padIndex
    })
    if (resp) {
      set(
        produce((s: IStore) => {
          s.activeVenueId = venueId
          s.activeOverridePadIndex = padIndex
        }),
        false,
        'venues/overrideActivated'
      )
      return true
    }
    return false
  },

  clearVenueOverride: async (venueId: string) => {
    const resp = await Ledfx(`/api/venues/${venueId}/override`, 'DELETE')
    if (resp) {
      set(
        produce((s: IStore) => {
          s.activeVenueId = null
          s.activeOverridePadIndex = null
        }),
        false,
        'venues/overrideCleared'
      )
      return true
    }
    return false
  },

  updateVenuePad: async (venueId: string, padIndex: number, pad: ColorPad) => {
    const currentVenue = useStore.getState().venues[venueId]
    if (!currentVenue) return null
    const updatedPads = [...currentVenue.color_pads.pads]
    updatedPads[padIndex] = pad
    const updatedColorPads = { ...currentVenue.color_pads, pads: updatedPads }
    const resp = await Ledfx(`/api/venues/${venueId}`, 'PUT', { color_pads: updatedColorPads })
    const venue = resp?.data?.venue
    if (venue) {
      set(
        produce((s: IStore) => {
          s.venues[venueId] = venue
        }),
        false,
        'venues/padUpdated'
      )
      return venue as Venue
    }
    return null
  },

  setVenuePause: async (venueId: string, paused: boolean) => {
    const resp = await Ledfx(`/api/venues/${venueId}/pause`, 'PUT', { paused })
    if (resp && resp.status === 'success') {
      set(
        produce((s: IStore) => {
          if (s.venues[venueId]) {
            s.venues[venueId].paused = paused
          }
        }),
        false,
        'venues/pauseSet'
      )
      return true
    }
    return false
  }
})

export default storeVenues
