
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, MessageCircle, ArrowRight, Star, Gift } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";

const PaymentSuccess = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Código do chatbot personalizado
  const chatbotCode = `const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR Code gerado! Escaneie com seu WhatsApp.');
});

client.on('ready', () => {
    console.log('✅ Seu Chatbot está online!');
});

client.on('message', async (message) => {
    const userMessage = message.body.toLowerCase();
    const senderName = message._data.notifyName || 'Cliente';
    
    // Menu principal
    if (userMessage === 'menu' || userMessage === 'oi' || userMessage === 'olá' || userMessage === 'começar') {
        const menuText = \`🤖 *Olá \${senderName}! Bem-vindo(a) ao nosso atendimento!*

📋 *Menu de Atendimento:*

*1* - ℹ️ Informações sobre produtos/serviços
*2* - 💰 Preços e formas de pagamento  
*3* - ✨ Benefícios e vantagens
*4* - 🚀 Como fazer pedido
*5* - 👨‍💼 Falar com atendente

Digite o *número* da opção desejada!\`;
        
        await message.reply(menuText);
    }
    
    // Opção 1 - Informações
    else if (userMessage === '1') {
        const responseText = \`📋 *Informações sobre nossos produtos/serviços:*

🏪 Somos uma empresa comprometida com a qualidade e satisfação dos nossos clientes.

💼 *Nossos diferenciais:*
• Atendimento especializado
• Produtos/serviços de alta qualidade
• Entrega rápida e eficiente
• Suporte completo ao cliente

🕒 *Horário de funcionamento:*
Segunda a Sexta: 8h às 18h
Sábado: 8h às 14h

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 2 - Preços
    else if (userMessage === '2') {
        const responseText = \`💰 *Preços e Formas de Pagamento:*

💳 *Aceitamos:*
• Dinheiro
• PIX (com desconto especial!)
• Cartão de débito/crédito
• Transferência bancária

🎯 *Promoções:*
• 10% de desconto no PIX
• Parcelamento em até 3x sem juros
• Desconto para clientes fiéis

📞 Para orçamentos detalhados, digite *5* para falar com nosso atendente.

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 3 - Benefícios
    else if (userMessage === '3') {
        const responseText = \`✨ *Benefícios e Vantagens:*

🏆 *Por que escolher nossa empresa:*

⭐ Qualidade garantida
⚡ Atendimento rápido
🔒 Segurança e confiança  
💯 Satisfação garantida
🎁 Programas de fidelidade
📱 Atendimento 24/7 pelo WhatsApp

🌟 *Diferenciais exclusivos:*
• Experiência no mercado
• Clientes satisfeitos
• Produtos/serviços certificados
• Equipe especializada

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 4 - Como fazer pedido
    else if (userMessage === '4') {
        const responseText = \`🚀 *Como Fazer seu Pedido:*

📞 *É muito fácil! Siga os passos:*

1️⃣ Entre em contato conosco
2️⃣ Solicite seu orçamento gratuito
3️⃣ Escolha a melhor opção
4️⃣ Confirme seu pedido
5️⃣ Receba com rapidez e qualidade!

📱 *Para continuar:*
Digite *5* para falar com nosso atendente
ou
Digite *menu* para ver outras opções

⏰ *Resposta em até 30 minutos!*

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 5 - Atendente
    else if (userMessage === '5') {
        const responseText = \`👨‍💼 *Atendimento Personalizado*

Olá! Você será direcionado para um de nossos atendentes especializados.

💬 *Um momento que já vamos te atender!*

Em breve, um membro da nossa equipe entrará em contato para:
• Tirar suas dúvidas
• Fazer seu orçamento personalizado
• Ajudar com seu pedido
• Oferecer o melhor atendimento

✅ *Aguarde que logo responderemos!*

Digite *menu* se quiser ver outras opções.\`;
        
        await message.reply(responseText);
    }
    
    // Mensagem padrão
    else {
        const defaultText = \`🤖 Olá! Não entendi sua mensagem.

Digite *menu* para ver todas as opções disponíveis.

Ou escolha uma das opções rápidas:
• *1* - Informações
• *2* - Preços  
• *3* - Benefícios
• *4* - Como fazer pedido
• *5* - Falar com atendente\`;
        
        await message.reply(defaultText);
    }
});

client.initialize();`;

  const downloadChatbot = () => {
    setIsDownloading(true);
    
    const element = document.createElement("a");
    const file = new Blob([chatbotCode], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = "meu-chatbot-whatsapp.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Chatbot baixado com sucesso! 🎉");
    }, 1000);
  };

  const openWhatsAppSupport = () => {
    const message = "Olá! Acabei de adquirir o chatbot para WhatsApp e gostaria de suporte para instalação. 🤖";
    const phone = "5511999999999"; // Número de suporte
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">Pagamento Confirmado! 🎉</h1>
              <p className="text-xl text-gray-600">Seu chatbot está pronto para download</p>
            </div>
          </div>
          
          <Logo size="lg" className="justify-center mb-4" />
          
          <div className="flex justify-center space-x-4 mb-6">
            <Badge className="bg-green-500 hover:bg-green-600 px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              Produto Digital
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-600 px-4 py-2">
              <Gift className="w-4 h-4 mr-1" />
              Pronto para Usar
            </Badge>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="shadow-2xl border-0 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Seu Chatbot de WhatsApp
            </CardTitle>
            <CardDescription className="text-green-100">
              Automatize seu atendimento e aumente suas vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  ✅ O que você recebeu:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Chatbot totalmente funcional</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Menu interativo com 5 opções</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Respostas automáticas personalizadas</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Redirecionamento para atendimento humano</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Suporte completo para instalação</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  🚀 Próximos passos:
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    <span>Baixe o arquivo do chatbot</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    <span>Instale Node.js no seu computador</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    <span>Execute o chatbot seguindo as instruções</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    <span>Conecte seu WhatsApp escaneando o QR Code</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                    <span>Comece a automatizar seu atendimento!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Button 
                onClick={downloadChatbot}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Download className="w-5 h-5 mr-2 animate-pulse" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Meu Chatbot
                  </>
                )}
              </Button>
              
              <Button 
                onClick={openWhatsAppSupport}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 py-6 text-lg rounded-xl"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Preciso de Ajuda - Suporte WhatsApp
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instruções de Instalação */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl text-center">📖 Instruções de Instalação</CardTitle>
            <CardDescription className="text-center">
              Siga estes passos para colocar seu chatbot no ar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold mb-4">💻 Requisitos:</h4>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Computador com Windows, Mac ou Linux</li>
                <li>• Conexão estável com a internet</li>
                <li>• Node.js instalado (baixe em nodejs.org)</li>
                <li>• WhatsApp no celular</li>
              </ul>

              <h4 className="font-semibold mb-4">⚙️ Como instalar:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Baixe o arquivo do chatbot acima</li>
                <li>2. Crie uma pasta no seu computador (ex: "MeuChatbot")</li>
                <li>3. Coloque o arquivo baixado dentro da pasta</li>
                <li>4. Abra o terminal/prompt na pasta</li>
                <li>5. Execute: <code className="bg-gray-200 px-2 py-1 rounded">npm install whatsapp-web.js qrcode-terminal</code></li>
                <li>6. Execute: <code className="bg-gray-200 px-2 py-1 rounded">node meu-chatbot-whatsapp.js</code></li>
                <li>7. Escaneie o QR Code com seu WhatsApp</li>
                <li>8. Pronto! Seu chatbot está funcionando!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>© 2024 BotVendas - Automatize seu atendimento e aumente suas vendas</p>
          <p className="text-sm mt-2">
            Dúvidas? Entre em contato pelo nosso suporte via WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
