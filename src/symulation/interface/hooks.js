import React from 'react'

export function useWindowDimentions() {
    const [size, setSize] = React.useState([0, 0]);
    React.useLayoutEffect(() => {
      const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export function useCanvas (draw) {
    const canvasRef = React.useRef();
  
    React.useEffect(() => {
      const ctx = canvasRef.current.getContext('2d');
      function renderFrame () {
        animationFrameId = requestAnimationFrame(renderFrame);
        draw(ctx);
      }
      let animationFrameId = requestAnimationFrame(renderFrame);
      return () => cancelAnimationFrame(animationFrameId);
    }, [draw]);
  
    return canvasRef;
}