import React, { useState, useEffect } from 'react';
import { soundService } from '../utils/audio';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  callerRelation: string;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callerName,
  callerRelation,
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCallState('ringing');
    setSeconds(0);
    soundService.playGentleChime();
    const connectTimer = setTimeout(() => {
      setCallState('connected');
      soundService.speakText(
        `Hello ${callerName}! It is so wonderful to hear your voice. I am having a peaceful morning.`
      );
    }, 2800);

    return () => clearTimeout(connectTimer);
  }, [isOpen, callerName]);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c405e]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-white/20 animate-fade-in flex flex-col items-center">
        {/* Caller Avatar */}
        <div className="relative mt-2">
          <div className="w-28 h-28 rounded-full bg-[#b8ede3] flex items-center justify-center text-[#0c405e] shadow-lg border-4 border-white">
            <span className="material-symbols-outlined text-[64px]">person</span>
          </div>
          {callState === 'ringing' && (
            <div className="absolute inset-0 rounded-full border-4 border-[#35675f] animate-ping opacity-60" />
          )}
        </div>

        <h3 className="text-[26px] font-bold text-[#181c20] mt-4">
          {callerName}
        </h3>
        <p className="text-[16px] text-[#42474d] font-medium">{callerRelation}</p>

        <div className="mt-3 py-1.5 px-4 rounded-full bg-[#f1f4f9] text-[#0c405e] font-bold text-[15px]">
          {callState === 'ringing' ? 'Connecting soft call...' : `Connected • ${formatTime(seconds)}`}
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#ba1a1a] text-white shadow-md'
                : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="material-symbols-outlined text-[26px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.stopSpeech();
              soundService.playSoftTap();
              onClose();
            }}
            className="w-16 h-16 rounded-full bg-[#ba1a1a] hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
            title="End Call"
          >
            <span className="material-symbols-outlined text-[32px]">call_end</span>
          </button>

          <button
            type="button"
            onClick={() => soundService.playGentleChime()}
            className="w-14 h-14 rounded-full bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20] flex items-center justify-center transition-all cursor-pointer"
            title="Speaker volume"
          >
            <span className="material-symbols-outlined text-[26px]">volume_up</span>
          </button>
        </div>

        <p className="text-[13px] text-[#42474d] mt-6">
          Gentle Companion Audio Call • Free and private
        </p>
      </div>
    </div>
  );
};
