
import React from 'react';

const BusinessTypesSection = () => {
  const businessTypes = [
    "🍔 Lanchonetes", "💄 Salões de Beleza", "🐕 Petshops", "✂️ Barbearias", 
    "💧 Depósitos de Água", "🍕 Pizzarias", "👗 Lojas de Roupas", "💊 Farmácias"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Perfeito para Qualquer Negócio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Seja qual for o seu segmento, nosso chatbot se adapta às suas necessidades específicas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessTypes.map((business, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-700">{business}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessTypesSection;
