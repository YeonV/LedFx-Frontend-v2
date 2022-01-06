export interface DeviceCardProps {
  /**
   * The Name of the device
   */
  yzName?: string;
  /**
   * IconName. Refer to `Icon`
   */
  yzIconName?: string;
  /**
   * Name of the current Effect
   */
  yzEffectName: string | undefined;
  /**
   * Flag if Effect is set
   */
  yzIsEffectSet?: boolean;
  /**
   * Play/Pause
   */
  isPlaying?: boolean;
  /**
   * Is streaming from other sources
   */
  yzIsStreaming?: boolean;
  /**
   * Do not send to leds
   */
  yzPreviewOnly?: boolean;
  /**
   * TransitionTime of the Device
   */
  yzTransitionTime?: number;
  /**
   * DeviceId if its a device, else undefined if its a virtual
   */
  yzIsDevice?: string | undefined;
  /**
   * Graphs active?
   */
  yzGraphs?: boolean;
  /**
   * Colorize?
   */
  yzColorIndicator?: boolean;
  /**
   * VirtualId
   */
  virtId?: string;
  /**
   * Index
   */
  index?: number;
  /**
   * Handle Function
   */
  handleDeleteDevice?: any;
  /**
   * Handle Function
   */
  handleEditVirtual?: any;
  /**
   * Handle Function
   */
  handleEditDevice?: any;
  /**
   * Handle Function
   */
  handleClearEffect?: any;
  /**
   * Handle Function
   */
  handlePlayPause?: any;
  /**
   * Handle Function
   */
  yzLinkTo?: any;
  /**
   * onClick Link
   */
  yzStyle?: any;
  /**
   * JSX styles
   */
}
export const DeviceCardDefaults: DeviceCardProps = {
  yzName: 'My Wled',
  yzEffectName: undefined,
  virtId: 'yz-quad',
  index: 1,
  handleDeleteDevice: () => console.log('DELETING DEVICE'), // eslint-disable-line no-console
  handleEditVirtual: () => console.log('EDITING VIRTUAL'), // eslint-disable-line no-console
  handleEditDevice: () => console.log('EDITING DEVICE'), // eslint-disable-line no-console
  handleClearEffect: () => console.log('CLEARING EFFECT'), // eslint-disable-line no-console
  handlePlayPause: () => console.log('PLAY/PAUSE'), // eslint-disable-line no-console
  yzLinkTo: '/',
  yzStyle: {},
  yzIconName: 'wled',
  yzColorIndicator: true,
  isPlaying: true,
  yzIsStreaming: false,
  yzPreviewOnly: true,
  yzIsEffectSet: true,
  yzTransitionTime: 5,
  yzIsDevice: 'yz-quad',
  yzGraphs: true,
};
