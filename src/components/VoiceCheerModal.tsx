import React, { useState, useEffect } from 'react';
import { soundService } from '../utils/audio';

interface VoiceCheerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheerSent: (cheerText: string) => void;
}

export const VoiceCheerModal: React.FC<VoiceCheerModalProps> = ({
  isOpen,
  onClose,
  onCheerSent,
}) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setRecordingState('idle');
    setSeconds(0);
  }, [isOpen]);

  useEffect(() => {
    if (recordingState !== 'recording') return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev + 1 >= 15) {
          clearInterval(interval);
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingState]);

  useEffect(() => {
    if (recordingState === 'recording' && seconds >= 15) {
      setRecordingState('recorded');
    }
  }, [recordingState, seconds]);

  if (!isOpen) return null;

  const handleStartRecord = () => {
    soundService.playSoftTap();
    setSeconds(0);
    setRecordingState('recording');
  };

  const handleStopRecord = () => {
    soundService.playGentleChime();
    setRecordingState('recorded');
  };

  const handleSend = () => {
    soundService.playCelebrationSound();
    onCheerSent('Warm cheer from Priya: "You are doing wonderful today, Dad! Sending you so much love."');
    onClose();
  };

  const handlePlayBack = () => {
    soundService.speakText("Hi Dad! Just calling in to cheer you on. Keep smiling and have a wonderful day!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#eae4dc] animate-fade-in flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#ffdcc1] flex items-center justify-center text-[#5d3100] shadow-sm mb-3">
          <span className="material-symbols-outlined text-[36px]">mic</span>
        </div>

        <h3 className="text-[22px] font-bold text-[#181c20]">
          Leave a Voice Cheer for Ravi
        </h3>
        <p className="text-[15px] text-[#42474d] mt-1">
          Record a 15-second comforting message to brighten his day.
        </p>

        {/* Audio Recording State Visualizer */}
        <div className="w-full my-6 p-4 rounded-2xl bg-[#f1f4f9] border border-[#ebeef3] flex flex-col items-center">
          {recordingState === 'recording' && (
            <div className="flex items-center gap-1.5 h-10 mb-2">
              <div className="w-1.5 bg-[#ba1a1a] rounded-full animate-bounce h-6" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 bg-[#ba1a1a] rounded-full animate-bounce h-10" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 bg-[#ba1a1a] rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
              <div className="w-1.5 bg-[#ba1a1a] rounded-full animate-bounce h-8" style={{ animationDelay: '450ms' }} />
              <div className="w-1.5 bg-[#ba1a1a] rounded-full animate-bounce h-6" style={{ animationDelay: '600ms' }} />
            </div>
          )}

          <div className="text-[28px] font-bold text-[#0c405e] font-mono tabular-nums">
            0:{seconds < 10 ? `0${seconds}` : seconds} / 0:15
          </div>

          <span className="text-[14px] text-[#42474d] mt-1 font-semibold">
            {recordingState === 'idle'
              ? 'Ready to record'
              : recordingState === 'recording'
              ? 'Recording your voice cheer...'
              : 'Voice cheer captured!'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full">
          {recordingState === 'idle' && (
            <button
              type="button"
              onClick={handleStartRecord}
              className="flex-1 py-3.5 rounded-xl bg-[#5d3100] hover:bg-[#7e4500] text-white font-bold text-[17px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[22px]">fiber_manual_record</span>
              <span>Record</span>
            </button>
          )}

          {recordingState === 'recording' && (
            <button
              type="button"
              onClick={handleStopRecord}
              className="flex-1 py-3.5 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white font-bold text-[17px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[22px]">stop</span>
              <span>Finish Recording</span>
            </button>
          )}

          {recordingState === 'recorded' && (
            <>
              <button
                type="button"
                onClick={handlePlayBack}
                className="flex-1 py-3.5 rounded-xl bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#181c20] font-bold text-[16px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                <span>Listen</span>
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex-1 py-3.5 rounded-xl bg-[#0c405e] hover:bg-[#2b5777] text-white font-bold text-[16px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Send</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3.5 rounded-xl bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#42474d] font-bold text-[15px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
