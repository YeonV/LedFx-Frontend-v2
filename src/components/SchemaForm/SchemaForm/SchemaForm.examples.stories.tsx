import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
import fixture from '../schemas.fixture.json'
import BladeSchemaForm from './SchemaForm'
import { withStore } from './storySeed'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'UI Components/SchemaForm/Examples',
  component: BladeSchemaForm,
  argTypes: {
    type: {
      control: false
    }
  },
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  },
  decorators: [
    (Story) => (
      <Card style={{ maxWidth: 800 }}>
        <CardContent>{Story()}</CardContent>
      </Card>
    )
  ]
} as Meta<typeof BladeSchemaForm>

const Template: StoryFn<typeof BladeSchemaForm> = (args) => <BladeSchemaForm {...args} />

export const AddDeviceAdaLight = Template.bind({})
AddDeviceAdaLight.args = {
  schema: {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Friendly name for the device'
      },
      icon_name: {
        type: 'string',
        title: 'Icon Name',
        description: 'https://mui.com/material-ui/material-icons/',
        default: 'mdi:led-strip'
      },
      center_offset: {
        type: 'integer',
        title: 'Center Offset',
        description: 'Number of pixels from the perceived center of the device',
        default: 0
      },
      refresh_rate: {
        type: 'int',
        enum: [10, 12, 16, 21, 32, 64],
        title: 'Refresh Rate',
        description: 'Target rate that pixels are sent to the device',
        default: 64
      },
      com_port: {
        type: 'string',
        enum: ['COM1'],
        title: 'Com Port',
        description: 'COM port for Adalight compatible device'
      },
      baudrate: {
        type: 'integer',
        minimum: 115200,
        title: 'Baudrate',
        description: 'baudrate',
        default: 500000
      },
      pixel_count: {
        type: 'integer',
        minimum: 1,
        title: 'Pixel Count',
        description: 'Number of individual pixels',
        default: 1
      },
      color_order: {
        type: 'string',
        enum: ['RGB', 'RBG', 'GRB', 'BRG', 'GBR', 'BGR'],
        title: 'Color Order',
        description: 'Color order',
        default: 'RGB'
      }
    },
    permitted_keys: [
      'name',
      'icon_name',
      'center_offset',
      'refresh_rate',
      'com_port',
      'baudrate',
      'pixel_count',
      'color_order'
    ],
    required: ['name', 'com_port', 'baudrate', 'pixel_count', 'color_order']
  },
  model: {},

  onModelChange: (e) => console.log(e),
  hideToggle: false
}

export const AddDeviceWLED = Template.bind({})
AddDeviceWLED.args = {
  schema: {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Friendly name for the device'
      },
      icon_name: {
        type: 'string',
        title: 'Icon Name',
        description: 'https://mui.com/material-ui/material-icons/',
        default: 'mdi:led-strip'
      },
      center_offset: {
        type: 'integer',
        title: 'Center Offset',
        description: 'Number of pixels from the perceived center of the device',
        default: 0
      },
      refresh_rate: {
        type: 'int',
        enum: [10, 12, 16, 21, 32, 64],
        title: 'Refresh Rate',
        description: 'Target rate that pixels are sent to the device',
        default: 64
      },
      ip_address: {
        type: 'string',
        title: 'Ip Address',
        description: 'Hostname or IP address of the device'
      },
      sync_mode: {
        type: 'string',
        enum: ['UDP', 'DDP', 'E131'],
        title: 'Sync Mode',
        description: 'Streaming protocol to WLED device. Recommended: UDP<480px, DDP>480px',
        default: 'UDP'
      },
      timeout: {
        type: 'integer',
        minimum: 0,
        maximum: 255,
        title: 'Timeout',
        description: 'Time between LedFx effect off and WLED effect activate',
        default: 1
      }
    },
    permitted_keys: [
      'name',
      'icon_name',
      'center_offset',
      'refresh_rate',
      'ip_address',
      'sync_mode',
      'timeout'
    ],
    required: ['name', 'ip_address']
  },
  model: {},

  onModelChange: (e) => console.log(e),
  hideToggle: false
}

