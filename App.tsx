import React, { useState, useEffect, useCallback } from 'react';
import { ItemDaLista } from './types';
import Header from './components/Header';
import ListaDeCompras from './components/ListaDeCompras';
import AdicionarItemForm from './components/AdicionarItemForm';
import BotaoInstalar from './components/BotaoInstalar';

// Define a interface para o evento BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function App() {
  const [itens, setItens] = useState<ItemDaLista[]>(() => {
    try {
      const itensSalvos = localStorage.getItem('itensDeCompras');
      return itensSalvos ? JSON.parse(itensSalvos) : [];
    } catch (error) {
      console.error("Falha ao carregar itens do localStorage", error);
      return [];
    }
  });

  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('itensDeCompras', JSON.stringify(itens));
    } catch (error) {
      console.error("Falha ao salvar itens no localStorage", error);
    }
  }, [itens]);

  const adicionarItem = useCallback((texto: string) => {
    if (texto.trim() === '') return;
    const novoItem: ItemDaLista = {
      id: Date.now(),
      texto: texto.trim(),
      comprado: false,
    };
    setItens(prevItens => [...prevItens, novoItem]);
  }, []);

  const alternarItem = useCallback((id: number) => {
    setItens(prevItens =>
      prevItens.map(item =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    );
  }, []);

  const removerItem = useCallback((id: number) => {
    setItens(prevItens => prevItens.filter(item => item.id !== id));
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();
    installPromptEvent.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      } else {
        console.log('Usuário recusou a instalação');
      }
      setInstallPromptEvent(null);
    });
  };

  return (
    <div className="h-screen w-screen max-w-lg mx-auto flex flex-col bg-slate-100 font-sans shadow-2xl">
      <Header />
      <ListaDeCompras
        itens={itens}
        onAlternarItem={alternarItem}
        onRemoverItem={removerItem}
      />
      {installPromptEvent && <BotaoInstalar onInstall={handleInstallClick} />}
      <AdicionarItemForm onAdicionarItem={adicionarItem} />
    </div>
  );
}

export default App;
