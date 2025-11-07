import React, { useState, useEffect } from 'react';

// --- Ícones (substituindo a dependência 'lucide-react') ---
const ShoppingCart: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg>
);
const Plus: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const Trash2: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const Check: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);

// Tipos
interface Item {
  id: string;
  nome: string;
  quantidade: number;
  comprado: boolean;
  dataCriacao: number;
}

// Componente Principal
export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [novoItem, setNovoItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [instalavel, setInstalavel] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Carrega itens do storage e prepara para instalação
  useEffect(() => {
    carregarItens();
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstalavel(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const carregarItens = () => {
    try {
      const itensSalvos = localStorage.getItem('lista-compras');
      if (itensSalvos) {
        setItems(JSON.parse(itensSalvos));
      }
    } catch (error) {
      console.log('Primeira vez usando o app ou dados inválidos.');
    }
  };

  const salvarItens = (novosItems: Item[]) => {
    try {
      localStorage.setItem('lista-compras', JSON.stringify(novosItems));
      setItems(novosItems);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const instalarApp = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App instalado!');
    }
    
    setDeferredPrompt(null);
    setInstalavel(false);
  };

  const adicionarItem = () => {
    if (!novoItem.trim()) return;

    const item: Item = {
      id: Date.now().toString(),
      nome: novoItem,
      quantidade: quantidade,
      comprado: false,
      dataCriacao: Date.now()
    };

    salvarItens([...items, item].sort((a,b) => a.dataCriacao - b.dataCriacao));
    setNovoItem('');
    setQuantidade(1);
  };

  const toggleComprado = (id: string) => {
    const novosItems = items.map(item =>
      item.id === id ? { ...item, comprado: !item.comprado } : item
    );
    salvarItens(novosItems);
  };

  const removerItem = (id: string) => {
    salvarItens(items.filter(item => item.id !== id));
  };

  const limparComprados = () => {
    salvarItens(items.filter(item => !item.comprado));
  };

  const itemsAtivos = items.filter(i => !i.comprado);
  const itemsComprados = items.filter(i => i.comprado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Lista de Compras</h1>
                <p className="text-indigo-200 text-sm">
                  {itemsAtivos.length} {itemsAtivos.length === 1 ? 'item' : 'itens'} pendente{itemsAtivos.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {instalavel && (
              <button
                onClick={instalarApp}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow"
              >
                Instalar App
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 w-full">
        {/* Formulário de Adicionar */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Item</h2>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <input
              type="text"
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && adicionarItem()}
              placeholder="Nome do item..."
              className="flex-1 w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-24 sm:w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center"
            />
            <button
              onClick={adicionarItem}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar</span>
            </button>
          </div>
        </section>

        {/* Lista de Itens Ativos */}
        {itemsAtivos.length > 0 && (
          <section className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">A Comprar</h2>
            <ul className="space-y-2">
              {itemsAtivos.map(item => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => toggleComprado(item.id)}
                    className="flex-shrink-0 w-6 h-6 border-2 border-gray-300 rounded-full hover:border-indigo-500 transition-colors"
                    aria-label={`Marcar ${item.nome} como comprado`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.nome}</p>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                  </div>
                  <button
                    onClick={() => removerItem(item.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                    aria-label={`Remover ${item.nome}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Lista de Itens Comprados */}
        {itemsComprados.length > 0 && (
          <section className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Comprados ({itemsComprados.length})
              </h2>
              <button
                onClick={limparComprados}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpar comprados
              </button>
            </div>
            <ul className="space-y-2">
              {itemsComprados.map(item => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg"
                >
                  <button
                    onClick={() => toggleComprado(item.id)}
                    className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    aria-label={`Marcar ${item.nome} como não comprado`}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-500 line-through truncate">{item.nome}</p>
                    <p className="text-sm text-gray-400">Quantidade: {item.quantidade}</p>
                  </div>
                  <button
                    onClick={() => removerItem(item.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                     aria-label={`Remover ${item.nome}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Mensagem quando vazio */}
        {items.length === 0 && (
          <section className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Sua lista está vazia
            </h3>
            <p className="text-gray-500">
              Comece adicionando itens no formulário acima.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        <p>💡 Dica: Instale o app na sua tela inicial para acesso rápido e offline!</p>
      </footer>
    </div>
  );
}
