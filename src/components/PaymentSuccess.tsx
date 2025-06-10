
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./Logo";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "verified" | "error">("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setPaymentStatus("error");
        return;
      }

      try {
        // Verificar status do pagamento no Supabase
        const { data, error } = await supabase
          .from("pagamentos")
          .select("status")
          .eq("stripe_session_id", sessionId)
          .single();

        if (error || !data) {
          console.error("Erro ao verificar pagamento:", error);
          setPaymentStatus("error");
          return;
        }

        if (data.status === "pago") {
          setPaymentStatus("verified");
          toast.success("Pagamento confirmado com sucesso!");
        } else {
          // Se ainda não foi processado pelo webhook, aguardar um pouco
          setTimeout(verifyPayment, 3000);
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        setPaymentStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 shadow-xl border-0">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Verificando pagamento...</h2>
            <p className="text-gray-600">Aguarde enquanto confirmamos seu pagamento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 shadow-xl border-0">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Erro na verificação</h2>
            <p className="text-gray-600 mb-4">Não foi possível verificar seu pagamento.</p>
            <Button onClick={() => window.location.href = "/"}>
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo size="md" className="justify-center mb-4" />
          <Badge className="mb-4 bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pagamento Confirmado
          </Badge>
        </div>

        {/* Success Card */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Pagamento Realizado com Sucesso!
            </CardTitle>
            <CardDescription className="text-lg">
              Seu chatbot personalizado está sendo preparado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">O que acontece agora:</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Seu chatbot está sendo personalizado com os dados fornecidos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Você receberá as instruções de instalação por email
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Nossa equipe entrará em contato para o suporte
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => toast.success("Instruções enviadas para seu email!")}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Instruções
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Suporte via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>1. Verificar email:</strong> Você receberá um email com todas as instruções de instalação em até 30 minutos.
              </p>
              <p>
                <strong>2. Instalação:</strong> Nossa equipe fornecerá suporte completo para instalar o chatbot no seu WhatsApp Business.
              </p>
              <p>
                <strong>3. Configuração:</strong> Vamos ajudar você a personalizar as respostas e configurar o menu de opções.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
