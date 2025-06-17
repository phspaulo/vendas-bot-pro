
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Zap, Clock } from "lucide-react";

const FeaturesGrid = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Atendimento 24/7</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Responda seus clientes automaticamente, mesmo quando você não está disponível</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-lg">Aumente as Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Converta mais visitantes em clientes com respostas rápidas e persuasivas</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-lg">Economize Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Automatize perguntas frequentes e foque no que realmente importa</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesGrid;
