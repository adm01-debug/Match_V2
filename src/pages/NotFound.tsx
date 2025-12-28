import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  useDocumentTitle('Página não encontrada');

  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </Suspense>
  );
};

export default NotFound;
