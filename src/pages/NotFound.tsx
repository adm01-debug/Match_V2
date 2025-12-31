import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  useDocumentTitle('Página não encontrada');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log 404 for analytics in development
    if (import.meta.env.DEV) {
      console.warn(`[404] Route not found: ${location.pathname}`);
    }
  }, [location.pathname]);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <main 
      className="flex min-h-screen items-center justify-center bg-background"
      role="main"
      aria-labelledby="error-title"
    >
      <div className="text-center space-y-6 p-8 max-w-lg">
        <div className="space-y-2">
          <h1 
            id="error-title"
            className="text-6xl font-bold text-primary"
            aria-label="Erro 404"
          >
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          {location.pathname !== '/' && (
            <p className="text-sm text-muted-foreground/70">
              URL: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
            </p>
          )}
        </div>
        
        <nav 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          aria-label="Navegação de recuperação"
        >
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Button>
          <Button asChild>
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" aria-hidden="true" />
              Ir para Dashboard
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/vagas" className="inline-flex items-center gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              Ver Vagas
            </Link>
          </Button>
        </nav>

        <p className="text-xs text-muted-foreground">
          Se você acredita que isso é um erro, entre em contato com o suporte.
        </p>
      </div>
    </main>
  );
}

export default NotFound;
