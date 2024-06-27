import { Edit, GitHub } from '@mui/icons-material'

const IStorage = ['localStorage', 'indexedDb', 'cloud', 'custom'] as const
export const storageOptions = [
  'localStorage',
  'indexedDb',
  'cloud',
  'custom'
] as typeof IStorage
export interface AvatarPickerProps {
  /**
   * Where to store the avatar
   */
  storage?: (typeof IStorage)[number]
  /**
   * Custom storage setter (if provided, localStorage and indexedDb are ignored)
   */
  setAvatar?: ((_dataUri: string) => void) | null
  /**
   * Custom storage getter (if provided, localStorage and indexedDb are ignored)
   */
  avatar?: string
  /**
   * Custom storage key (for localStorage or indexedDb). Defaults to 'avatar'
   */
  storageKey?: string
  /**
   * Icon to show when no avatar is set
   */
  defaultIcon?: any
  /**
   * Hover-Icon to show when avatar is set
   */
  editIcon?: any
  /**
   * Size of the avatar
   */
  size?: number
  /**
   * Initial zoom level
   * */
  initialZoom?: number
  /**
   * Minimum zoom level
   */
  minZoom?: number
  /**
   * Maximum zoom level
   */
  maxZoom?: number
  /**
   * Zoom step
   */
  stepZoom?: number
  /**
   * Minimum rotation
   */
  minRotation?: number
  /**
   * Maximum rotation
   */
  maxRotation?: number
  /**
   * Rotation step
   */
  stepRotation?: number
  /**
   * Props to pass to the Avatar component
   */
  props?: any
}

