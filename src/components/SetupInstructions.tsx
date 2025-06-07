
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  QrCode, 
  Download, 
  Github, 
  CheckCircle, 
  AlertCircle,
  Monitor,
  Wifi,
  HardDrive,
  Bot,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface SetupInstructionsProps {
  businessData: any;
}

const SetupInstructions = ({ businessData }: SetupInstructionsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const botCode = `const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR Code gerado! Escaneie com seu WhatsApp.');
});

client.on('ready', () => {
    console.log('✅ ${businessData?.businessName || 'Seu Chatbot'} está online!');
});

client.on('message', async (message) => {
    const userMessage = message.body.toLowerCase();
    const senderName = message._data.notifyName || 'Cliente';
    
    // Menu principal
    if (userMessage === 'menu' || userMessage === 'oi' || userMessage === 'olá' || userMessage === 'começar') {
        const menuText = \`🤖 *Olá \${senderName}! Bem-vindo(a) à ${businessData?.businessName || 'Nosso Negócio'}!*

📋 *Menu de Atendimento:*

*1* - ℹ️ O que é e como funciona
*2* - 💰 Valor e formas de pagamento  
*3* - ✨ Benefícios e vantagens
*4* - 🚀 Como começar
*5* - ❓ Outras dúvidas

Digite o *número* da opção desejada!\`;
        
        await message.reply(menuText);
    }
    
    // Opção 1 - O que é e como funciona
    else if (userMessage === '1') {
        const responseText = \`📋 *O que é e como funciona:*

🏪 Somos uma **${businessData?.segment || 'empresa'}** localizada em:
📍 ${businessData?.address || 'Nosso endereço'}

💼 *Nossos serviços incluem:*
• Atendimento especializado
• Produtos/serviços de qualidade
• Entrega rápida e eficiente
• Suporte completo ao cliente

🕒 *Horário de funcionamento:*
Segunda a Sexta: 8h às 18h
Sábado: 8h às 14h

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 2 - Valor e pagamento
    else if (userMessage === '2') {
        const responseText = \`💰 *Valores e Formas de Pagamento:*

💳 *Aceitamos:*
• Dinheiro
• PIX (com desconto!)
• Cartão de débito/crédito
• Transferência bancária

🎯 *Promoções especiais:*
• 10% de desconto no PIX
• Parcelamento em até 3x sem juros
• Desconto para clientes fiéis

📞 Para orçamentos personalizados:
WhatsApp: ${businessData?.whatsapp || '(11) 99999-9999'}

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 3 - Benefícios
    else if (userMessage === '3') {
        const responseText = \`✨ *Benefícios e Vantagens:*

🏆 *Por que escolher a ${businessData?.businessName || 'nossa empresa'}:*

⭐ Qualidade garantida
⚡ Atendimento rápido
🔒 Segurança e confiança  
💯 Satisfação garantida
🎁 Programas de fidelidade
📱 Atendimento 24/7 pelo WhatsApp

🌟 *Diferenciais exclusivos:*
• Mais de X anos no mercado
• Centenas de clientes satisfeitos
• Produtos/serviços certificados
• Equipe especializada

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 4 - Como começar
    else if (userMessage === '4') {
        const responseText = \`🚀 *Como Começar:*

📞 *É muito fácil! Siga os passos:*

1️⃣ Entre em contato conosco
2️⃣ Faça seu orçamento gratuito
3️⃣ Escolha a melhor opção
4️⃣ Finalize seu pedido
5️⃣ Receba com rapidez e qualidade!

📱 *Contatos para atendimento:*
WhatsApp: ${businessData?.whatsapp || '(11) 99999-9999'}
${businessData?.socialMediaLink ? '🌐 Instagram: ' + businessData.socialMediaLink : ''}

⏰ *Resposta em até 30 minutos!*

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Opção 5 - Outras dúvidas
    else if (userMessage === '5') {
        const responseText = \`❓ *Outras Dúvidas:*

🤝 *Atendimento Personalizado*

Para dúvidas específicas, sugestões ou atendimento personalizado, fale diretamente com nossa equipe:

📱 *WhatsApp:* ${businessData?.whatsapp || '(11) 99999-9999'}
⏰ *Horário:* Segunda a Sexta, 8h às 18h

💬 *Principais dúvidas:*
• Formas de entrega
• Prazos e garantias  
• Produtos/serviços especiais
• Programas de fidelidade

✅ *Resposta garantida em até 30 minutos!*

Digite *menu* para voltar ao início!\`;
        
        await message.reply(responseText);
    }
    
    // Comando especial para envio do logo
    else if (userMessage === 'teste' || userMessage === 'logo') {
        if (message.hasMedia) {
            // Se já há mídia, não faz nada
        } else {
            try {
                // Aqui você colocaria o caminho para o logo enviado
                const media = MessageMedia.fromFilePath('./logo.jpg');
                await client.sendMessage(message.from, media, {
                    caption: \`📸 *Logo da ${businessData?.businessName || 'Nossa Empresa'}*\n\nEste é nosso logo oficial! 🎯\n\nDigite *menu* para ver nossas opções.\`
                });
            } catch (error) {
                await message.reply('Logo não encontrado. Certifique-se de colocar o arquivo logo.jpg na pasta do projeto.');
            }
        }
    }
    
    // Mensagem padrão para comandos não reconhecidos
    else {
        const defaultText = \`🤖 Olá! Não entendi sua mensagem.

Digite *menu* para ver todas as opções disponíveis.

Ou escolha uma das opções rápidas:
• *1* - Informações
• *2* - Preços  
• *3* - Benefícios
• *4* - Como começar
• *5* - Falar com atendente\`;
        
        await message.reply(defaultText);
    }
});

client.initialize();`;

  const requirements = [
    "Computador com Windows, Mac ou Linux",
    "Conexão estável com a internet",
    "Pelo menos 2GB de memória RAM livre",
    "Node.js instalado (versão 16 ou superior)",
    "WhatsApp instalado no celular"
  ];

  const copyCode = () => {
    navigator.clipboard.writeText(botCode);
    toast.success("Código copiado para a área de transferência!");
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([botCode], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = `chatbot-${businessData?.businessName?.toLowerCase().replace(/\s+/g, '-') || 'personalizado'}.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Código baixado com sucesso!");
  };

  const openWhatsApp = () => {
    const phone = businessData?.whatsapp?.replace(/\D/g, '') || '5511999999999';
    const message = `Olá! Acabei de adquirir o chatbot personalizado para meu negócio "${businessData?.businessName}" e gostaria de suporte para instalação. 🤖`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-green-600">Pagamento Confirmado! 🎉</h1>
              <p className="text-gray-600">Seu chatbot está pronto para ser configurado</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="requirements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="setup">Instalação</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          {/* Requirements Tab */}
          <TabsContent value="requirements">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                  Requisitos do Sistema
                </CardTitle>
                <CardDescription>
                  Verifique se seu computador atende aos requisitos mínimos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">✅ Requisitos Mínimos:</h3>
                    <div className="space-y-3">
                      {requirements.map((req, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">⚠️ Importante:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">O computador deve ficar ligado para o bot funcionar</span>
                      </div>
                      <div className="flex items-start">
                        <Wifi className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Mantenha a conexão com internet sempre ativa</span>
                      </div>
                      <div className="flex items-start">
                        <HardDrive className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Cerca de 500MB de espaço livre no disco</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Download Tab */}
          <TabsContent value="download">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-green-600" />
                  Seu Chatbot Personalizado
                </CardTitle>
                <CardDescription>
                  Baixe o código do seu chatbot já configurado para {businessData?.businessName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Código do Chatbot</h4>
                    <div className="flex space-x-2">
                      <Button onClick={copyCode} variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs text-gray-600 bg-white p-3 rounded border max-h-60 overflow-auto">
                    {botCode.substring(0, 500)}...
                  </pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={downloadCode} className="bg-green-600 hover:bg-green-700" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Código (.js)
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('https://github.com', '_blank')} 
                    variant="outline" 
                    size="lg"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Salvar no GitHub
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Funcionalidades incluídas:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Menu interativo com 5 opções</li>
                    <li>• Respostas personalizadas com dados do seu negócio</li>
                    <li>• Envio automático do logo ao digitar "teste"</li>
                    <li>• Atendimento 24/7 automatizado</li>
                    <li>• Redirecionamento para atendimento humano</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-purple-600" />
                  Instalação Passo a Passo
                </CardTitle>
                <CardDescription>
                  Siga estas instruções para colocar seu chatbot no ar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Instalar Node.js",
                      description: "Baixe e instale o Node.js no seu computador",
                      action: "Acesse nodejs.org e baixe a versão LTS"
                    },
                    {
                      step: 2,
                      title: "Criar pasta do projeto",
                      description: "Crie uma pasta para o seu chatbot",
                      action: "Exemplo: 'Chatbot-MinhaEmpresa' na área de trabalho"
                    },
                    {
                      step: 3,
                      title: "Salvar o código",
                      description: "Cole o código baixado em um arquivo .js",
                      action: "Salve como 'bot.js' dentro da pasta criada"
                    },
                    {
                      step: 4,
                      title: "Instalar dependências",
                      description: "Abra o terminal na pasta e execute:",
                      action: "npm install whatsapp-web.js qrcode-terminal"
                    },
                    {
                      step: 5,
                      title: "Executar o bot",
                      description: "Execute o comando para iniciar:",
                      action: "node bot.js"
                    },
                    {
                      step: 6,
                      title: "Escanear QR Code",
                      description: "Use seu celular para escanear o QR Code",
                      action: "WhatsApp > Menu > Dispositivos vinculados"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-700 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                          {item.action}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  Suporte e Ajuda
                </CardTitle>
                <CardDescription>
                  Precisa de ajuda? Estamos aqui para você!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Atendimento Personalizado</h3>
                  <p className="text-gray-600 mb-6">
                    Nossa equipe especializada está pronta para te ajudar com a instalação e configuração do seu chatbot.
                  </p>
                  
                  <Button 
                    onClick={openWhatsApp}
                    className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar com Suporte
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">🚀 O que oferecemos:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Suporte para instalação completa</li>
                      <li>• Configuração personalizada</li>
                      <li>• Teste e validação do funcionamento</li>
                      <li>• Treinamento básico de uso</li>
                      <li>• Resolução de problemas técnicos</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">⏰ Horário de atendimento:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Segunda a Sexta: 8h às 18h</li>
                      <li>• Sábado: 8h às 14h</li>
                      <li>• Resposta em até 30 minutos</li>
                      <li>• Suporte via WhatsApp</li>
                      <li>• Atendimento em português</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-medium text-amber-800 mb-2">💡 Dicas importantes:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Mantenha o computador sempre ligado para o bot funcionar</li>
                    <li>• Teste todas as funcionalidades após a instalação</li>
                    <li>• Personalize as mensagens conforme sua necessidade</li>
                    <li>• Entre em contato se tiver dúvidas ou problemas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SetupInstructions;
