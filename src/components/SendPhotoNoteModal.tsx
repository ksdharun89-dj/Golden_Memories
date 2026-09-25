import React, { useState } from 'react';
import { PhotoNote } from '../types';
import { soundService } from '../utils/audio';

interface SendPhotoNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendNote: (note: Omit<PhotoNote, 'id' | 'timestamp' | 'read'>) => void;
}

export const SendPhotoNoteModal: React.FC<SendPhotoNoteModalProps> = ({
  isOpen,
  onClose,
  onSendNote,
}) => {
  const photoOptions = [
    {
      title: 'Garden lavender bench',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKe6ampXYTfUCePC-3FlIi0HgLFyKF8MOh0zGpteJy4ODp4sYMYvWPg_UsgWDtjTD8g_lAVzbRm0p7dY0kSWPdiLZBXXKlH7nhFUTIkhYYCNXcbR-m_EhycNLBM9J1_IzTx0V0AoeHeAihP_-4hinOB0PTskCAogHsj9BFz6qqXEUH_KjjarPBI4JOyONlyK4v-DmZ8sz-3b-5O52jkm4oGUoG6_G6kNx0E859fJybW2B6YUt-Z16F',
    },
    {
      title: 'Family gathering',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWZTLB0znBYOPxSMsMGF4_2Tww51_RgbPUrkg-yNXM_MymhRvHp5mtn5hDi3dtusicKpnAZURjMoCe9b08dT8Xg7gWiHBq91ODfTSfYAQ8YyTXi9kZEhTJ8_uyU8ljjiviplIh0ObZsKe4xQ8j0MLev9qERJYxG5Z5cEMCZwWG91vH4I-sWGau3tU2zVtYNQN4khUgFyK3RnHCPPiAinXTJJwO0H1EPGQyVTBi-8Dq__YFGrevmGU',
    },
    {
      title: 'Morning teacups and blooms',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7AJ5egisAdachheWWpGsfmYF_evurwjKd7uvzKey1spkbxGQEWxC2QGqiMDdcYyuETee0RzbjXF9G0lJcdvfOnIWqhdatjx9xJAzDuu-DOVBi8SgOb5II85CvzokLMDDoYhfZgKtO8VX6i1T5irJY4lHIy1JocbupyiQDi636OLqBDk11_uYSLTKGY2weU222qZcXfzl3vNX2RHGNcCx7jVrIBA2cCI-LCIokOxKLiM09KC-qg9PT',
    },
  ];

  const [message, setMessage] = useState(
    'Thinking of you, Dad! We planted new yellow marigolds in the garden today. Sending big warm hugs!'
  );
  const [selectedPhoto, setSelectedPhoto] = useState(photoOptions[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    soundService.playCelebrationSound();
    onSendNote({
      senderName: 'Priya',
      relationship: 'Daughter',
      message: message.trim(),
      photoUrl: selectedPhoto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#eae4dc] animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebeef3]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] text-[#0c405e]">
              forward_to_inbox
            </span>
            <h2 className="text-[22px] font-bold text-[#181c20]">
              Send Ravi a Warm Photo Note
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#f1f4f9] hover:bg-[#e5e8ee] flex items-center justify-center text-[#181c20] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[15px] font-bold text-[#181c20] mb-2">
              Choose a comforting photo
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {photoOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPhoto(opt.url)}
                  className={`h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedPhoto === opt.url
                      ? 'border-[#0c405e] ring-2 ring-[#b8ede3] scale-[1.02]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === opt.url && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-[#0c405e] text-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[#181c20] mb-1.5">
              Warm message for Ravi
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#c2c7ce] focus:border-[#0c405e] focus:ring-2 focus:ring-[#b8ede3] text-[16px] leading-relaxed resize-none outline-none"
              placeholder="Write something loving and familiar..."
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#181c20] font-bold text-[17px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-[#0c405e] hover:bg-[#2b5777] text-white font-bold text-[17px] shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Send Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
