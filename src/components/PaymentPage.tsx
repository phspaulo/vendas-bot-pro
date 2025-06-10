
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Shield, Star, Check, Loader2, MessageCircle, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./Logo";

interface PaymentPageProps {
  businessData: any;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentPage = ({ businessData, onSuccess, onBack }: PaymentPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStripePayment = async () => {
    setIsLoading(true);

    try {
      // Simula um usuário guest para o checkout
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: businessData?.email || 'guest@example.com'
      };

      // Chama a function do Supabase para criar a sessão de checkout
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          businessData: businessData,
          userId: guestUser.id,
          userEmail: guestUser.email,
          amount: 2990, // R$ 29,90 em centavos
          currency: 'brl'
        },
      });

      if (error) throw error;

      // Redireciona para o Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL da sessão de pagamento não foi recebida.");
      }
    } catch (error: any) {
      console.error("Erro ao criar sessão de checkout:", error);
      toast.error(error.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Logo size="md" />
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Resumo do Seu Chatbot
                </CardTitle>
                <CardDescription>
                  Chatbot personalizado para {businessData?.businessName || 'Seu Negócio'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">📋 Dados do seu negócio:</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nome:</strong> {businessData?.businessName}</div>
                    <div><strong>Segmento:</strong> {businessData?.segment}</div>
                    <div><strong>WhatsApp:</strong> {businessData?.whatsapp}</div>
                    {businessData?.address && <div><strong>Endereço:</strong> {businessData.address}</div>}
                    {businessData?.socialMediaLink && <div><strong>Instagram:</strong> {businessData.socialMediaLink}</div>}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">✨ Funcionalidades incluídas:</h4>
                  {[
                    "Menu interativo inteligente",
                    "5 opções de atendimento automatizado", 
                    "Respostas personalizadas com seus dados",
                    "Redirecionamento para atendimento humano",
                    "Atendimento 24 horas por dia",
                    "Integração completa com WhatsApp",
                    "Suporte técnico para instalação"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefícios */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-700 mb-4">🎯 Por que escolher nosso chatbot:</h4>
                <div className="grid gap-3">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">Aumento de Vendas</span>
                      <p className="text-xs text-gray-600">Converta mais visitantes em clientes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">Economia de Tempo</span>
                      <p className="text-xs text-gray-600">Automatize perguntas frequentes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">Atendimento Profissional</span>
                      <p className="text-xs text-gray-600">Respostas consistentes e rápidas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagamento */}
          <div className="space-y-6">
            <Card className="shadow-2xl border-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <Badge className="bg-green-500 hover:bg-green-600 px-4 py-2">
                    <Star className="w-3 h-3 mr-1" />
                    Oferta Especial
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-gray-800">Chatbot Personalizado</CardTitle>
                <CardDescription className="text-gray-600">
                  Pronto para automatizar seu atendimento
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Preço */}
                <div className="text-center py-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 line-through">De R$ 199,90</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-green-600">R$ 29,90</span>
                      <Badge variant="destructive" className="text-xs">85% OFF</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Pagamento único • Sem mensalidades</p>
                  </div>
                </div>

                <Separator />

                {/* Garantias */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-center">🛡️ Suas Garantias:</h4>
                  <div className="space-y-2">
                    {[
                      "✅ Chatbot 100% funcional",
                      "✅ Suporte completo para instalação", 
                      "✅ Instruções passo a passo",
                      "✅ Garantia de funcionamento",
                      "✅ Atendimento via WhatsApp"
                    ].map((guarantee, index) => (
                      <div key={index} className="text-sm text-gray-600 text-center">
                        {guarantee}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Botão de Pagamento */}
                <div className="space-y-4">
                  <Button
                    onClick={handleStripePayment}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar com Cartão - R$ 29,90
                      </>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">
                      🔒 Pagamento 100% seguro via Stripe
                    </p>
                    <p className="text-xs text-gray-500">
                      Aceita todos os cartões de crédito e débito
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Depoimentos */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic mb-2">
                  "Comprei o chatbot ontem e já está funcionando perfeitamente! 
                  Meus clientes adoraram o atendimento automático."
                </p>
                <p className="text-xs text-gray-500">- Maria, Lanchonete do Bairro</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
