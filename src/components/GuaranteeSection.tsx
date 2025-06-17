
import React from 'react';
import { Shield, MessageCircle, Zap } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">100% Satisfação Garantida</h2>
          <p className="text-lg text-gray-600 mb-8">
            Se você não ficar completamente satisfeito com seu chatbot, 
            devolvemos seu dinheiro em até 7 dias. Sem perguntas, sem complicações.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Garantia de 7 dias</h3>
              <p className="text-sm text-gray-600">Dinheiro de volta se não estiver satisfeito</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Suporte completo</h3>
              <p className="text-sm text-gray-600">Ajuda com instalação e configuração</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Entrega imediata</h3>
              <p className="text-sm text-gray-600">Chatbot pronto em poucos minutos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
