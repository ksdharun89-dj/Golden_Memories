import React from 'react';
import { PhotoNote } from '../types';
import { soundService } from '../utils/audio';

interface PhotoNoteDetailModalProps {
  note: PhotoNote | null;
  onClose: () => void;
}

export const PhotoNoteDetailModal: React.FC<PhotoNoteDetailModalProps> = ({
  note,
  onClose,
}) => {
  if (!note) return null;

  const handleReadAloud = () => {
    soundService.speakText(
      `Photo note from ${note.senderName}: "${note.message}"`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#eae4dc] animate-fade-in flex flex-col">
        {/* Photo */}
        <div className="w-full h-64 bg-slate-100 relative">
          <img
            src={note.photoUrl}
            alt="Family photo note"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-[#35675f]">
                favorite
              </span>
              <span className="text-[18px] font-bold text-[#181c20]">
                From {note.senderName} ({note.relationship})
              </span>
            </div>
            <span className="text-[13px] text-[#42474d]">{note.timestamp}</span>
          </div>

          <p className="text-[20px] font-medium text-[#181c20] leading-relaxed italic bg-[#f1f4f9] p-4 rounded-2xl border border-[#ebeef3]">
            "{note.message}"
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className="flex-1 py-3.5 rounded-xl bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#0c405e] font-bold text-[16px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
              <span>Listen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playGentleChime();
                onClose();
              }}
              className="flex-1 py-3.5 rounded-xl bg-[#0c405e] hover:bg-[#2b5777] text-white font-bold text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              <span>Send Love Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
