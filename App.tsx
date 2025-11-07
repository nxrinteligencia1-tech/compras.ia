import React, { useState, useEffect, useCallback } from 'react';
import { ItemDaLista } from './types';
import Header from './components/Header';
import ListaDeCompras from './components/ListaDeCompras';
import AdicionarItemForm from './components/AdicionarItemForm';

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

  return (
    <div className="h-screen w-screen max-w-lg mx-auto flex flex-col bg-slate-100 font-sans shadow-2xl">
      <Header />
      <ListaDeCompras
        itens={itens}
        onAlternarItem={alternarItem}
        onRemoverItem={removerItem}
      />
      <AdicionarItemForm onAdicionarItem={adicionarItem} />
    </div>
  );
}

export default App;
