
import React from 'react';
import { ItemDaLista as ItemDaListaType } from '../types';
import ItemDaLista from './ItemDaLista';

interface ListaDeComprasProps {
  itens: ItemDaListaType[];
  onAlternarItem: (id: number) => void;
  onRemoverItem: (id: number) => void;
}

const ListaDeCompras: React.FC<ListaDeComprasProps> = ({ itens, onAlternarItem, onRemoverItem }) => {
  return (
    <main className="flex-grow overflow-y-auto p-4">
      {itens.length > 0 ? (
        <ul className="space-y-3">
          {itens.map((item) => (
            <ItemDaLista
              key={item.id}
              item={item}
              onAlternarItem={onAlternarItem}
              onRemoverItem={onRemoverItem}
            />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 text-center">
            Sua lista de compras está vazia.<br/> Adicione um item abaixo!
          </p>
        </div>
      )}
    </main>
  );
};

export default ListaDeCompras;
