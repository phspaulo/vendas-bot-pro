
import { useState, useCallback } from 'react';

export interface TestResult {
  buttonText: string;
  location: string;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
  timestamp: string;
  actionType: string;
  elementInfo: {
    tagName: string;
    className: string;
    id?: string;
  };
}

export const useAutomatedTesting = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const findAllInteractiveElements = useCallback((): HTMLElement[] => {
    const elements: HTMLElement[] = [];
    
    // Buscar todos os elementos button
    const buttonElements = document.querySelectorAll('button:not([data-test-ignore])');
    buttonElements.forEach(btn => elements.push(btn as HTMLElement));
    
    // Buscar elementos com role="button"
    const roleButtons = document.querySelectorAll('[role="button"]:not([data-test-ignore])');
    roleButtons.forEach(btn => elements.push(btn as HTMLElement));
    
    // Buscar links que funcionam como botões
    const linkButtons = document.querySelectorAll('a[class*="button"]:not([data-test-ignore]), a[class*="btn"]:not([data-test-ignore])');
    linkButtons.forEach(btn => elements.push(btn as HTMLElement));

    // Buscar elementos clicáveis com eventos
    const clickableElements = document.querySelectorAll('[onclick]:not([data-test-ignore]), [data-testid*="button"]:not([data-test-ignore])');
    clickableElements.forEach(el => elements.push(el as HTMLElement));
    
    // Filtrar apenas elementos visíveis e funcionais
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      return (
        style.display !== 'none' && 
        style.visibility !== 'hidden' && 
        style.opacity !== '0' &&
        rect.width > 0 && 
        rect.height > 0 &&
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-disabled') !== 'true'
      );
    });
  }, []);

  const getElementInfo = (element: HTMLElement) => {
    const text = element.textContent?.trim() || 
                 element.getAttribute('aria-label') || 
                 element.getAttribute('title') || 
                 element.getAttribute('data-testid') ||
                 `${element.tagName.toLowerCase()}${element.className ? '.' + element.className.split(' ')[0] : ''}`;

    const location = (() => {
      const currentPath = window.location.pathname;
      const parent = element.closest('[data-component], [class*="Page"], [class*="Component"], section, main, nav, header, footer');
      const parentInfo = parent?.getAttribute('data-component') || 
                        parent?.className.split(' ').find(c => c.includes('Page') || c.includes('Component')) ||
                        parent?.tagName.toLowerCase() || '';
      
      return `${currentPath}${parentInfo ? ` > ${parentInfo}` : ''}`;
    })();

    const actionType = (() => {
      const text = element.textContent?.toLowerCase() || '';
      const classes = element.className.toLowerCase();
      const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
      
      if (text.includes('entrar') || text.includes('login') || ariaLabel.includes('login')) return 'Autenticação';
      if (text.includes('sair') || text.includes('logout') || ariaLabel.includes('logout')) return 'Logout';
      if (text.includes('criar') || text.includes('cadastrar') || text.includes('signup')) return 'Cadastro';
      if (text.includes('pagar') || text.includes('payment') || text.includes('checkout')) return 'Pagamento';
      if (text.includes('voltar') || text.includes('back') || ariaLabel.includes('back')) return 'Navegação';
      if (text.includes('começar') || text.includes('start') || text.includes('iniciar')) return 'Inicialização';
      if (text.includes('enviar') || text.includes('submit') || (element as HTMLInputElement).type === 'submit') return 'Envio';
      if (classes.includes('nav') || element.closest('nav')) return 'Navegação';
      if (element.tagName.toLowerCase() === 'a') return 'Link';
      
      return 'Ação Geral';
    })();

    return {
      text,
      location,
      actionType,
      elementInfo: {
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        id: element.id || undefined
      }
    };
  };

  const testElement = async (element: HTMLElement): Promise<TestResult> => {
    const { text, location, actionType, elementInfo } = getElementInfo(element);
    const timestamp = new Date().toLocaleTimeString();

    console.log(`🧪 Testando elemento: "${text}" em ${location}`);
    setCurrentTest(`Testando: ${text}`);

    try {
      // Capturar estado inicial
      const initialUrl = window.location.href;
      const initialTitle = document.title;
      const initialErrors = document.querySelectorAll('.error, [role="alert"]').length;

      // Destacar elemento visualmente
      const originalStyle = element.style.cssText;
      const originalOutline = element.style.outline;
      
      element.style.outline = '3px solid #ff6b6b';
      element.style.outlineOffset = '2px';
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      await delay(800);

      // Executar interação
      element.click();
      
      await delay(1500);
      
      // Restaurar estilo
      element.style.cssText = originalStyle;
      element.style.outline = originalOutline;

      // Verificar resultados
      const newUrl = window.location.href;
      const newTitle = document.title;
      const newErrors = document.querySelectorAll('.error, [role="alert"]').length;

      // Verificar se houve erros
      if (newErrors > initialErrors) {
        return {
          buttonText: text,
          location,
          status: 'error',
          errorMessage: 'Novos erros detectados na página',
          timestamp,
          actionType,
          elementInfo
        };
      }

      // Verificar navegação
      if (newUrl !== initialUrl) {
        return {
          buttonText: text,
          location,
          status: 'success',
          errorMessage: `Navegou para: ${newUrl}`,
          timestamp,
          actionType,
          elementInfo
        };
      }

      // Verificar mudança de título
      if (newTitle !== initialTitle) {
        return {
          buttonText: text,
          location,
          status: 'success',
          errorMessage: `Título alterado: ${newTitle}`,
          timestamp,
          actionType,
          elementInfo
        };
      }

      // Verificar modais, toasts, ou novos elementos
      await delay(500);
      const modals = document.querySelectorAll('[role="dialog"], .toast, .modal, [data-state="open"]');
      if (modals.length > 0) {
        return {
          buttonText: text,
          location,
          status: 'success',
          errorMessage: 'Modal ou notificação exibida',
          timestamp,
          actionType,
          elementInfo
        };
      }

      // Verificar mudanças no DOM
      const forms = document.querySelectorAll('form');
      const hasFormChanges = Array.from(forms).some(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        return Array.from(inputs).some(input => (input as HTMLInputElement).value !== '');
      });

      if (hasFormChanges) {
        return {
          buttonText: text,
          location,
          status: 'success',
          errorMessage: 'Formulário foi modificado',
          timestamp,
          actionType,
          elementInfo
        };
      }

      // Se chegou até aqui, a ação pode ter sido executada mas sem mudanças visíveis
      return {
        buttonText: text,
        location,
        status: 'warning',
        errorMessage: 'Clique executado, mas sem mudanças detectadas',
        timestamp,
        actionType,
        elementInfo
      };

    } catch (error) {
      console.error(`❌ Erro ao testar "${text}":`, error);
      return {
        buttonText: text,
        location,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp,
        actionType,
        elementInfo
      };
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest('Iniciando varredura...');

    try {
      const elements = findAllInteractiveElements();
      console.log(`🚀 Encontrados ${elements.length} elementos interativos para testar`);
      
      const results: TestResult[] = [];
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const result = await testElement(element);
        results.push(result);
        setTestResults([...results]);
        
        // Pausa entre testes para permitir que a UI se estabilize
        await delay(1200);
      }
      
      console.log(`✅ Testes concluídos: ${results.length} elementos testados`);
      
    } catch (error) {
      console.error('Erro durante execução dos testes:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: testResults.length,
        success: testResults.filter(r => r.status === 'success').length,
        errors: testResults.filter(r => r.status === 'error').length,
        warnings: testResults.filter(r => r.status === 'warning').length
      },
      results: testResults
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-testes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    isRunning,
    testResults,
    currentTest,
    runTests,
    exportResults
  };
};
