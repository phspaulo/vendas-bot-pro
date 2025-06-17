
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from "sonner";

import BusinessForm from "@/components/BusinessForm";
import PaymentPage from "@/components/PaymentPage";
import SetupInstructions from "@/components/SetupInstructions";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingCard from "@/components/PricingCard";
import BusinessTypesSection from "@/components/BusinessTypesSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'payment' | 'setup'>('landing');
  const [businessData, setBusinessData] = useState(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário logado
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Erro ao obter sessão:", error);
        } else {
          setUser(session?.user ?? null);
          console.log("Sessão obtida:", session?.user ? "Usuário logado" : "Nenhum usuário");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Mudança de autenticação:", event, session?.user ? "Usuário logado" : "Usuário deslogado");
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          setShowAuth(false);
          toast.success("Login realizado com sucesso!");
          setCurrentStep('form');
        }
        if (event === 'SIGNED_OUT') {
          setCurrentStep('landing');
          setBusinessData(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        toast.error("Erro ao fazer logout");
      } else {
        console.log("Logout realizado com sucesso");
        toast.success("Logout realizado com sucesso!");
        setCurrentStep('landing');
        setBusinessData(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Erro inesperado no logout:", error);
      toast.error("Erro inesperado ao fazer logout");
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log("Dados do formulário enviados:", data);
    setBusinessData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    console.log("Pagamento realizado com sucesso");
    setCurrentStep('setup');
  };

  const handleStartChatbot = async () => {
    console.log("Botão 'Criar Chatbot' clicado");
    if (!user) {
      console.log("Usuário não logado, mostrando formulário de autenticação");
      setShowAuth(true);
    } else {
      console.log("Usuário já logado, indo para formulário");
      setCurrentStep('form');
    }
  };

  const handleAuthSuccess = async () => {
    console.log("Autenticação bem-sucedida");
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

  const handleBackToLanding = () => {
    console.log("Voltando para landing page");
    setCurrentStep('landing');
  };

  const handleBackToForm = () => {
    console.log("Voltando para formulário");
    setCurrentStep('form');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentStep === 'form') {
    return <BusinessForm onSubmit={handleFormSubmit} onBack={handleBackToLanding} />;
  }

  if (currentStep === 'payment') {
    return <PaymentPage businessData={businessData} onSuccess={handlePaymentSuccess} onBack={handleBackToForm} />;
  }

  if (currentStep === 'setup') {
    return <SetupInstructions businessData={businessData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header user={user} onLogout={handleLogout} />
      
      <HeroSection user={user} onStartChatbot={handleStartChatbot} />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <FeaturesGrid />
        <PricingCard />
      </div>
      
      <BusinessTypesSection />
      <GuaranteeSection />
      <Footer />
    </div>
  );
};

export default Index;
