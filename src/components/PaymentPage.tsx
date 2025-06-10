
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Shield, Star, Check, Loader2 } from "lucide-react";
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
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { businessData }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirecionar para o Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("URL da sessão não recebida");
      }
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Logo */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Logo size="md" />
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              <Star className="w-3 h-3 mr-1" />
              Produto Digital
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-blue-50"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600">
              Último passo para ter seu chatbot personalizado
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Resumo do Pedido
              </CardTitle>
              <CardDescription>
                Confira os dados do seu chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700">Negócio:</p>
                <p className="text-gray-600">{businessData?.businessName}</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-700">Segmento:</p>
                <Badge variant="secondary">{businessData?.segment}</Badge>
              </div>
              
              <div>
                <p className="font-semibold text-gray-700">WhatsApp:</p>
                <p className="text-gray-600">{businessData?.whatsapp}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Email:</p>
                <p className="text-gray-600">{businessData?.email}</p>
              </div>

              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">O que você receberá:</h3>
                <div className="space-y-2">
                  {[ 
                    "Chatbot personalizado com nome do seu negócio",
                    "Menu inteligente com 5 opções de atendimento",
                    "Integração com seu logo",
                    "Respostas automáticas 24/7",
                    "Suporte completo para instalação"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Forma de Pagamento
              </CardTitle>
              <CardDescription>
                Pague com cartão de crédito via Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <Badge className="mb-3 bg-green-500 hover:bg-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Oferta Especial
                </Badge>
                <div className="text-3xl font-bold text-green-600 mb-1">R$ 29,90</div>
                <p className="text-sm text-gray-500 line-through">R$ 199,90</p>
                <p className="text-xs text-gray-600 mt-2">Pagamento único • Sem mensalidades</p>
              </div>

              {/* Stripe Button */}
              <Button 
                onClick={handleStripePayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Pagar com Cartão - R$ 29,90"
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Pagamento 100% seguro e protegido
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
