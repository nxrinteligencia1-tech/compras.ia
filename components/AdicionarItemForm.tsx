
import React, { useState } from 'react';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);


interface AdicionarItemFormProps {
  onAdicionarItem: (texto: string) => void;
}

const AdicionarItemForm: React.FC<AdicionarItemFormProps> = ({ onAdicionarItem }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdicionarItem(texto);
    setTexto('');
  };

  return (
    <footer className="bg-white p-4 border-t border-slate-200 shadow-t-sm flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Adicionar um novo item..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow duration-200"
          aria-label="Novo item da lista"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={!texto.trim()}
          aria-label="Adicionar item"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
};

export default AdicionarItemForm;