export const AddDeviceUDP = Template.bind({})
AddDeviceUDP.args = {
  schema: {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Friendly name for the device'
      },
      icon_name: {
        type: 'string',
        title: 'Icon Name',
        description: 'https://mui.com/material-ui/material-icons/',
        default: 'mdi:led-strip'
      },
      center_offset: {
        type: 'integer',
        title: 'Center Offset',
        description: 'Number of pixels from the perceived center of the device',
        default: 0
      },
      refresh_rate: {
        type: 'int',
        enum: [10, 12, 16, 21, 32, 64],
        title: 'Refresh Rate',
        description: 'Target rate that pixels are sent to the device',
        default: 64
      },
      ip_address: {
        type: 'string',
        title: 'Ip Address',
        description: 'Hostname or IP address of the device'
      },
      pixel_count: {
        type: 'integer',
        minimum: 1,
        title: 'Pixel Count',
        description: 'Number of individual pixels',
        default: 1
      },
      port: {
        type: 'integer',
        minimum: 1,
        maximum: 65535,
        title: 'Port',
        description: 'Port for the UDP device',
        default: 21324
      },
      udp_packet_type: {
        type: 'string',
        enum: ['DRGB', 'WARLS', 'DRGBW', 'DNRGB', 'adaptive_smallest'],
        title: 'Udp Packet Type',
        description: 'RGB packet encoding',
        default: 'DRGB'
      },
      timeout: {
        type: 'integer',
        minimum: 1,
        maximum: 255,
        title: 'Timeout',
        description: 'Seconds to wait after the last received packet to yield device control',
        default: 1
      },
      minimise_traffic: {
        type: 'boolean',
        title: 'Minimise Traffic',
        description: 'Will not send updates if nothing has changed on the LED device',
        default: true
      }
    },
    permitted_keys: [
      'name',
      'icon_name',
      'center_offset',
      'refresh_rate',
      'ip_address',
      'pixel_count',
      'port',
      'udp_packet_type',
      'timeout',
      'minimise_traffic'
    ],
    required: ['name', 'ip_address', 'pixel_count', 'port', 'udp_packet_type']
  },
  model: {},

  onModelChange: (e) => console.log(e),
  hideToggle: false
}

export const AddVirtual = Template.bind({})
AddVirtual.args = {
  schema: {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Friendly name for the device'
      },
      mapping: {
        type: 'string',
        enum: ['span', 'copy'],
        title: 'Mapping',
        description: 'Span: Effect spans all segments. Copy: Effect copied on each segment',
        default: 'span'
      },
      icon_name: {
        type: 'string',
        title: 'Icon Name',
        description: 'Icon for the device*',
        default: 'mdi:led-strip-variant'
      },
      max_brightness: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        title: 'Max Brightness',
        description: 'Max brightness for the device',
        default: 1
      },
      center_offset: {
        type: 'integer',
        title: 'Center Offset',
        description: 'Number of pixels from the perceived center of the device',
        default: 0
      },
      preview_only: {
        type: 'boolean',
        title: 'Preview Only',
        description: 'Preview the pixels without updating the devices',
        default: false
      },
      transition_time: {
        type: 'number',
        minimum: 0,
        maximum: 5,
        title: 'Transition Time',
        description: 'Length of transition between effects',
        default: 0.4
      },
      transition_mode: {
        type: 'string',
        enum: [
          'Add',
          'Dissolve',
          'Push',
          'Slide',
          'Iris',
          'Through White',
          'Through Black',
          'None'
        ],
        title: 'Transition Mode',
        description: 'Type of transition between effects',
        default: 'Add'
      },
      frequency_min: {
        type: 'integer',
        minimum: 20,
        maximum: 15000,
        title: 'Frequency Min',
        description: 'Lowest frequency audio reactive effects of this virtual',
        default: 20
      },
      frequency_max: {
        type: 'integer',
        minimum: 20,
        maximum: 15000,
        title: 'Frequency Max',
        description: 'Highest frequency audio reactive effects of this virtual',
        default: 15000
      }
    },
    permitted_keys: [
      'name',
      'mapping',
      'icon_name',
      'max_brightness',
      'center_offset',
      'preview_only',
      'transition_time',
      'transition_mode',
      'frequency_min',
      'frequency_max'
    ],
    required: ['name', 'mapping']
  },
  model: {},

  onModelChange: (e) => console.log(e),
  hideToggle: false
}

