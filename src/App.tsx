import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-digital overflow-hidden relative flex flex-col items-center justify-center p-4 selection:bg-fuchsia-600 selection:text-cyan-300">
      {/* Overlays */}
      <div className="absolute inset-0 scanlines z-50 pointer-events-none" />
      <div className="absolute inset-0 static-noise z-40 pointer-events-none" />
      
      {/* Header */}
      <header className="absolute top-6 left-6 z-10 screen-tear">
        <h1 className="text-5xl font-glitch text-cyan-400 uppercase tracking-widest glitch-text" data-text="SYS.SNAKE_PROTOCOL">
          SYS.SNAKE_PROTOCOL
        </h1>
        <p className="text-xl font-digital text-fuchsia-500 tracking-widest uppercase mt-1">
          {'>'} AUDIO_SUBSYSTEM: ONLINE
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-30 flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl mt-24 lg:mt-0">
        
        {/* Game Section */}
        <div className="flex-1 flex justify-center items-center w-full">
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Player Section */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          {/* Score Display Panel */}
          <div className="bg-black border-2 border-cyan-400 p-6 flex flex-col items-center justify-center relative overflow-hidden screen-tear shadow-[4px_4px_0px_0px_rgba(255,0,255,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 animate-pulse" />
            <h3 className="text-cyan-400 font-digital text-2xl uppercase tracking-widest mb-2">
              [ DATA_YIELD ]
            </h3>
            <div className="text-7xl font-digital text-fuchsia-500 glitch-text">
              {score.toString().padStart(4, '0')}
            </div>
          </div>

          {/* Music Player */}
          <MusicPlayer />
        </div>

      </main>
    </div>
  );
}
