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

// maybe add condition on use effect and an input ? but ...
export function useMouse() {
  const mouse = React.useMemo(() => ({ x: 0, y: 0 }), []);

  const mouseMove = (e) => {
    if ( document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
      mouse.x += e.movementX;
      mouse.y += e.movementY;
    }
  };

  const capture = () => {
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("click", capture);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("click", capture);
    };
  });

  return mouse;
}

export function useKeyboard() {
  const keyboard = React.useMemo(() => ({}), []);

  const keydown = (e) => (keyboard[e.key] = true);
  const keyup = (e) => (keyboard[e.key] = false);

  React.useEffect(() => {
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };
  });

  return keyboard;
}

// ....
export default function useKeyboard2() {
  const keyMap = React.useRef({})

  React.useEffect(() => {
    const onDocumentKey = (e) => {
      keyMap.current[e.code] = e.type === 'keydown'
    }
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)
    return () => {
      document.removeEventListener('keydown', onDocumentKey)
      document.removeEventListener('keyup', onDocumentKey)
    }
  })

  return keyMap.current
}

// ...
function actionByKey(key) {
  const keys = {
    KeyW: "moveForward",
    KeyS: "moveBackward",
    KeyA: "moveLeft",
    KeyD: "moveRight"
  };
  return keys[key];
}

export const useKeyboardControls = () => {
  const [movement, setMovement] = React.useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
  });

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Movement key
      if (actionByKey(e.code)) {
        setMovement((state) => ({ ...state, [actionByKey(e.code)]: true }));
      }
    };
    const handleKeyUp = (e) => {
      // Movement key
      if (actionByKey(e.code)) {
        setMovement((state) => ({ ...state, [actionByKey(e.code)]: false }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

// ... remove ?
export const usePersonControls = () => {
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
  }

  const moveFieldByKey = (key) => keys[key]

  const [movement, setMovement] = React.useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    }
    const handleKeyUp = (e) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return movement
}