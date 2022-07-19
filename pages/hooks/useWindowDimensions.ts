/**
 * Thanks to StackOverflow user QoP :^)
 */
import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window ? window : { innerWidth: 480, innerHeight: 720 };
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (window) {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (window) window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
}