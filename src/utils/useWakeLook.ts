import { useState, useCallback } from 'react';
import { log } from './helpers'

const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      const wakeLockSentinel = await navigator.wakeLock.request('screen');
      setWakeLock(wakeLockSentinel);
      log('successWakeLock on');
    } catch (err) {
      console.error('Failed to acquire wake lock:', err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        log('successWakeLock off');
        setWakeLock(null);
      } catch (err) {
        console.error('Failed to release wake lock:', err);
      }
    }
  }, [wakeLock]);

  return { requestWakeLock, releaseWakeLock };
};

export default useWakeLock;
