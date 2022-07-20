/**
 * Thanks to StackOverflow users QoP and Darryl RN 
 */
import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  // state
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });

  // effect
  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {

      const handleResize = () => setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowDimensions;
}