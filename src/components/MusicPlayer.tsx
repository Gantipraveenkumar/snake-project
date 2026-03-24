import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "ERR_01: NEON_HORIZON", artist: "SYNTH_CORE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "ERR_02: CYBER_PULSE", artist: "DARK_NET", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "ERR_03: DIGI_DREAM", artist: "VOID_WAVE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-fuchsia-600 p-6 relative screen-tear shadow-[8px_8px_0px_0px_rgba(0,255,255,0.8)]">
      <div className="absolute top-0 right-0 bg-fuchsia-600 text-black font-digital px-2 py-1 text-lg uppercase tracking-widest">
        AUDIO_MOD
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex flex-col mb-6 mt-4">
        <h3 className="font-digital text-4xl text-cyan-400 uppercase glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-fuchsia-500 text-xl font-digital uppercase tracking-widest mt-1">
          {'>'} SRC: {currentTrack.artist}
        </p>
      </div>

      {/* Visualizer bars (fake, jarring) */}
      <div className="flex items-end gap-1 h-16 mb-6 border-b-2 border-cyan-400/50 pb-2">
        {Array.from({length: 20}).map((_, i) => (
          <div 
            key={i}
            className="flex-1 bg-cyan-400 border border-black"
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : '10%',
              transition: 'height 0.1s steps(2)',
              animation: isPlaying ? `glitch-bar ${0.1 + Math.random() * 0.3}s infinite alternate` : 'none'
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-4 bg-gray-900 appearance-none cursor-pointer accent-fuchsia-500 border border-cyan-400"
        />
        <div className="flex justify-between mt-2 text-xl font-digital text-cyan-400">
          <span>T-{formatTime(progress)}</span>
          <span>T-{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t-2 border-fuchsia-600/80 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-fuchsia-500 font-digital text-2xl">VOL</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 h-4 bg-gray-900 appearance-none cursor-pointer accent-cyan-400 border border-fuchsia-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="px-3 py-1 bg-black border-2 border-cyan-400 text-cyan-400 font-digital text-2xl hover:bg-cyan-400 hover:text-black transition-none"
          >
            {'<<'}
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-6 py-1 bg-fuchsia-600 border-2 border-fuchsia-600 text-black font-digital text-3xl hover:bg-black hover:text-fuchsia-500 transition-none"
          >
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          
          <button 
            onClick={handleNext}
            className="px-3 py-1 bg-black border-2 border-cyan-400 text-cyan-400 font-digital text-2xl hover:bg-cyan-400 hover:text-black transition-none"
          >
            {'>>'}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes glitch-bar {
          0% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(0.8); }
          100% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
