import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 60;

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, score, onScoreChange, generateFood]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-black border-4 border-fuchsia-600 shadow-[8px_8px_0px_0px_rgba(0,255,255,0.8)] screen-tear">
      <div className="mb-2 flex justify-between w-full px-2 items-center border-b-2 border-cyan-400 pb-2">
        <div 
          className="text-fuchsia-500 font-digital text-4xl tracking-widest uppercase glitch-text"
          data-text={`YIELD: ${score}`}
        >
          YIELD: {score}
        </div>
        <div className="text-cyan-400 font-digital text-2xl uppercase tracking-widest self-end">
          {isPaused ? 'HALTED' : 'EXEC'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-cyan-400 overflow-hidden mt-2"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'z-10 bg-fuchsia-500' : 'bg-cyan-400'}`}
              style={{
                left: segment.x * 20,
                top: segment.y * 20,
                width: 20,
                height: 20,
                border: '1px solid black'
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute bg-white z-0"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            width: 20,
            height: 20,
            boxShadow: '0 0 10px #fff, 0 0 20px #0ff, 0 0 30px #f0f'
          }}
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-6xl font-glitch text-red-500 mb-2 uppercase tracking-widest glitch-text" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <p className="text-cyan-400 font-digital text-3xl mb-6">
              FINAL_YIELD: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-black border-2 border-fuchsia-500 text-fuchsia-500 font-digital text-2xl uppercase tracking-widest hover:bg-fuchsia-500 hover:text-black transition-none"
            >
              {'>'} REBOOT_SEQ
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-7xl font-glitch text-cyan-400 uppercase tracking-widest glitch-text" data-text="SYS_HALT">
              SYS_HALT
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-cyan-500 font-digital text-xl text-center uppercase">
        {'>'} INPUT: [W,A,S,D] | INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
