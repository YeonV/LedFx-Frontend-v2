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

                // Check for MUI Switch - look for the hidden checkbox input
                const switchInput = element
                  .closest('.MuiSwitch-root')
                  ?.querySelector('input[type="checkbox"]') as HTMLInputElement

                if (switchInput) {
                  console.log('Clicking MUI Switch:', switchInput)

                  // Trigger the switch by clicking the input
                  switchInput.click()

                  // Visual feedback on the switch root
                  const switchRoot = element.closest('.MuiSwitch-root') as HTMLElement
                  if (switchRoot) {
                    const originalOutline = switchRoot.style.outline
                    switchRoot.style.outline = '2px solid #2196F3'
                    setTimeout(() => {
                      switchRoot.style.outline = originalOutline
                    }, 200)
                  }

                  return prev
                }

                // Check if it's an input element or has an input child
                const inputElement =
                  element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
                    ? element
                    : (element.querySelector('input, textarea') as HTMLElement)

                if (inputElement) {
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

                // Visual feedback
                const originalOutline = element.style.outline
                element.style.outline = '2px solid #2196F3'
                setTimeout(() => {
                  element.style.outline = originalOutline
                }, 200)
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

      // Prevent default behavior for navigation keys in custom mode
      if ([37, 38, 39, 40, 13].includes(keyCode)) {
        e.preventDefault()
        e.stopPropagation()
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
