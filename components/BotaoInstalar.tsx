import React from 'react';

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


interface BotaoInstalarProps {
  onInstall: () => void;
}

const BotaoInstalar: React.FC<BotaoInstalarProps> = ({ onInstall }) => {
  return (
    <div className="px-4 pb-2 flex-shrink-0">
      <button
        onClick={onInstall}
        className="w-full bg-sky-600 text-white px-4 py-3 rounded-lg flex items-center justify-center font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
        aria-label="Instalar aplicativo"
      >
        <DownloadIcon className="h-6 w-6 mr-3" />
        Instalar App para acesso rápido e offline
      </button>
    </div>
  );
};

export default BotaoInstalar;
