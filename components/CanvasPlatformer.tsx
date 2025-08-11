'use client';

import styles from '@components/CanvasPlatformer.module.scss';

import * as React from 'react';

import ActionButton from '@components/ActionButton';

interface PlatformerProps {
  rows?: number;
}

// TODO(jimmylee)
// Move these constants into a separate file
// Dynamically compute these constants since we're going to
// Support t-shirt sizes for the system.
const LINE_HEIGHT = 20;
const CHARACTER_WIDTH = 9.6;
const GRAVITY = 0.3;
const MOVE_SPEED = 2;
const JUMP_SPEED = -6;
const FRICTION = 0.85;

interface Position {
  x: number;
  y: number;
}

interface Keys {
  left: boolean;
  right: boolean;
  jump: boolean;
}

interface Block {
  x: number;
  y: number;
}

const CanvasPlatformer: React.FC<PlatformerProps> = ({ rows = 25 }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [focused, setFocused] = React.useState(false);

  const positionRef = React.useRef<Position>({ x: 50, y: 0 });
  const velocityRef = React.useRef<Position>({ x: 0, y: 0 });
  const keysRef = React.useRef<Keys>({ left: false, right: false, jump: false });
  const platformBlocksRef = React.useRef<Block[]>([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeCanvas = () => {
      const parentWidth = parent.clientWidth;
      const canvasHeight = rows * LINE_HEIGHT;
      canvas.width = parentWidth;
      canvas.height = canvasHeight;
      const platformY = canvas.height - LINE_HEIGHT * 2;
      positionRef.current.y = platformY - LINE_HEIGHT;
      platformBlocksRef.current = [];
      const numBlocks = Math.floor(parentWidth / CHARACTER_WIDTH);
      for (let i = 0; i < numBlocks; i++) {
        platformBlocksRef.current.push({ x: i * CHARACTER_WIDTH, y: platformY });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rows]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleFocus = () => setFocused(true);
    const handleBlur = () => {
      setFocused(false);
      keysRef.current = { left: false, right: false, jump: false };
    };

    canvas.tabIndex = 0;
    canvas.addEventListener('focus', handleFocus);
    canvas.addEventListener('blur', handleBlur);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CHARACTER_WIDTH) * CHARACTER_WIDTH;
      const y = Math.floor((e.clientY - rect.top) / LINE_HEIGHT) * LINE_HEIGHT;
      const blocks = platformBlocksRef.current;
      const existingIndex = blocks.findIndex((b) => b.x === x && b.y === y);
      if (existingIndex !== -1) {
        blocks.splice(existingIndex, 1);
      } else {
        blocks.push({ x, y });
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('focus', handleFocus);
      canvas.removeEventListener('blur', handleBlur);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'ArrowRight') keysRef.current.right = true;
      if (e.code === 'Space') keysRef.current.jump = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
      if (e.code === 'Space') keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [focused]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pos = positionRef.current;
      const vel = velocityRef.current;
      const keys = keysRef.current;
      const blocks = platformBlocksRef.current;

      const themeBorderColor = getComputedStyle(document.body).getPropertyValue('--theme-border').trim();
      const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();

      ctx.fillStyle = themeBorderColor;
      for (const b of blocks) {
        ctx.fillRect(b.x, b.y, CHARACTER_WIDTH, LINE_HEIGHT);
      }

      if (keys.left) vel.x = -MOVE_SPEED;
      else if (keys.right) vel.x = MOVE_SPEED;
      else {
        vel.x *= FRICTION;
        if (Math.abs(vel.x) < 0.1) vel.x = 0;
      }

      const oldY = pos.y;
      vel.y += GRAVITY;
      pos.x += vel.x;
      pos.y += vel.y;

      if (pos.x < 0) pos.x = 0;
      if (pos.x > w - CHARACTER_WIDTH) pos.x = w - CHARACTER_WIDTH;

      let groundY = h;
      for (const b of blocks) {
        const horizontallyOverlapping = pos.x + CHARACTER_WIDTH > b.x && pos.x < b.x + CHARACTER_WIDTH;
        if (horizontallyOverlapping && oldY + LINE_HEIGHT <= b.y && pos.y + LINE_HEIGHT >= b.y) {
          if (b.y < groundY) groundY = b.y;
        }
      }

      if (pos.y + LINE_HEIGHT > groundY) {
        pos.y = groundY - LINE_HEIGHT;
        vel.y = 0;
        if (keys.jump) vel.y = JUMP_SPEED;
      }

      ctx.fillStyle = themeTextColor;
      ctx.fillRect(pos.x, pos.y, CHARACTER_WIDTH, LINE_HEIGHT);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  const handleJumpClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = positionRef.current;
    const vel = velocityRef.current;
    let w = canvas.width;
    let h = canvas.height;
    let groundY = h;
    for (const b of platformBlocksRef.current) {
      const horizontallyOverlapping = pos.x + CHARACTER_WIDTH > b.x && pos.x < b.x + CHARACTER_WIDTH;
      if (horizontallyOverlapping && pos.y + LINE_HEIGHT <= b.y) {
        if (b.y < groundY) groundY = b.y;
      }
    }
    if (pos.y + LINE_HEIGHT >= groundY) vel.y = JUMP_SPEED;
  };

  const handleLeftClick = () => {
    const pos = positionRef.current;
    pos.x -= CHARACTER_WIDTH;
    if (pos.x < 0) pos.x = 0;
  };

  const handleRightClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = positionRef.current;
    pos.x += CHARACTER_WIDTH;
    if (pos.x > canvas.width - CHARACTER_WIDTH) pos.x = canvas.width - CHARACTER_WIDTH;
  };

  return (
    <>
      <ActionButton hotkey="␣" onClick={handleJumpClick}>
        Jump
      </ActionButton>
      <ActionButton hotkey="←" onClick={handleLeftClick}>
        Left
      </ActionButton>
      <ActionButton hotkey="→" onClick={handleRightClick}>
        Right
      </ActionButton>
      <div className={styles.container}>
        <canvas className={styles.root} ref={canvasRef} />
      </div>
    </>
  );
};

export default CanvasPlatformer;
