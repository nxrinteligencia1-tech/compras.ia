
import React from 'react';

const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.823-6.841a1.125 1.125 0 0 0-1.087-1.352H6.375L5.175 4.5h-1.5z" />
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-600 text-white p-4 shadow-md flex items-center justify-center space-x-3 flex-shrink-0">
      <ShoppingCartIcon className="h-8 w-8" />
      <h1 className="text-3xl font-bold tracking-tight">compras.ia</h1>
    </header>
  );
};

export default Header;
