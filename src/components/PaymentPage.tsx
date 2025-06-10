// /seu-componente/PaymentPage.tsx
// ARQUIVO CORRIGIDO E PRONTO

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

  // MUDANÇA PRINCIPAL AQUI DENTRO
  const handleStripePayment = async () => {
    setIsLoading(true);

    try {
      // 1. Pega os dados do usuário autenticado no Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Por favor, faça login para continuar o pagamento.");
        setIsLoading(false);
        return;
      }

      // 2. Chama a Supabase Function enviando os dados do negócio E do usuário
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          businessData: businessData,
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (error) throw error;

      // 3. Redireciona para o Stripe se tudo der certo
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
      {/* O RESTANTE DO SEU CÓDIGO JSX CONTINUA IGUAL, ELE JÁ ESTÁ ÓTIMO! */}
      {/* ... todo o seu JSX ... */}
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
      {/* ... continuação do seu JSX ... */}
    </div>
  );
};

export default PaymentPage;
