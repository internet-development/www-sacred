'use client';

import styles from '@components/CanvasSnake.module.scss';

import * as React from 'react';

import ActionButton from '@components/ActionButton';

interface SnakeProps {
  rows?: number;
}

// TODO(jimmylee)
// Move these constants into a separate file
// Dynamically compute these constants since we're going to
// Support t-shirt sizes for the system.
const LINE_HEIGHT = 20;
const CHARACTER_WIDTH = 9.6;

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CanvasSnake = ({ rows = 25 }: SnakeProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [focused, setFocused] = React.useState(false);
  const directionRef = React.useRef<Direction>('RIGHT');
  const snakeRef = React.useRef<Position[]>([]);
  const fruitRef = React.useRef<Position>({ x: 0, y: 0 });
  const gridWidthRef = React.useRef<number>(0);
  const gridHeightRef = React.useRef<number>(0);
  const lastMoveTimeRef = React.useRef<number>(0);
  const moveInterval = 150;
  const animationFrameRef = React.useRef<number | null>(null);

  const reset = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const gridWidth = Math.floor(w / CHARACTER_WIDTH);
    const gridHeight = Math.floor(h / LINE_HEIGHT);

    gridWidthRef.current = gridWidth;
    gridHeightRef.current = gridHeight;

    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight / 2);

    snakeRef.current = [
      { x: startX - 13, y: startY },
      { x: startX - 12, y: startY },
      { x: startX - 11, y: startY },
      { x: startX - 10, y: startY },
      { x: startX - 9, y: startY },
      { x: startX - 8, y: startY },
      { x: startX - 7, y: startY },
      { x: startX - 6, y: startY },
      { x: startX - 5, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 1, y: startY },
      { x: startX, y: startY },
    ];

    directionRef.current = 'RIGHT';

    fruitRef.current = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };

    lastMoveTimeRef.current = performance.now();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const onHandleResizeCanvas = () => {
      const parentWidth = parent.clientWidth;
      const canvasHeight = rows * LINE_HEIGHT;
      canvas.width = parentWidth;
      canvas.height = canvasHeight;
      reset();
    };

    onHandleResizeCanvas();
    window.addEventListener('resize', onHandleResizeCanvas);
    return () => {
      window.removeEventListener('resize', onHandleResizeCanvas);
    };
  }, [rows, reset]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onHandleFocus = () => {
      setFocused(true);
    };
    const onHandleBlur = () => {
      setFocused(false);
    };

    canvas.tabIndex = 0;
    canvas.addEventListener('focus', onHandleFocus);
    canvas.addEventListener('blur', onHandleBlur);

    return () => {
      canvas.removeEventListener('focus', onHandleFocus);
      canvas.removeEventListener('blur', onHandleBlur);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
      }
      const currentDir = directionRef.current;
      if (e.key === 'ArrowLeft' && currentDir !== 'RIGHT') directionRef.current = 'LEFT';
      if (e.key === 'ArrowRight' && currentDir !== 'LEFT') directionRef.current = 'RIGHT';
      if (e.key === 'ArrowUp' && currentDir !== 'DOWN') directionRef.current = 'UP';
      if (e.key === 'ArrowDown' && currentDir !== 'UP') directionRef.current = 'DOWN';
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [focused]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeBorderColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();
    const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-focused-foreground').trim();

    const moveSnake = () => {
      const snake = snakeRef.current;
      const dir = directionRef.current;
      const head = snake[snake.length - 1];
      let newHead: Position = { x: head.x, y: head.y };
      if (dir === 'LEFT') newHead.x -= 1;
      if (dir === 'RIGHT') newHead.x += 1;
      if (dir === 'UP') newHead.y -= 1;
      if (dir === 'DOWN') newHead.y += 1;
      if (newHead.x < 0 || newHead.x >= gridWidthRef.current || newHead.y < 0 || newHead.y >= gridHeightRef.current) {
        reset();
        return;
      }
      for (const seg of snake) {
        if (seg.x === newHead.x && seg.y === newHead.y) {
          reset();
          return;
        }
      }
      snake.push(newHead);
      if (newHead.x === fruitRef.current.x && newHead.y === fruitRef.current.y) {
        placeTarget();
      } else {
        snake.shift();
      }
    };

    const placeTarget = () => {
      const snake = snakeRef.current;
      const gridW = gridWidthRef.current;
      const gridH = gridHeightRef.current;
      let fruitPos: Position;
      while (true) {
        fruitPos = {
          x: Math.floor(Math.random() * gridW),
          y: Math.floor(Math.random() * gridH),
        };
        if (!snake.some((s) => s.x === fruitPos.x && s.y === fruitPos.y)) break;
      }
      fruitRef.current = fruitPos;
    };

    const loop = (time: number) => {
      if (!ctx) return;
      if (!focused) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = themeTextColor;
      ctx.fillRect(fruitRef.current.x * CHARACTER_WIDTH, fruitRef.current.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
      ctx.fillStyle = themeBorderColor;
      for (const segment of snakeRef.current) {
        ctx.fillRect(segment.x * CHARACTER_WIDTH, segment.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
      }
      if (time - lastMoveTimeRef.current > moveInterval) {
        moveSnake();
        lastMoveTimeRef.current = time;
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    if (focused && animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [focused, reset]);

  React.useEffect(() => {
    if (!focused) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      return;
    }

    if (animationFrameRef.current === null && canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const themeBorderColor = getComputedStyle(document.body).getPropertyValue('--theme-border').trim();
        const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = themeBorderColor;
        ctx.fillRect(fruitRef.current.x * CHARACTER_WIDTH, fruitRef.current.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
        ctx.fillStyle = themeTextColor;

        for (const segment of snakeRef.current) {
          ctx.fillRect(segment.x * CHARACTER_WIDTH, segment.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
        }

        lastMoveTimeRef.current = time;
        animationFrameRef.current = requestAnimationFrame(loop);

        function loop(time: number) {
          if (!focused) return;
          if (!ctx) return;
          if (!canvas) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = themeBorderColor;
          ctx.fillRect(fruitRef.current.x * CHARACTER_WIDTH, fruitRef.current.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
          ctx.fillStyle = themeTextColor;
          for (const segment of snakeRef.current) {
            ctx.fillRect(segment.x * CHARACTER_WIDTH, segment.y * LINE_HEIGHT, CHARACTER_WIDTH, LINE_HEIGHT);
          }
          if (time - lastMoveTimeRef.current > moveInterval) {
            moveSnake();
            lastMoveTimeRef.current = time;
          }
          animationFrameRef.current = requestAnimationFrame(loop);
        }

        const moveSnake = () => {
          const snake = snakeRef.current;
          const dir = directionRef.current;
          const head = snake[snake.length - 1];
          let newHead: Position = { x: head.x, y: head.y };
          if (dir === 'LEFT') newHead.x -= 1;
          if (dir === 'RIGHT') newHead.x += 1;
          if (dir === 'UP') newHead.y -= 1;
          if (dir === 'DOWN') newHead.y += 1;
          if (newHead.x < 0 || newHead.x >= gridWidthRef.current || newHead.y < 0 || newHead.y >= gridHeightRef.current) {
            reset();
            return;
          }

          for (const seg of snake) {
            if (seg.x === newHead.x && seg.y === newHead.y) {
              reset();
              return;
            }
          }

          snake.push(newHead);
          if (newHead.x === fruitRef.current.x && newHead.y === fruitRef.current.y) {
            placeTarget();
          } else {
            snake.shift();
          }
        };

        const placeTarget = () => {
          const snake = snakeRef.current;
          const gridW = gridWidthRef.current;
          const gridH = gridHeightRef.current;
          let fruitPos: Position;
          while (true) {
            fruitPos = {
              x: Math.floor(Math.random() * gridW),
              y: Math.floor(Math.random() * gridH),
            };
            if (!snake.some((s) => s.x === fruitPos.x && s.y === fruitPos.y)) break;
          }
          fruitRef.current = fruitPos;
        };
      });
    }
  }, [focused, reset]);

  const onHandleClickUp = () => {
    if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
  };
  const onHandleClickDown = () => {
    if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
  };
  const onHandleClickLeft = () => {
    if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
  };
  const onHandleClickRight = () => {
    if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
  };

  return (
    <>
      <ActionButton hotkey="↑" onClick={onHandleClickUp}>
        Up
      </ActionButton>
      <ActionButton hotkey="↓" onClick={onHandleClickDown}>
        Down
      </ActionButton>
      <ActionButton hotkey="←" onClick={onHandleClickLeft}>
        Left
      </ActionButton>
      <ActionButton hotkey="→" onClick={onHandleClickRight}>
        Right
      </ActionButton>
      <div className={styles.container}>
        <canvas className={styles.root} ref={canvasRef} />
      </div>
    </>
  );
};

export default CanvasSnake;
