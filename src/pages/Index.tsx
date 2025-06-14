
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, MessageCircle, Star, ArrowRight, Shield, Clock, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import BusinessForm from "@/components/BusinessForm";
import PaymentPage from "@/components/PaymentPage";
import SetupInstructions from "@/components/SetupInstructions";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import AutomatedTester from "@/components/AutomatedTester";
import { toast } from "sonner";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'payment' | 'setup'>('landing');
  const [businessData, setBusinessData] = useState(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Verifica se há um usuário logado
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          setShowAuth(false);
          toast.success("Login realizado com sucesso!");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Adiciona useEffect para detectar login e atualizar currentStep
  useEffect(() => {
    if (user && currentStep === 'landing' && !showAuth) {
      console.log("Usuário logado detectado, redirecionando para formulário");
      setCurrentStep('form');
    }
  }, [user, currentStep, showAuth]);

  // Console.log para debug
  useEffect(() => {
    console.log("Usuário atual:", user);
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao fazer logout");
    } else {
      toast.success("Logout realizado com sucesso!");
      setCurrentStep('landing');
    }
  };

  const handleFormSubmit = (data: any) => {
    setBusinessData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('setup');
  };

  // Melhora o handleStartChatbot para ser mais robusto
  const handleStartChatbot = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setShowAuth(true);
    } else {
      setUser(session.user); // garante que o estado atualize
      setCurrentStep('form');
    }
  };

  // Melhora o onAuthSuccess para aguardar a sessão ser atualizada
  const handleAuthSuccess = async () => {
    setShowAuth(false);
    // Aguarda um pouco para o Supabase atualizar a sessão
    setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setCurrentStep('form');
      }
    }, 100);
  };

  if (showAuth) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentStep === 'form') {
    return <BusinessForm onSubmit={handleFormSubmit} onBack={() => setCurrentStep('landing')} />;
  }

  if (currentStep === 'payment') {
    return <PaymentPage businessData={businessData} onSuccess={handlePaymentSuccess} onBack={() => setCurrentStep('form')} />;
  }

  if (currentStep === 'setup') {
    return <SetupInstructions businessData={businessData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                <Star className="w-3 h-3 mr-1" />
                Produto Digital
              </Badge>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {user.email}
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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

          {/* Features Section */}
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

          {/* Pricing */}
          <div className="max-w-md mx-auto mb-12">
            <Card className="border-2 border-green-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
              <CardHeader className="text-center pb-3">
                <Badge className="mx-auto mb-2 bg-green-500 hover:bg-green-600">
                  Oferta Especial
                </Badge>
                <CardTitle className="text-2xl">Chatbot Personalizado</CardTitle>
                <CardDescription>Pronto para seu negócio</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">R$ 29,90</span>
                  <p className="text-sm text-gray-500 line-through">R$ 199,90</p>
                </div>
                <ul className="text-left space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Chatbot totalmente personalizado
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Menu inteligente com 5 opções
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Integração com seu logo
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Suporte completo para instalação
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleStartChatbot}
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perfeito para seu Negócio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seja qual for o seu segmento, nosso chatbot se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Lanchonetes", "Salões de Beleza", "Petshops", "Barbearias", 
              "Depósitos de Água", "Pizzarias", "Lojas de Roupas", "Farmácias"
            ].map((business, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-700">{business}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Logo size="sm" className="justify-center mb-4" />
          <p className="text-gray-400">
            © 2024 BotVendas. Automatize seu atendimento e aumente suas vendas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
