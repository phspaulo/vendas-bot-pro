
import React from 'react';
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <Logo size="sm" className="justify-center mb-4" />
        <p className="text-gray-400 mb-2">
          © 2024 BotVendas. Automatize seu atendimento e aumente suas vendas.
        </p>
        <p className="text-sm text-gray-500">
          Produto digital - Entrega imediata após pagamento aprovado
        </p>
      </div>
    </footer>
  );
};

export default Footer;
