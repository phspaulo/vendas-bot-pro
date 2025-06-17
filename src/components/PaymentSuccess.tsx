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

    const { businessName, segment, whatsapp, address, socialMediaLink, description } = paymentData.businessData;
    
    return `// 🤖 CHATBOT PERSONALIZADO PARA ${businessName.toUpperCase()}
// Gerado automaticamente - BotVendas.com

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('📱 QR Code gerado! Escaneie com seu WhatsApp para conectar o chatbot.');
});

client.on('ready', () => {
    console.log('✅ ${businessName} - Chatbot está online e funcionando!');
});

client.on('message', async (message) => {
    // Evita responder mensagens próprias e de grupos
    if (message.fromMe || message.from.includes('@g.us')) return;
    
    const userMessage = message.body.toLowerCase().trim();
    const senderName = message._data.notifyName || 'Cliente';
    
    console.log(\`📩 Mensagem recebida de \${senderName}: \${userMessage}\`);
    
    // Menu principal - palavras de ativação
    if (['menu', 'oi', 'olá', 'ola', 'começar', 'iniciar', 'help', 'ajuda'].includes(userMessage)) {
        const menuText = \`🤖 *Olá \${senderName}! Bem-vindo(a) à ${businessName}!*

${description ? '📋 ' + description : ''}

📍 *Localização:* ${address}
${socialMediaLink ? '📱 *Redes Sociais:* ' + socialMediaLink : ''}

*📋 Menu de Atendimento:*

*1* - ℹ️ Informações sobre nossos ${segment === 'Lanchonete' ? 'produtos' : segment === 'Salão de Beleza' ? 'serviços' : segment === 'Petshop' ? 'serviços' : 'produtos/serviços'}
*2* - 💰 Preços e formas de pagamento  
*3* - 📍 Localização e horários
*4* - 🎁 Promoções especiais
*5* - 👥 Falar com atendente

Digite o *número* da opção desejada! 🔢\`;
        
        await message.reply(menuText);
        return;
    }
    
    // Opção 1 - Informações sobre produtos/serviços
    if (userMessage === '1') {
        let serviceText = '';
        
        switch('${segment}') {
            case 'Lanchonete':
                serviceText = \`🍔 *Nossos Deliciosos Produtos:*

🥪 *Sanduíches e Hambúrguers:*
• Hambúrguer artesanal
• X-Bacon especial  
• Sanduíche natural
• Vegetariano gourmet

🍕 *Pizzas:*
• Pizza margherita
• Pizza portuguesa
• Pizza calabresa
• Pizza especial da casa

🥤 *Bebidas:*
• Sucos naturais
• Refrigerantes
• Vitaminas
• Café expresso

🍟 *Acompanhamentos:*
• Batata frita
• Onion rings
• Salada verde
• Porções especiais\`;
                break;
                
            case 'Salão de Beleza':
                serviceText = \`💄 *Nossos Serviços de Beleza:*

💇‍♀️ *Cabelos:*
• Corte feminino e masculino
• Escova e penteados
• Coloração profissional
• Luzes e mechas
• Progressiva e relaxamento
• Hidratação profunda

💅 *Unhas:*
• Manicure tradicional
• Pedicure completo
• Unhas em gel
• Nail art
• Spa para as mãos

✨ *Tratamentos:*
• Limpeza de pele
• Design de sobrancelhas
• Aplicação de cílios
• Massagem relaxante\`;
                break;
                
            case 'Petshop':
                serviceText = \`🐕 *Nossos Serviços Pet:*

🛁 *Banho e Tosa:*
• Banho relaxante
• Tosa higiênica
• Tosa na máquina
• Tosa artística
• Hidratação dos pelos

🏥 *Cuidados Veterinários:*
• Consultas gerais
• Vacinação
• Vermifugação
• Microchipagem
• Exames laboratoriais

🛒 *Produtos:*
• Ração premium
• Petiscos e ossinhos
• Brinquedos
• Camas e casinhas
• Coleiras e guias
• Produtos de higiene\`;
                break;
                
            default:
                serviceText = \`🏪 *Nossos Produtos e Serviços:*

✨ Trabalhamos com produtos e serviços de alta qualidade em ${segment.toLowerCase()}.

🎯 *Principais ofertas:*
• Atendimento especializado e personalizado
• Produtos selecionados e de qualidade
• Preços competitivos no mercado
• Garantia em todos os serviços
• Equipe profissional e experiente

💯 *Nosso compromisso:*
• Satisfação do cliente em primeiro lugar
• Qualidade garantida
• Atendimento rápido e eficiente\`;
        }
        
        const responseText = \`\${serviceText}

📞 *Para mais informações:*
WhatsApp: ${whatsapp}

Digite *menu* para voltar ao início! 🏠\`;
        
        await message.reply(responseText);
        return;
    }
    
    // Opção 2 - Preços e pagamento
    if (userMessage === '2') {
        let priceText = '';
        
        switch('${segment}') {
            case 'Lanchonete':
                priceText = \`💰 *Tabela de Preços:*

🍔 *Hambúrguers:*
• Hambúrguer simples: R$ 12,00
• X-Bacon: R$ 15,00
• X-Tudo: R$ 18,00
• Vegetariano: R$ 14,00

🍕 *Pizzas:*
• Pizza individual: R$ 16,00
• Pizza média: R$ 28,00
• Pizza família: R$ 35,00

🥤 *Bebidas:*
• Refrigerante lata: R$ 4,00
• Suco natural: R$ 6,00
• Água: R$ 2,50\`;
                break;
                
            case 'Salão de Beleza':
                priceText = \`💰 *Tabela de Preços:*

💇‍♀️ *Cabelos:*
• Corte feminino: R$ 35,00
• Corte masculino: R$ 25,00
• Escova: R$ 20,00
• Coloração: R$ 80,00
• Progressiva: R$ 120,00

💅 *Unhas:*
• Manicure: R$ 15,00
• Pedicure: R$ 20,00
• Unhas em gel: R$ 35,00

✨ *Tratamentos:*
• Limpeza de pele: R$ 45,00
• Design sobrancelha: R$ 15,00\`;
                break;
                
            case 'Petshop':
                priceText = \`💰 *Tabela de Preços:*

🛁 *Banho e Tosa:*
• Banho (cães pequenos): R$ 25,00
• Banho (cães médios): R$ 35,00
• Banho (cães grandes): R$ 45,00
• Tosa completa: +R$ 15,00

🏥 *Consultas:*
• Consulta veterinária: R$ 80,00
• Vacinas: R$ 45,00 cada
• Vermifugação: R$ 25,00\`;
                break;
                
            default:
                priceText = \`💰 *Informações sobre Preços:*

🏷️ Trabalhamos com preços justos e competitivos no mercado de ${segment.toLowerCase()}.

💳 *Condições especiais:*
• Primeira compra com desconto
• Pacotes promocionais
• Descontos para clientes fiéis\`;
        }
        
        const responseText = \`\${priceText}

💳 *Formas de Pagamento:*
• Dinheiro (10% desconto)
• PIX (5% desconto)
• Cartão de débito
• Cartão de crédito (até 3x sem juros)

📞 *Orçamentos personalizados:*
WhatsApp: ${whatsapp}

Digite *menu* para voltar ao início! 🏠\`;
        
        await message.reply(responseText);
        return;
    }
    
    // Opção 3 - Localização e horários
    if (userMessage === '3') {
        const responseText = \`📍 *Nossa Localização:*

🏪 *Endereço:*
${address}

🕒 *Horário de Funcionamento:*
• Segunda à Sexta: 8h às 18h
• Sábado: 8h às 16h
• Domingo: 9h às 14h

🚗 *Como chegar:*
• Fácil acesso e estacionamento
• Próximo ao centro da cidade
• Transporte público disponível

📱 *Contato direto:*
WhatsApp: ${whatsapp}
${socialMediaLink ? 'Redes Sociais: ' + socialMediaLink : ''}

Digite *menu* para voltar ao início! 🏠\`;
        
        await message.reply(responseText);
        return;
    }
    
    // Opção 4 - Promoções especiais
    if (userMessage === '4') {
        let promoText = '';
        
        switch('${segment}') {
            case 'Lanchonete':
                promoText = \`🎁 *Promoções Especiais:*

🔥 *Combos em Promoção:*
• Hambúrguer + Batata + Refri: R$ 22,00
• 2 Pizzas médias: R$ 45,00
• Combo família: R$ 35,00

📅 *Promoções Semanais:*
• Segunda: 20% off em hambúrguers
• Quarta: Pizza meio a meio
• Sexta: Combo especial
• Domingo: Desconto família\`;
                break;
                
            case 'Salão de Beleza':
                promoText = \`🎁 *Promoções Especiais:*

💅 *Pacotes Promocionais:*
• Corte + Escova + Manicure: R$ 60,00
• Progressiva + Corte: R$ 140,00
• Pacote noiva completo: R$ 200,00

📅 *Promoções Mensais:*
• Clientes novas: 20% desconto
• Aniversariantes: 15% off
• Indicação de amiga: 10% desconto\`;
                break;
                
            case 'Petshop':
                promoText = \`🎁 *Promoções Especiais:*

🐕 *Pacotes Pet:*
• Banho + Tosa + Unha: R$ 45,00
• 5 banhos: R$ 120,00
• Consulta + Vacina: R$ 110,00

📅 *Promoções do Mês:*
• Novos clientes: 1º banho grátis
• Castração: preço especial
• Ração premium: 10% off\`;
                break;
                
            default:
                promoText = \`🎁 *Promoções Especiais:*

🌟 *Ofertas Imperdíveis:*
• Desconto para novos clientes
• Promoções sazonais
• Pacotes especiais
• Descontos por indicação\`;
        }
        
        const responseText = \`\${promoText}

⏰ *Válido por tempo limitado!*

📲 Para aproveitar, entre em contato:
WhatsApp: ${whatsapp}

Digite *menu* para voltar ao início! 🏠\`;
        
        await message.reply(responseText);
        return;
    }
    
    // Opção 5 - Falar com atendente
    if (userMessage === '5') {
        const responseText = \`👥 *Atendimento Personalizado*

🤝 Você será transferido para nossa equipe de atendimento!

📱 *Contato direto:*
WhatsApp: ${whatsapp}

⏰ *Horário de atendimento humano:*
• Segunda à Sexta: 8h às 18h
• Sábado: 8h às 16h
• Resposta em até 30 minutos

💬 *Nossa equipe pode ajudar com:*
• Pedidos personalizados
• Dúvidas específicas
• Agendamentos
• Informações detalhadas
• Suporte técnico

Obrigado por escolher a *${businessName}*! 🙏

Digite *menu* para voltar ao início! 🏠\`;
        
        await message.reply(responseText);
        return;
    }
    
    // Respostas para cumprimentos adicionais
    if (['bom dia', 'boa tarde', 'boa noite', 'obrigado', 'obrigada', 'valeu', 'tchau', 'até logo'].includes(userMessage)) {
        const greetingResponses = [
            \`😊 Muito obrigado! Esperamos você na *${businessName}*!\`,
            \`🙏 Foi um prazer atendê-lo! Volte sempre!\`,
            \`✨ Obrigado pelo contato! Estamos sempre aqui para ajudar!\`,
            \`💙 Até logo! A *${businessName}* agradece sua preferência!\`
        ];
        
        const randomResponse = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        await message.reply(randomResponse);
        return;
    }
    
    // Mensagem padrão para comandos não reconhecidos
    const defaultText = \`🤖 Olá! Não entendi sua mensagem.

Digite *menu* para ver todas as opções disponíveis.

Ou escolha uma das opções rápidas:
• *1* - Informações sobre ${segment === 'Lanchonete' ? 'produtos' : 'serviços'}
• *2* - Preços e pagamento
• *3* - Localização e horários
• *4* - Promoções especiais
• *5* - Falar com atendente

📱 *Contato direto:* ${whatsapp}\`;
    
    await message.reply(defaultText);
});

// Captura erros
client.on('auth_failure', msg => {
    console.error('❌ Falha na autenticação:', msg);
});

client.on('disconnected', (reason) => {
    console.log('📱 Cliente desconectado:', reason);
});

// Inicializar o cliente
client.initialize();

console.log('🚀 Iniciando chatbot para ${businessName}...');
console.log('📋 Segmento: ${segment}');
console.log('📍 Local: ${address}');
console.log('📱 WhatsApp: ${whatsapp}');
console.log('⏰ Aguardando QR Code...`;
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
                  <div>• Informações específicas do seu negócio</div>
                  <div>• Tabela de preços personalizada</div>
                  <div>• Redirecionamento para WhatsApp</div>
                  <div>• Código completo e documentado</div>
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
