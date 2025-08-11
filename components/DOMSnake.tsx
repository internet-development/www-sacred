'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './DOMSnake.module.scss';
import ActionButton from './ActionButton';

interface SnakeGameProps {
  width?: number;
  height?: number;
  startSpeed?: number;
}

interface Position {
  x: number;
  y: number;
}

const DIRECTIONS: Record<string, Position> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default function SnakeGame(props: SnakeGameProps) {
  const GRID_WIDTH: number = props.width || 40;
  const GRID_HEIGHT: number = props.height || 20;
  const START_SPEED: number = props.startSpeed || 150;
  const INITIAL_SNAKE: Position[] = [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }];

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position | null>(null);
  const [direction, setDirection] = useState<Position>(DIRECTIONS.ArrowRight);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(START_SPEED);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);
  const nextDirection = useRef<Position>(DIRECTIONS.ArrowRight);

  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFood(generateFood());
  }, []);

  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.tabIndex = 0;
      gameContainerRef.current.focus();
    }
  }, []);

  const onHandleClick = (keyName: string) => {
    if (DIRECTIONS[keyName] && (DIRECTIONS[keyName].x !== -direction.x || DIRECTIONS[keyName].y !== -direction.y)) {
      nextDirection.current = DIRECTIONS[keyName];
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!gameContainerRef.current?.contains(document.activeElement)) {
        gameContainerRef.current?.focus();
      }

      e.preventDefault();
      e.stopPropagation();

      if (DIRECTIONS[e.key] && (DIRECTIONS[e.key].x !== -direction.x || DIRECTIONS[e.key].y !== -direction.y)) {
        nextDirection.current = DIRECTIONS[e.key];
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;
    if (moveInterval.current) clearInterval(moveInterval.current);
    moveInterval.current = setInterval(moveSnake, speed);
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [snake, isGameOver, speed]);

  useEffect(() => {
    restartGame();
  }, [isGameOver]);

  function moveSnake(): void {
    setDirection(nextDirection.current);
    const newHead: Position = {
      x: snake[0].x + nextDirection.current.x,
      y: snake[0].y + nextDirection.current.y,
    };

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      return;
    }

    const newSnake: Position[] = [newHead, ...snake];
    if (food && newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
      setSpeed((prev) => Math.max(prev - 5, 50));
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function checkCollision({ x, y }: Position): boolean {
    return x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT || snake.some((segment: Position) => segment.x === x && segment.y === y);
  }

  function generateFood(): Position {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snake.some((segment: Position) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  function restartGame(): void {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(DIRECTIONS.ArrowRight);
    setSpeed(START_SPEED);
    nextDirection.current = DIRECTIONS.ArrowRight;
    setIsGameOver(false);
  }

  return (
    <div className={styles.container}>
      <div>
        <ActionButton hotkey="↑" onClick={() => onHandleClick('ArrowUp')}>
          Up
        </ActionButton>
        <ActionButton hotkey="↓" onClick={() => onHandleClick('ArrowDown')}>
          Down
        </ActionButton>
        <ActionButton hotkey="←" onClick={() => onHandleClick('ArrowLeft')}>
          Left
        </ActionButton>
        <ActionButton hotkey="→" onClick={() => onHandleClick('ArrowRight')}>
          Right
        </ActionButton>
      </div>

      <div
        className={styles.grid}
        ref={gameContainerRef}
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 10px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 20px)`,
        }}
      >
        {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map((_, i: number) => {
          const x: number = i % GRID_WIDTH;
          const y: number = Math.floor(i / GRID_WIDTH);
          const isSnake: boolean = snake.some((segment: Position) => segment.x === x && segment.y === y);
          const isFood: boolean = food ? food.x === x && food.y === y : false;
          return <div key={i} className={`${styles.cell} ${isSnake ? styles.snake : ''} ${isFood ? styles.food : ''}`} />;
        })}
      </div>
    </div>
  );
}
