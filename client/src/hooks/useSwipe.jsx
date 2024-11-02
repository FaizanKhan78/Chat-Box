import { useEffect, useState } from "react";

export const useSwipe = (onSwipeLeft) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Check if the movement is primarily horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -50) {
        // Swipe left
        onSwipeLeft();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [startX, startY]);

  return null; // No UI to render, just return null
};
