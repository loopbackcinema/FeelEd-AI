import { useEffect, useRef } from 'react';

/**
 * A custom hook to detect user inactivity and trigger a callback.
 * @param onInactive - The callback function to execute when the user is inactive.
 * @param timeout - The inactivity timeout duration in milliseconds.
 */
const useInactivityTimer = (onInactive: () => void, timeout: number) => {
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    // Function to reset the inactivity timer
    const resetTimer = () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      timeoutId.current = window.setTimeout(onInactive, timeout);
    };

    // Set up the initial timer
    resetTimer();

    // Add event listeners to reset the timer on user activity
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Cleanup function to remove listeners and clear the timer
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [onInactive, timeout]); // Rerun effect if onInactive or timeout changes
};

export default useInactivityTimer;
