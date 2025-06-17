
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeroSectionProps {
  user: SupabaseUser | null;
  onStartChatbot: () => void;
}

const HeroSection = ({ user, onStartChatbot }: HeroSectionProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Automação Inteligente
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
            Chatbot de WhatsApp para seu Negócio
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Automatize o atendimento do seu comércio com um chatbot inteligente. 
            Aumente suas vendas, melhore o atendimento e economize tempo!
          </p>
        </div>

        <Button 
          onClick={onStartChatbot}
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {user ? "Criar Meu Chatbot Agora" : "Criar Conta e Começar"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {!user && (
          <p className="text-sm text-gray-500 mt-4">
            É necessário fazer login para criar seu chatbot personalizado
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