// The schema holds no device list: the options come from the store (/api/audio/devices)
const audioProperties = {
  sample_rate: { type: 'integer', title: 'Sample Rate', default: 60, readOnly: true },
  min_volume: { type: 'number', minimum: 0, maximum: 10, title: 'Min Volume', default: 0.2 },
  audio_device: {
    anyOf: [{ type: 'integer' }, { type: 'null' }],
    'x-ledfx-enum-source': 'audio_devices',
    title: 'Audio Device',
    default: null
  }
}
const audioSchema = {
  properties: audioProperties,
  permitted_keys: Object.keys(audioProperties),
  required: []
}
const DEVICES = {
  0: 'MME: Microsoft Sound Mapper - Input',
  1: 'MME: Microphone (USB Audio)',
  2: 'Windows WASAPI: Speakers [Loopback]',
  3: 'Windows WASAPI: Microphone (USB Audio)',
  4: 'sendspin: Living room'
}

export const AudioCard = Template.bind({})
AudioCard.args = { schema: audioSchema, model: {}, onModelChange: (e) => console.log(e) }
AudioCard.decorators = [withStore({ audioDevices: DEVICES })]

export const AudioCardSelected = Template.bind({})
AudioCardSelected.args = { ...AudioCard.args, model: { audio_device: 2 } }
AudioCardSelected.decorators = AudioCard.decorators

// the store starts empty: the form fetches /api/audio/devices when it mounts
export const AudioCardFetched = Template.bind({})
AudioCardFetched.args = { ...AudioCard.args, model: { audio_device: 2 } }
AudioCardFetched.decorators = [
  withStore({
    audioDevices: {},
    routes: { '/api/audio/devices': { devices: DEVICES, active_device_index: 2 } }
  })
]

// zero devices: only the "System default" (null) option
export const AudioCardNoDevices = Template.bind({})
AudioCardNoDevices.args = AudioCard.args
AudioCardNoDevices.decorators = [withStore({ audioDevices: {} })]

// adalight's `com_port` is marked `com_ports`: the select lists the host's serial ports
export const AddDeviceAdaLightComPorts = Template.bind({})
AddDeviceAdaLightComPorts.args = {
  schema: fixture.devices.adalight.schema,
  type: 'adalight',
  model: { com_port: 'COM4' },
  hideToggle: true
}
AddDeviceAdaLightComPorts.decorators = [withStore({ comPorts: ['COM3', 'COM4', '/dev/ttyUSB0'] })]

// Real /api/schemas output (pydantic's native JSON Schema): a static enum select and the
// `refresh_rate` integer with `examples` as a marks slider.
export const FixtureEffectEnergy = Template.bind({})
FixtureEffectEnergy.args = {
  schema: fixture.effects.energy.schema,
  type: 'energy',
  model: {},
  hideToggle: true
}

export const FixtureDeviceWled = Template.bind({})
FixtureDeviceWled.args = {
  schema: fixture.devices.wled.schema,
  type: 'wled',
  model: {},
  hideToggle: true
}

// core's startup scene: an optional scene select, "None" clears it
export const StartupScene = Template.bind({})
StartupScene.args = {
  schema: {
    properties: { startup_scene_id: fixture.core.schema.properties.startup_scene_id },
    permitted_keys: ['startup_scene_id'],
    required: []
  },
  model: { startup_scene_id: 'chill' },
  hideToggle: true
}
StartupScene.decorators = [
  withStore({
    routes: { '/api/scenes': { scenes: { chill: { name: 'Chill' }, party: { name: 'Party' } } } }
  })
]
