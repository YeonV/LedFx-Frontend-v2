import { useState } from 'react'

const CrashButton = () => {
  const [shouldCrash, setShouldCrash] = useState(false)

  if (shouldCrash) {
    // This error happens during render, so the ErrorBoundary will catch it.
    throw new Error('Manual Test Crash!')
  }

  return (
    <button
      onClick={() => setShouldCrash(true)}
      style={{ padding: '5px 15px', background: 'red', color: 'white', marginLeft: '2rem' }}
    >
      ☢ Crash App
    </button>
  )
}

export default CrashButton
