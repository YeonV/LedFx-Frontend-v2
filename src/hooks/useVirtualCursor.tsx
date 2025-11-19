import { useState, useEffect, useCallback } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export const useVirtualCursor = (isCustomMode: boolean) => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })

  const moveCursor = useCallback((keyCode: number) => {
    setCursorPos((prev) => {
      let { x, y } = prev
      const speed = 20 // Adjust for sensitivity

      switch (keyCode) {
        case 38: // ArrowUp
          y -= speed
          break
        case 40: // ArrowDown
          y += speed
          break
        case 37: // ArrowLeft
          x -= speed
          break
        case 39: // ArrowRight
          x += speed
          break
        case 13: {
          // Enter/OK - Click at cursor position
          let element = document.elementFromPoint(x, y) as HTMLElement

          // Find the nearest clickable parent if current element is not clickable
          while (element && typeof element.click !== 'function') {
            element = element.parentElement as HTMLElement
          }

          if (element && typeof element.click === 'function') {
            console.log('Virtual cursor click on:', element)

            // Dispatch both mouse and click events for better compatibility
            const mouseDownEvent = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true,
              view: window
            })
            const mouseUpEvent = new MouseEvent('mouseup', {
              bubbles: true,
              cancelable: true,
              view: window
            })
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            })

            element.dispatchEvent(mouseDownEvent)
            element.dispatchEvent(mouseUpEvent)
            element.dispatchEvent(clickEvent)

            // Try native click as fallback
            try {
              element.click()
            } catch (e) {
              console.warn('Native click failed, using event dispatch only')
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

      moveCursor(keyCode)
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
        moveCursor(e.keyCode)
      }
    },
    [isCustomMode, moveCursor]
  )

  useEffect(() => {
    // Use capture phase to intercept events before they bubble
    window.addEventListener('androidremote', handleRemoteCursor, true)
    window.addEventListener('keydown', handleKeyboardCursor, true)

    return () => {
      window.removeEventListener('androidremote', handleRemoteCursor, true)
      window.removeEventListener('keydown', handleKeyboardCursor, true)
    }
  }, [handleRemoteCursor, handleKeyboardCursor])

  return { cursorPos }
}
