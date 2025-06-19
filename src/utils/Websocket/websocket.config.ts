// websocket.config.ts

/**
 * This file contains the configuration for the WebSocket connection.
 * It defines which events to subscribe to on connection and how to process
 * the incoming messages before dispatching them to the application.
 */

// A centralized list of all events to subscribe to when the WebSocket connects.
export const initialSubscriptions = [
  { event_type: 'devices_updated', id: 9002 },
  { event_type: 'device_created', id: 9001 },
  { event_type: 'scene_activated', id: 9003 },
  { event_type: 'effect_set', id: 9004 },
  { event_type: 'client_connected', id: 9005 },
  { event_type: 'client_disconnected', id: 9006 },
  { event_type: 'client_sync', id: 9007 }
]

// A declarative "recipe" for how to handle incoming events.
// This is used to build the final message handler map.
export const handlerConfig = {
  // Rule: The value is a function that transforms `data` into the `detail` payload.
  visualisation_update: (data: any) => ({
    id: data.vis_id,
    pixels: data.pixels,
    shape: data.shape,
    ...(data.rid && { rid: data.id }),
    ...(data.timestamp && { timestamp: data.timestamp })
  }),
  // Rule: The value is static and will be used as the `detail` payload.
  devices_updated: 'devices_updated',
  device_created: (data: any) => ({
    id: 'device_created',
    device_name: data.device_name
  }),
  scene_activated: (data: any) => ({
    id: 'scene_activated',
    scene_id: data.scene_id
  }),
  virtual_diag: (data: any) => ({ data }),

  // Rule: `true` means pass the entire `data` object as the `detail` payload.
  graph_update: true,
  effect_set: true
}
