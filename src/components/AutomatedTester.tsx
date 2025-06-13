
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RefreshCw, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  buttonText: string;
  location: string;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
  timestamp: string;
  actionType: string;
}

const AutomatedTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const findAllButtons = (): HTMLElement[] => {
    const buttons: HTMLElement[] = [];
    
    // Buscar todos os elementos button
    const buttonElements = document.querySelectorAll('button');
    buttonElements.forEach(btn => buttons.push(btn));
    
    // Buscar elementos com role="button"
    const roleButtons = document.querySelectorAll('[role="button"]');
    roleButtons.forEach(btn => buttons.push(btn as HTMLElement));
    
    // Buscar links que funcionam como botões
    const linkButtons = document.querySelectorAll('a[class*="button"], a[class*="btn"]');
    linkButtons.forEach(btn => buttons.push(btn as HTMLElement));
    
    // Filtrar apenas elementos visíveis
    return buttons.filter(btn => {
      const style = window.getComputedStyle(btn);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             btn.offsetWidth > 0 && 
             btn.offsetHeight > 0;
    });
  };

  const getButtonLocation = (button: HTMLElement): string => {
    // Tentar identificar a localização baseada no caminho atual e contexto
    const currentPath = window.location.pathname;
    const parentComponent = button.closest('[data-testid], [class*="Page"], [class*="Component"]');
    const parentText = parentComponent?.className || '';
    
    let location = currentPath;
    if (parentText) {
      location += ` (${parentText})`;
    }
    
    return location;
  };

  const getButtonText = (button: HTMLElement): string => {
    return button.textContent?.trim() || 
           button.getAttribute('aria-label') || 
           button.getAttribute('title') || 
           button.className.split(' ')[0] || 
           'Botão sem texto';
  };

  const detectActionType = (button: HTMLElement): string => {
    const text = button.textContent?.toLowerCase() || '';
    const classes = button.className.toLowerCase();
    
    if (text.includes('entrar') || text.includes('login')) return 'Login';
    if (text.includes('sair') || text.includes('logout')) return 'Logout';
    if (text.includes('criar') || text.includes('cadastrar')) return 'Criação';
    if (text.includes('pagar') || text.includes('payment')) return 'Pagamento';
    if (text.includes('voltar') || text.includes('back')) return 'Navegação';
    if (text.includes('começar') || text.includes('start')) return 'Iniciar';
    if (classes.includes('nav') || button.closest('nav')) return 'Navegação';
    
    return 'Ação Geral';
  };

  const testButton = async (button: HTMLElement): Promise<TestResult> => {
    const buttonText = getButtonText(button);
    const location = getButtonLocation(button);
    const actionType = detectActionType(button);
    const timestamp = new Date().toLocaleTimeString();

    console.log(`🧪 Testando botão: "${buttonText}" em ${location}`);
    setCurrentTest(`Testando: ${buttonText}`);

    try {
      // Verificar se o botão está desabilitado
      if (button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true') {
        return {
          buttonText,
          location,
          status: 'warning',
          errorMessage: 'Botão está desabilitado',
          timestamp,
          actionType
        };
      }

      // Capturar o estado inicial
      const initialUrl = window.location.href;
      const initialPageTitle = document.title;

      // Simular clique no botão
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await delay(500);

      // Destacar o botão visualmente
      const originalStyle = button.style.cssText;
      button.style.cssText += '; border: 3px solid #ff0000; box-shadow: 0 0 10px rgba(255,0,0,0.5);';
      
      await delay(500);
      
      // Executar o clique
      button.click();
      
      await delay(1000);
      
      // Restaurar estilo original
      button.style.cssText = originalStyle;

      // Verificar mudanças após o clique
      const newUrl = window.location.href;
      const newPageTitle = document.title;
      
      // Verificar se houve navegação
      if (newUrl !== initialUrl) {
        console.log(`✅ Navegação detectada: ${initialUrl} → ${newUrl}`);
        return {
          buttonText,
          location,
          status: 'success',
          errorMessage: `Navegou para: ${newUrl}`,
          timestamp,
          actionType
        };
      }

      // Verificar mudanças no título da página
      if (newPageTitle !== initialPageTitle) {
        console.log(`✅ Mudança de título detectada: ${initialPageTitle} → ${newPageTitle}`);
        return {
          buttonText,
          location,
          status: 'success',
          errorMessage: `Título alterado para: ${newPageTitle}`,
          timestamp,
          actionType
        };
      }

      // Verificar se apareceram modais ou toasts
      await delay(500);
      const modals = document.querySelectorAll('[role="dialog"], .toast, .modal');
      if (modals.length > 0) {
        console.log(`✅ Modal/Toast detectado após clique`);
        return {
          buttonText,
          location,
          status: 'success',
          errorMessage: 'Modal ou notificação exibida',
          timestamp,
          actionType
        };
      }

      // Se não detectou mudanças óbvias, considerar como sucesso mas com aviso
      console.log(`⚠️ Clique executado, mas mudanças não detectadas`);
      return {
        buttonText,
        location,
        status: 'warning',
        errorMessage: 'Clique executado, mas mudanças não foram detectadas',
        timestamp,
        actionType
      };

    } catch (error) {
      console.error(`❌ Erro ao testar botão "${buttonText}":`, error);
      return {
        buttonText,
        location,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp,
        actionType
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const buttons = findAllButtons();
      console.log(`🚀 Iniciando teste automatizado de ${buttons.length} botões`);
      toast.info(`Iniciando teste de ${buttons.length} botões encontrados`);
      
      const results: TestResult[] = [];
      
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const result = await testButton(button);
        results.push(result);
        setTestResults([...results]);
        
        // Pequena pausa entre testes
        await delay(1000);
      }
      
      // Gerar relatório final
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      
      console.log(`📊 Teste concluído: ${successCount} sucessos, ${errorCount} erros, ${warningCount} avisos`);
      toast.success(`Teste concluído! ${successCount} sucessos, ${errorCount} erros, ${warningCount} avisos`);
      
    } catch (error) {
      console.error('Erro durante execução dos testes:', error);
      toast.error('Erro durante execução dos testes');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const exportResults = () => {
    const csvContent = [
      'Botão,Localização,Status,Tipo de Ação,Mensagem de Erro,Timestamp',
      ...testResults.map(result => 
        `"${result.buttonText}","${result.location}","${result.status}","${result.actionType}","${result.errorMessage || ''}","${result.timestamp}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teste-botoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão flutuante para abrir/fechar */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded-full w-12 h-12 shadow-lg"
        variant={isVisible ? "secondary" : "default"}
      >
        {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
      </Button>

      {/* Painel de testes */}
      {isVisible && (
        <Card className="absolute bottom-16 right-0 w-96 max-h-96 overflow-hidden shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Testador Automático
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <Square className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Testes
                  </>
                )}
              </Button>
              {testResults.length > 0 && (
                <Button
                  onClick={exportResults}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>

            {currentTest && (
              <div className="text-sm text-blue-600 font-medium">
                {currentTest}
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="text-sm font-medium">
                  Resultados ({testResults.length})
                </div>
                {testResults.map((result, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{result.buttonText}</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(result.status)}
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-gray-600">{result.location}</div>
                    <div className="text-gray-500">{result.actionType}</div>
                    {result.errorMessage && (
                      <div className="text-gray-700 mt-1">{result.errorMessage}</div>
                    )}
                    <div className="text-gray-400 text-xs">{result.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomatedTester;
