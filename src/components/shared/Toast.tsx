import { useState, useEffect } from 'react';

interface ToastProps {
  title: string;
  body: string;
  onClose: () => void;
}

export default function Toast({ title, body, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 12000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl rounded-2xl shadow-2xl p-5 max-h-80 overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="font-bold text-green-400 text-sm mb-2">{title}</p>
          <div className="text-xs text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 text-xl leading-none shrink-0 transition-colors"
          aria-label="Close"
        >✕</button>
      </div>
    </div>
  );
}
