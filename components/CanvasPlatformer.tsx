'use client';

//NOTE(jimmylee): Platformer game rendered via pre/span grid instead of canvas.
//NOTE(jimmylee): Same DOM diffing, IntersectionObserver, and ResizeObserver patterns as ASCIICanvas.
//NOTE(jimmylee): Physics run in sub-cell floating point; rendering quantizes to grid cells.
//NOTE(jimmylee): Click to toggle platform blocks on the grid.

import styles from '@components/CanvasPlatformer.module.css';

import * as React from 'react';

import ActionButton from '@components/ActionButton';

interface PlatformerProps {
  rows?: number;
}

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

const GRAVITY = 0.015;
const MOVE_SPEED = 0.2;
const JUMP_SPEED = -0.3;
const FRICTION = 0.85;

const CanvasPlatformer: React.FC<PlatformerProps> = ({ rows = 25 }) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [focused, setFocused] = React.useState(false);
  const focusedRef = React.useRef<boolean>(false);

  const positionRef = React.useRef<Position>({ x: 2, y: 0 });
  const velocityRef = React.useRef<Position>({ x: 0, y: 0 });
  const keysRef = React.useRef<Keys>({ left: false, right: false, jump: false });
  const platformBlocksRef = React.useRef<Set<string>>(new Set());
  const colsRef = React.useRef<number>(40);
  const touchActiveRef = React.useRef<boolean>(false);

  const frameRef = React.useRef<number>(0);
  const visibleRef = React.useRef<boolean>(false);
  const gridRef = React.useRef<HTMLSpanElement[]>([]);
  const prevColsRef = React.useRef<number>(0);
  const prevCharsRef = React.useRef<string[]>([]);
  const prevColorsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    let cancelled = false;

    const measure = document.createElement('span');
    measure.style.visibility = 'hidden';
    measure.style.position = 'absolute';
    measure.style.whiteSpace = 'pre';
    measure.textContent = 'X';
    el.appendChild(measure);

    const themeBorderColor = getComputedStyle(document.body).getPropertyValue('--theme-border').trim();
    const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();

    const initPlatform = (cols: number) => {
      const platformY = rows - 2;
      const blocks = new Set<string>();
      for (let x = 0; x < cols; x++) {
        blocks.add(`${x},${platformY}`);
      }
      platformBlocksRef.current = blocks;
      positionRef.current = { x: 2, y: platformY - 1 };
      velocityRef.current = { x: 0, y: 0 };
    };

    const buildGrid = (cols: number) => {
      if (cols === prevColsRef.current) return;
      prevColsRef.current = cols;
      colsRef.current = cols;
      while (el.firstChild && el.firstChild !== measure) {
        el.removeChild(el.firstChild);
      }

      const frag = document.createDocumentFragment();
      const spans: HTMLSpanElement[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const s = document.createElement('span');
          s.textContent = ' ';
          spans.push(s);
          frag.appendChild(s);
        }
        if (y < rows - 1) frag.appendChild(document.createTextNode('\n'));
      }

      el.insertBefore(frag, measure);
      gridRef.current = spans;
      prevCharsRef.current = new Array(cols * rows).fill('');
      prevColorsRef.current = new Array(cols * rows).fill('');
      initPlatform(cols);
    };

    const updateCols = () => {
      const chW = measure.getBoundingClientRect().width;
      if (chW > 0) {
        const cols = Math.floor(el.clientWidth / chW);
        buildGrid(cols);
      }
    };
    updateCols();

    const resizeObs = new ResizeObserver(updateCols);
    resizeObs.observe(el);

    const interObs = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasVisible) {
          frameRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    interObs.observe(el);

    //NOTE(jimmylee): Click handler — toggle platform blocks at clicked grid positions.
    //NOTE(jimmylee): Skips when touch controls were just used to avoid accidental block toggles on mobile.
    const handleClick = (e: MouseEvent) => {
      if (touchActiveRef.current) return;
      const rect = el.getBoundingClientRect();
      const chW = measure.getBoundingClientRect().width;
      const lineH = el.clientHeight / rows;
      const gx = Math.floor((e.clientX - rect.left) / chW);
      const gy = Math.floor((e.clientY - rect.top) / lineH);
      if (gx < 0 || gx >= colsRef.current || gy < 0 || gy >= rows) return;
      const key = `${gx},${gy}`;
      const blocks = platformBlocksRef.current;
      if (blocks.has(key)) {
        blocks.delete(key);
      } else {
        blocks.add(key);
      }
    };
    el.addEventListener('click', handleClick);

    const loop = () => {
      if (!visibleRef.current || cancelled) return;

      const cols = colsRef.current;
      const grid = gridRef.current;
      const total = cols * rows;
      const pChars = prevCharsRef.current;
      const pColors = prevColorsRef.current;
      const blocks = platformBlocksRef.current;
      const pos = positionRef.current;
      const vel = velocityRef.current;
      const keys = keysRef.current;

      if (keys.left) vel.x = -MOVE_SPEED;
      else if (keys.right) vel.x = MOVE_SPEED;
      else {
        vel.x *= FRICTION;
        if (Math.abs(vel.x) < 0.01) vel.x = 0;
      }

      const oldY = pos.y;
      vel.y += GRAVITY;
      pos.x += vel.x;
      pos.y += vel.y;

      if (pos.x < 0) pos.x = 0;
      if (pos.x > cols - 1) pos.x = cols - 1;

      //NOTE(jimmylee): Collision detection — find the nearest platform block below the player.
      const px = Math.round(pos.x);
      let groundY = rows;
      for (let checkY = Math.floor(oldY) + 1; checkY < rows; checkY++) {
        if (blocks.has(`${px},${checkY}`)) {
          groundY = checkY;
          break;
        }
      }

      if (pos.y + 1 > groundY) {
        pos.y = groundY - 1;
        vel.y = 0;
        if (keys.jump) vel.y = JUMP_SPEED;
      }

      if (pos.y >= rows) {
        const platformY = rows - 2;
        pos.x = 2;
        pos.y = platformY - 1;
        vel.x = 0;
        vel.y = 0;
      }

      const playerGX = Math.round(pos.x);
      const playerGY = Math.round(pos.y);

      for (let idx = 0; idx < total && idx < grid.length; idx++) {
        const gx = idx % cols;
        const gy = (idx - gx) / cols;
        const s = grid[idx];
        let ch: string;
        let color: string;

        if (gx === playerGX && gy === playerGY) {
          ch = '█';
          color = themeTextColor;
        } else if (blocks.has(`${gx},${gy}`)) {
          ch = '░';
          color = themeBorderColor;
        } else {
          ch = ' ';
          color = '';
        }

        if (ch !== pChars[idx]) {
          s.textContent = ch;
          pChars[idx] = ch;
        }
        if (color !== pColors[idx]) {
          s.style.color = color;
          pColors[idx] = color;
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      resizeObs.disconnect();
      interObs.disconnect();
      el.removeEventListener('click', handleClick);
      if (measure.parentNode) measure.parentNode.removeChild(measure);
    };
  }, [rows]);

  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    const onFocus = () => {
      setFocused(true);
      focusedRef.current = true;
    };
    const onBlur = () => {
      setFocused(false);
      focusedRef.current = false;
      keysRef.current = { left: false, right: false, jump: false };
    };

    el.tabIndex = 0;
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);

    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'ArrowRight') keysRef.current.right = true;
      if (e.code === 'Space') keysRef.current.jump = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!focusedRef.current) return;
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
  }, []);

  //NOTE(jimmylee): Touch regions for mobile — left third moves left, right third moves right, center jumps.
  //NOTE(jimmylee): Multi-touch supported so the player can move and jump simultaneously.
  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    const activeTouches = new Map<number, string>();

    const getRegion = (touch: Touch): string => {
      const rect = el.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const third = rect.width / 3;
      if (x < third) return 'left';
      if (x > third * 2) return 'right';
      return 'center';
    };

    const updateKeysFromTouch = () => {
      const regions = new Set(activeTouches.values());
      keysRef.current.left = regions.has('left');
      keysRef.current.right = regions.has('right');
      keysRef.current.jump = regions.has('center');
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!focusedRef.current) el.focus();
      touchActiveRef.current = true;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        activeTouches.set(t.identifier, getRegion(t));
      }
      updateKeysFromTouch();
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (activeTouches.has(t.identifier)) {
          activeTouches.set(t.identifier, getRegion(t));
        }
      }
      updateKeysFromTouch();
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        activeTouches.delete(e.changedTouches[i].identifier);
      }
      updateKeysFromTouch();
      if (activeTouches.size === 0) {
        setTimeout(() => {
          touchActiveRef.current = false;
        }, 300);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  const handleJumpClick = () => {
    const pos = positionRef.current;
    const vel = velocityRef.current;
    const blocks = platformBlocksRef.current;
    const px = Math.round(pos.x);
    let groundY = rows;
    for (let checkY = Math.floor(pos.y) + 1; checkY < rows; checkY++) {
      if (blocks.has(`${px},${checkY}`)) {
        groundY = checkY;
        break;
      }
    }
    if (pos.y + 1 >= groundY) vel.y = JUMP_SPEED;
  };

  const handleLeftClick = () => {
    positionRef.current.x -= 1;
    if (positionRef.current.x < 0) positionRef.current.x = 0;
  };

  const handleRightClick = () => {
    const cols = colsRef.current;
    positionRef.current.x += 1;
    if (positionRef.current.x > cols - 1) positionRef.current.x = cols - 1;
  };

  const heightStyle = { height: `calc(var(--font-size) * var(--theme-line-height-base) * ${rows})` };

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
        <pre ref={preRef} className={styles.root} style={heightStyle} tabIndex={0} />
      </div>
    </>
  );
};

export default CanvasPlatformer;
