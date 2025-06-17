
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, MessageCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "./Logo";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('ID da sessão não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Verificando pagamento para sessão:', sessionId);
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        console.log('✅ Dados do pagamento verificados:', data);
        
        if (data.isPaid) {
          setPaymentData(data);
          toast.success('Pagamento confirmado com sucesso!');
        } else {
          setError('Pagamento ainda não foi processado');
        }
      } catch (err: any) {
        console.error('❌ Erro ao verificar pagamento:', err);
        setError(err.message || 'Erro ao verificar pagamento');
        toast.error('Erro ao verificar pagamento');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const generateChatbotScript = () => {
    if (!paymentData?.businessData) return '';

    const { businessName, segment, whatsapp, address, socialMediaLink } = paymentData.businessData;
    
    return `// 🤖 CHATBOT PERSONALIZADO PARA ${businessName.toUpperCase()}
// Gerado automaticamente - BotVendas.com

const chatbotConfig = {
  businessName: "${businessName}",
  segment: "${segment}",
  whatsapp: "${whatsapp}",
  address: "${address}",
  socialMedia: "${socialMediaLink}",
};

// Função principal do chatbot
function initializeChatbot() {
  const menuOptions = [
    "1️⃣ Ver nossos produtos/serviços",
    "2️⃣ Informações sobre localização",
    "3️⃣ Horário de funcionamento", 
    "4️⃣ Promoções especiais",
    "5️⃣ Falar com atendente"
  ];

  const welcomeMessage = \`
🎉 Olá! Bem-vindo(a) à *\${chatbotConfig.businessName}*!

Somos especialistas em \${chatbotConfig.segment.toLowerCase()} e estamos aqui para te atender da melhor forma.

📍 *Localização:* \${chatbotConfig.address}
${socialMediaLink ? `📱 *Instagram:* \${chatbotConfig.socialMedia}` : ''}

*Como posso te ajudar hoje?*

\${menuOptions.join('\\n')}

Digite o número da opção desejada! 👆
\`;

  // Respostas automáticas
  const responses = {
    "1": \`
🛍️ *Nossos Produtos/Serviços*

Trabalhamos com o que há de melhor em \${chatbotConfig.segment.toLowerCase()}!

${segment === 'Lanchonete' ? '🍔 Hambúrguers artesanais\\n🍕 Pizzas saborosas\\n🥤 Bebidas geladas\\n🍟 Porções especiais' : 
  segment === 'Salão de Beleza' ? '💇‍♀️ Cortes e penteados\\n💅 Manicure e pedicure\\n🎨 Coloração profissional\\n✨ Tratamentos capilares' :
  segment === 'Petshop' ? '🐕 Banho e tosa\\n🦴 Ração premium\\n🏥 Consultas veterinárias\\n🎾 Brinquedos e acessórios' :
  '🔥 Produtos e serviços de qualidade\\n⭐ Atendimento especializado\\n💯 Melhores preços da região'}

Para mais detalhes, digite *5* para falar com nosso atendente!
\`,
    "2": \`
📍 *Nossa Localização*

\${chatbotConfig.address}

🚗 Fácil acesso e estacionamento
🗺️ Ponto de referência: [Descreva um ponto próximo]

Digite *5* se precisar de mais informações sobre como chegar!
\`,
    "3": \`
🕒 *Horário de Funcionamento*

📅 Segunda à Sexta: 08:00 às 18:00
📅 Sábado: 08:00 às 16:00  
📅 Domingo: Fechado

⚠️ *Importante:* Nossos horários podem variar em feriados.

Para confirmação, digite *5* para falar conosco!
\`,
    "4": \`
🎁 *Promoções Especiais*

🔥 Temos sempre ofertas imperdíveis para você!

${segment === 'Lanchonete' ? '• 2 Hambúrguers por R$ 25,00\\n• Pizza família + refrigerante por R$ 35,00' :
  segment === 'Salão de Beleza' ? '• Pacote completo (corte + escova + unha) por R$ 80,00\\n• Progressiva com 30% de desconto' :
  '• Promoções especiais toda semana\\n• Descontos para clientes fiéis'}

📲 Digite *5* para saber mais detalhes com nosso atendente!
\`,
    "5": \`
👥 *Conectando com Atendente...*

Um momento! Você será transferido para um de nossos atendentes.

📞 *WhatsApp:* \${chatbotConfig.whatsapp}
⏰ *Tempo de resposta:* Até 5 minutos

Obrigado por escolher a *\${chatbotConfig.businessName}*! 🙏
\`
  };

  return {
    welcomeMessage,
    responses,
    config: chatbotConfig
  };
}

// Exportar o chatbot
window.chatbot = initializeChatbot();
console.log("🤖 Chatbot inicializado para", chatbotConfig.businessName);`;
  };

  const downloadChatbot = () => {
    const script = generateChatbotScript();
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-${paymentData.businessData.businessName.toLowerCase().replace(/\s+/g, '-')}.js`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Chatbot baixado com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Verificando seu pagamento...</h2>
            <p className="text-gray-600">Aguarde enquanto confirmamos sua compra</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Erro na Verificação</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link to="/">
              <Button variant="outline">Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <Badge className="bg-green-500 hover:bg-green-600 mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Pagamento Confirmado
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Confirmação */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-green-600">
                <CheckCircle className="w-6 h-6 mr-3" />
                Pagamento Aprovado!
              </CardTitle>
              <CardDescription>
                Seu chatbot personalizado está pronto para download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Resumo da Compra</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div><strong>Produto:</strong> Chatbot WhatsApp Personalizado</div>
                  <div><strong>Valor:</strong> R$ {(paymentData.amount / 100).toFixed(2)}</div>
                  <div><strong>Status:</strong> Pago</div>
                  <div><strong>Negócio:</strong> {paymentData.businessData.businessName}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">📦 O que você recebeu:</h4>
                <div className="space-y-2">
                  {[
                    "Chatbot 100% personalizado para seu negócio",
                    "Menu interativo com 5 opções principais",
                    "Respostas automáticas personalizadas",
                    "Código JavaScript pronto para usar",
                    "Instruções completas de instalação",
                    "Suporte via WhatsApp"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Download className="w-5 h-5 mr-2 text-blue-600" />
                Baixar seu Chatbot
              </CardTitle>
              <CardDescription>
                Chatbot personalizado para {paymentData.businessData.businessName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🤖 Seu Chatbot Inclui:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <div>• Mensagem de boas-vindas personalizada</div>
                  <div>• Menu com 5 opções de atendimento</div>
                  <div>• Informações do seu negócio</div>
                  <div>• Redirecionamento para WhatsApp</div>
                  <div>• Código limpo e documentado</div>
                </div>
              </div>

              <Button
                onClick={downloadChatbot}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Chatbot Agora
              </Button>

              <div className="text-center">
                <Link to="/setup-instructions" state={{ businessData: paymentData.businessData }}>
                  <Button variant="outline" className="w-full">
                    Ver Instruções de Instalação
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suporte */}
        <Card className="mt-8 shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold mb-2">Precisa de Ajuda?</h3>
            <p className="text-gray-600 mb-4">
              Nossa equipe está pronta para te ajudar com a instalação
            </p>
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => window.open(`https://wa.me/5511999999999?text=Olá! Comprei o chatbot para ${paymentData.businessData.businessName} e preciso de ajuda com a instalação.`, '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Suporte via WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
