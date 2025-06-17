
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

const PricingCard = () => {
  return (
    <div className="max-w-md mx-auto mb-12">
      <Card className="border-2 border-green-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
        <CardHeader className="text-center pb-3">
          <Badge className="mx-auto mb-2 bg-green-500 hover:bg-green-600">
            🔥 Oferta por Tempo Limitado
          </Badge>
          <CardTitle className="text-2xl">Chatbot Personalizado</CardTitle>
          <CardDescription>Pronto para seu negócio em minutos</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <span className="text-4xl font-bold text-green-600">R$ 29,90</span>
            <p className="text-lg text-gray-500 line-through">De R$ 299,90</p>
            <p className="text-sm text-green-600 font-semibold">90% de desconto!</p>
          </div>
          <ul className="text-left space-y-2 mb-6 text-sm">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Chatbot 100% personalizado para seu negócio
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Menu inteligente com 5 opções de atendimento
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Respostas automáticas personalizadas
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Código pronto para usar (JavaScript)
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Instruções completas de instalação
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Suporte completo via WhatsApp
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCard;
