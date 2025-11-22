import { useState, useEffect, useCallback, useRef } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export const useVirtualCursor = (isCustomMode: boolean) => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const isLongPress = useRef(false)

  const moveCursor = useCallback((keyCode: number, isKeyUp = false) => {
    setCursorPos((prev) => {
      let { x, y } = prev
      const speed = 20 // Adjust for sensitivity

      switch (keyCode) {
        case 38: // ArrowUp
          if (!isKeyUp) y -= speed
          break
        case 40: // ArrowDown
          if (!isKeyUp) y += speed
          break
        case 37: // ArrowLeft
          if (!isKeyUp) x -= speed
          break
        case 39: // ArrowRight
          if (!isKeyUp) x += speed
          break
        case 13: {
          // Enter/OK - Click at cursor position
          if (isKeyUp) {
            // Clear long press timer on key up
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current)
              longPressTimer.current = null
            }

            // Only fire click if it wasn't a long press
            if (!isLongPress.current) {
              let element = document.elementFromPoint(x, y) as HTMLElement

              // Find the nearest clickable parent if current element is not clickable
              while (element && typeof element.click !== 'function') {
                element = element.parentElement as HTMLElement
              }

              if (element) {
                console.log('Virtual cursor click on:', element)

                // ✅ CHECK IF ELEMENT IS MUI SWITCH INPUT OR HAS MUI SWITCH PARENT
                const isMuiSwitchInput =
                  element.classList.contains('MuiSwitch-input') ||
                  element.classList.contains('PrivateSwitchBase-input')

                const switchRoot = isMuiSwitchInput
                  ? (element.closest('.MuiSwitch-root') as HTMLElement)
                  : (element.closest('.MuiSwitch-root') as HTMLElement)

                if (switchRoot || isMuiSwitchInput) {
                  const switchInput = isMuiSwitchInput
                    ? (element as HTMLInputElement)
                    : (switchRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement)

                  if (switchInput) {
                    console.log('Clicking MUI Switch:', switchInput)

                    // Get the current checked state
                    const currentChecked = switchInput.checked

                    // Change the checked state
                    switchInput.checked = !currentChecked

                    // Dispatch React synthetic events in the correct order
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      'checked'
                    )?.set

                    if (nativeInputValueSetter) {
                      nativeInputValueSetter.call(switchInput, !currentChecked)
                    }

                    // Dispatch input and change events that React listens to
                    const inputEvent = new Event('input', { bubbles: true })
                    const changeEvent = new Event('change', { bubbles: true })

                    switchInput.dispatchEvent(inputEvent)
                    switchInput.dispatchEvent(changeEvent)

                    // Also dispatch click event as backup
                    const clickEvent = new MouseEvent('click', { bubbles: true })
                    switchInput.dispatchEvent(clickEvent)

                    // Visual feedback on the switch root (not the input)
                    const root = switchRoot || (element.closest('.MuiSwitch-root') as HTMLElement)
                    if (root) {
                      const originalOutline = root.style.outline
                      root.style.outline = '2px solid #2196F3'
                      setTimeout(() => {
                        root.style.outline = originalOutline
                      }, 200)
                    }

                    return prev // Early return - don't process further
                  }
                }

                // Check for MUI Checkbox
                const isMuiCheckboxInput =
                  element.classList.contains('MuiCheckbox-input') ||
                  (element.classList.contains('PrivateSwitchBase-input') &&
                    element.closest('.MuiCheckbox-root'))

                const checkboxRoot = isMuiCheckboxInput
                  ? (element.closest('.MuiCheckbox-root') as HTMLElement)
                  : (element.closest('.MuiCheckbox-root') as HTMLElement)

                if (checkboxRoot || isMuiCheckboxInput) {
                  const checkboxInput = isMuiCheckboxInput
                    ? (element as HTMLInputElement)
                    : (checkboxRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement)

                  if (checkboxInput) {
                    console.log('Clicking MUI Checkbox:', checkboxInput)
                    checkboxInput.click()

                    const root =
                      checkboxRoot || (element.closest('.MuiCheckbox-root') as HTMLElement)
                    if (root) {
                      const originalOutline = root.style.outline
                      root.style.outline = '2px solid #2196F3'
                      setTimeout(() => {
                        root.style.outline = originalOutline
                      }, 200)
                    }

                    return prev
                  }
                }

                // Check if it's a regular input element (not MUI component)
                const inputElement =
                  element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
                    ? element
                    : (element.querySelector(
                        'input:not(.MuiSwitch-input):not(.PrivateSwitchBase-input), textarea'
                      ) as HTMLElement)

                if (
                  inputElement &&
                  !inputElement.classList.contains('MuiSwitch-input') &&
                  !inputElement.classList.contains('PrivateSwitchBase-input')
                ) {
                  // For input elements, focus them to trigger keyboard
                  console.log('Focusing input element:', inputElement)
                  inputElement.focus()

                  // Dispatch focus event
                  const focusEvent = new FocusEvent('focus', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  })
                  inputElement.dispatchEvent(focusEvent)
                } else {
                  // For other elements, dispatch mouse events
                  const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                  })
                  const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                  })
                  const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                  })

                  element.dispatchEvent(mouseDownEvent)
                  element.dispatchEvent(mouseUpEvent)
                  element.dispatchEvent(clickEvent)

                  // Try native click as fallback
                  try {
                    element.click()
                  } catch (e) {
                    console.warn('Native click failed, using event dispatch only', e)
                  }
                }

                // Visual feedback (only if not already handled by MUI components)
                if (!switchRoot && !checkboxRoot && !isMuiSwitchInput && !isMuiCheckboxInput) {
                  const originalOutline = element.style.outline
                  element.style.outline = '2px solid #2196F3'
                  setTimeout(() => {
                    element.style.outline = originalOutline
                  }, 200)
                }
              } else {
                console.warn('No clickable element found at cursor position')
              }
            }

            // Reset long press flag
            isLongPress.current = false
          } else {
            // Key down - start long press timer
            longPressTimer.current = setTimeout(() => {
              isLongPress.current = true

              let element = document.elementFromPoint(x, y) as HTMLElement

              // Find the nearest element
              while (element && typeof element.dispatchEvent !== 'function') {
                element = element.parentElement as HTMLElement
              }

              if (element) {
                console.log('Virtual cursor LONG PRESS on:', element)

                // Dispatch touch/context menu events
                const contextMenuEvent = new MouseEvent('contextmenu', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  clientX: x,
                  clientY: y
                })

                element.dispatchEvent(contextMenuEvent)

                // Visual feedback for long press
                const originalOutline = element.style.outline
                element.style.outline = '3px solid #FF9800'
                setTimeout(() => {
                  element.style.outline = originalOutline
                }, 400)
              }
            }, 500) // 500ms for long press
          }
          return prev // Don't update position on click
        }
        // ✅ Add these cases to pass through media buttons
        case 227: // Rewind
        case 228: // Forward
        case 179: // Play/Pause
          // Don't handle these - let them bubble up to FireTvBar
          return prev
        default:
          return prev
      }

      // Keep cursor within bounds
      return {
        x: Math.max(0, Math.min(window.innerWidth - 1, x)),
        y: Math.max(0, Math.min(window.innerHeight - 1, y))
      }
    })
  }, [])

  // Handle Android remote events
  const handleRemoteCursor = useCallback(
    (e: Event) => {
      if (!isCustomMode) return

      const customEvent = e as CustomEvent<{ key: string; code: string; keyCode: number }>
      const { keyCode } = customEvent.detail

      // ✅ Only prevent default for navigation keys, NOT media buttons
      if ([37, 38, 39, 40, 13].includes(keyCode)) {
        e.preventDefault()
        e.stopPropagation()
      }

      // ✅ Don't call moveCursor for media buttons - let them bubble
      if ([227, 228, 179].includes(keyCode)) {
        return
      }

      moveCursor(keyCode, false)
    },
    [isCustomMode, moveCursor]
  )

  // Handle key up events for Enter button
  const handleRemoteCursorUp = useCallback(
    (e: Event) => {
      if (!isCustomMode) return

      const customEvent = e as CustomEvent<{ key: string; code: string; keyCode: number }>
      const { keyCode } = customEvent.detail

      if (keyCode === 13) {
        moveCursor(keyCode, true)
      }
    },
    [isCustomMode, moveCursor]
  )

  // Handle keyboard events (for desktop testing)
  const handleKeyboardCursor = useCallback(
    (e: KeyboardEvent) => {
      if (!isCustomMode) return

      // Check if it's an arrow key or Enter
      if ([37, 38, 39, 40, 13].includes(e.keyCode)) {
        e.preventDefault() // Prevent page scrolling and default navigation
        e.stopPropagation() // Stop event from bubbling
        moveCursor(e.keyCode, false)
      }
    },
    [isCustomMode, moveCursor]
  )

  const handleKeyboardCursorUp = useCallback(
    (e: KeyboardEvent) => {
      if (!isCustomMode) return

      if (e.keyCode === 13) {
        moveCursor(e.keyCode, true)
      }
    },
    [isCustomMode, moveCursor]
  )

  useEffect(() => {
    // Use capture phase to intercept events before they bubble
    window.addEventListener('androidremote', handleRemoteCursor, true)
    window.addEventListener('androidremoteup', handleRemoteCursorUp, true)
    window.addEventListener('keydown', handleKeyboardCursor, true)
    window.addEventListener('keyup', handleKeyboardCursorUp, true)

    return () => {
      window.removeEventListener('androidremote', handleRemoteCursor, true)
      window.removeEventListener('androidremoteup', handleRemoteCursorUp, true)
      window.removeEventListener('keydown', handleKeyboardCursor, true)
      window.removeEventListener('keyup', handleKeyboardCursorUp, true)

      // Clean up timer on unmount
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [handleRemoteCursor, handleRemoteCursorUp, handleKeyboardCursor, handleKeyboardCursorUp])

  return { cursorPos }
}
