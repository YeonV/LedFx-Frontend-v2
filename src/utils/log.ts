/* eslint-disable no-unused-vars */
// --- Configuration ---
const colorStyles = {
  // Use 'as const' for stricter key inference if needed, but Record is fine
  green: 'background: #1db954; color: #fff; font-weight: 700;',
  blue: 'background: #0dbedc; color: #fff; font-weight: 700;',
  yellow: 'background: #ffc107; color: #000; font-weight: 700;',
  red: 'background: #dc3545; color: #fff; font-weight: 700;',
  orange: 'background: #fd7e14; color: #fff; font-weight: 700;',
  purple: 'background: #6f42c1; color: #fff; font-weight: 700;',
  grey: 'background: #6c757d; color: #fff; font-weight: normal;',
  dark: 'background: #343a40; color: #fff; font-weight: normal;'
}

const consoleMethods = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
} as const // Use 'as const' for strict keys

const defaultLevelColors = {
  log: colorStyles.dark,
  info: colorStyles.blue,
  warn: colorStyles.yellow,
  error: colorStyles.red,
  debug: colorStyles.grey
}

// --- Type Definitions ---
export type ColorName = keyof typeof colorStyles
export type BrowserLogLevel = keyof typeof consoleMethods // Derive from consoleMethods keys
const allColorNames = Object.keys(colorStyles) as ColorName[]

// Signature for the specific methods like log.green(), log.info()
type LogMethodSignature = (category: string, ...messages: any[]) => void

// Mapped type for Color methods (used internally for construction)
type ColorMethods = {
  [Color in ColorName]: LogMethodSignature
}

// Type for Level methods (base callable + Color methods)
type LogLevelMethods = LogMethodSignature & ColorMethods

// Define the final LogObject structure explicitly
// This avoids the "mapped type may not declare properties" error
interface LogObject {
  green: LogMethodSignature
  blue: LogMethodSignature
  yellow: LogMethodSignature
  red: LogMethodSignature
  orange: LogMethodSignature
  purple: LogMethodSignature
  grey: LogMethodSignature
  dark: LogMethodSignature

  log: LogLevelMethods
  info: LogLevelMethods
  warn: LogLevelMethods
  error: LogLevelMethods
  debug: LogLevelMethods

  custom?: (cssStyle: string, category: string, ...messages: any[]) => void
}

// --- Filtering State ---
const defaultEnabledColorsList = allColorNames.filter((color) => color !== 'purple')
let enabledLogColors: Set<ColorName> = new Set(defaultEnabledColorsList)

// --- Internal Implementation ---
const performLog = (
  method: (...data: any[]) => void,
  style: string,
  category: string,
  messages: any[],
  colorNameUsed: ColorName | null
) => {
  if (colorNameUsed === null || enabledLogColors.has(colorNameUsed)) {
    method(`%c${category}`, `padding: 2px 6px; border-radius: 3px; ${style}`, ...messages)
  }
}

// --- Create the Exported `log` Object (Explicit Construction) ---

// Helper function to create the object for a specific level
const createLevelObject = (level: BrowserLogLevel): LogLevelMethods => {
  const consoleMethod = consoleMethods[level]
  const defaultColorStyle = defaultLevelColors[level]
  const defaultColorName =
    allColorNames.find((name) => colorStyles[name] === defaultColorStyle) || null

  // Base function for this level
  const baseFunc: LogMethodSignature = (category, ...messages) => {
    performLog(consoleMethod, defaultColorStyle, category, messages, defaultColorName)
  }

  // Create the object, starting with the base function, cast initially
  const levelObj = baseFunc as Partial<LogLevelMethods>

  // Attach color methods explicitly
  for (const colorName in colorStyles) {
    const cName = colorName as ColorName
    const specificStyle = colorStyles[cName]
    levelObj[cName] = (category, ...messages) => {
      // Assign specific color methods
      performLog(consoleMethod, specificStyle, category, messages, cName)
    }
  }

  // Final cast: Assert that all methods are now attached
  return levelObj as LogLevelMethods
}

// Create the main log object with explicitly defined properties
const logExport: LogObject = {
  // Color methods (using console.log)
  green: (category, ...messages) =>
    performLog(console.log, colorStyles.green, category, messages, 'green'),
  blue: (category, ...messages) =>
    performLog(console.log, colorStyles.blue, category, messages, 'blue'),
  yellow: (category, ...messages) =>
    performLog(console.log, colorStyles.yellow, category, messages, 'yellow'),
  red: (category, ...messages) =>
    performLog(console.log, colorStyles.red, category, messages, 'red'),
  orange: (category, ...messages) =>
    performLog(console.log, colorStyles.orange, category, messages, 'orange'),
  purple: (category, ...messages) =>
    performLog(console.log, colorStyles.purple, category, messages, 'purple'),
  grey: (category, ...messages) =>
    performLog(console.log, colorStyles.grey, category, messages, 'grey'),
  dark: (category, ...messages) =>
    performLog(console.log, colorStyles.dark, category, messages, 'dark'),

  // Level methods (created using the helper)
  log: createLevelObject('log'),
  info: createLevelObject('info'),
  warn: createLevelObject('warn'),
  error: createLevelObject('error'),
  debug: createLevelObject('debug')

  // custom: (cssStyle, category, ...messages) => { /* implementation */ } // Add if needed
}

// --- Final Export ---
/**
 * Structured logging utility object with methods for levels (info, warn, error, debug, log)
 * and colors (green, blue, red, etc.). Supports runtime filtering based on color names.
 * @example log.green('Spotify', 'Auth successful'); // Direct color (uses console.log)
 * @example log.info('System', 'Initializing...'); // Direct level (uses console.info, default color)
 * @example log.info.green('Database', 'Query ok'); // Combined level and color
 * @example log.error.red('Validation', 'Failed!', err); // Uses console.error + red style
 */
export const log = logExport // Export the fully constructed object

// --- Filtering Control ---
/** Sets the currently enabled log colors. */
export const setEnabledLogColors = (colors: ColorName[]) => {
  enabledLogColors = new Set(colors)
  // Now log.info definitely exists
  log.info.purple('LoggerConfig', 'Enabled colors updated:', Array.from(enabledLogColors))
}

/** Gets the currently enabled log colors. */
export const getEnabledLogColors = (): ColorName[] => Array.from(enabledLogColors)

/** List of all available color names. */
export const availableColorNames = allColorNames

// --- Initialize Filter ---
try {
  const storedColors = localStorage.getItem('logViewerEnabledColors')
  if (storedColors) {
    const parsedColors = JSON.parse(storedColors)
    if (Array.isArray(parsedColors) && parsedColors.every((c) => availableColorNames.includes(c))) {
      setEnabledLogColors(parsedColors)
    } else {
      console.warn(
        '[LoggerConfig] Invalid log color filter in localStorage. Using default (no purple).'
      )
      setEnabledLogColors(defaultEnabledColorsList)
    }
  }
} catch (e) {
  console.error('[LoggerConfig] Failed to initialize log color filter from localStorage', e)
  setEnabledLogColors(defaultEnabledColorsList)
}
