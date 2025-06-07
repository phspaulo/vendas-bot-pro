
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Copy, Shield, Star, Check } from "lucide-react";
import { toast } from "sonner";

interface PaymentPageProps {
  businessData: any;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentPage = ({ businessData, onSuccess, onBack }: PaymentPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pix'>('stripe');
  
  const pixData = {
    key: "00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540599.905802BR5925BOTVENDAS AUTOMACAO LTDA6009SAO PAULO61081234567062160512202412076543050300017BR.GOV.BCB.BRCODE01051.0.063041C85",
    name: "BotVendas Automação Ltda",
    bank: "Banco do Brasil",
    agency: "1234-5",
    account: "67890-1"
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixData.key);
    toast.success("Chave PIX copiada!");
  };

  const handleStripePayment = () => {
    // Open Stripe checkout in a new tab
    window.open("https://buy.stripe.com/3cIbJ1g3Z2Ry45VfdcbMQ01", '_blank');
    
    // Simulate payment success after a delay (in real implementation, you'd verify payment)
    setTimeout(() => {
      toast.success("Pagamento confirmado!");
      onSuccess();
    }, 3000);
  };

  const handlePixPayment = () => {
    toast.success("Aguardando confirmação do pagamento PIX...");
    // In real implementation, you'd integrate with payment verification
    setTimeout(() => {
      toast.success("Pagamento PIX confirmado!");
      onSuccess();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-blue-50"
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
                Escolha como deseja pagar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <Badge className="mb-3 bg-green-500 hover:bg-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Oferta Especial
                </Badge>
                <div className="text-3xl font-bold text-green-600 mb-1">R$ 199,90</div>
                <p className="text-sm text-gray-500 line-through">R$ 399,90</p>
                <p className="text-xs text-gray-600 mt-2">Pagamento único • Sem mensalidades</p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                {/* Stripe Payment */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`} onClick={() => setPaymentMethod('stripe')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'stripe' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                      </div>
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Elo</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* PIX Payment */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'pix' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`} onClick={() => setPaymentMethod('pix')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        paymentMethod === 'pix' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'pix' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                      </div>
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-gray-500">Pagamento instantâneo</p>
                      </div>
                    </div>
                    <div className="w-8 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      PIX
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              {paymentMethod === 'stripe' ? (
                <Button 
                  onClick={handleStripePayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  Pagar com Cartão - R$ 199,90
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-medium text-green-800 mb-2">Dados para PIX:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Favorecido:</span> {pixData.name}
                      </div>
                      <div>
                        <span className="font-medium">Banco:</span> {pixData.bank}
                      </div>
                      <div>
                        <span className="font-medium">Valor:</span> R$ 199,90
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Chave PIX:</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={pixData.key}
                        readOnly
                        className="flex-1 p-2 border border-gray-200 rounded-lg bg-gray-50 text-xs"
                      />
                      <Button onClick={copyPixKey} variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePixPayment}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    Confirmar Pagamento PIX
                  </Button>
                </div>
              )}

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
