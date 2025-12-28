import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from '@/components/layout/Layout';
import { ResumeParser } from '@/components/candidatos/ResumeParser';

export default function ResumeParserPage() {
  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Parser de Currículo</h1>
            <p className="text-muted-foreground mt-1">
              Extraia automaticamente informações de currículos usando inteligência artificial
            </p>
          </div>

          <ResumeParser 
            onParsed={(data) => {
            }}
          />
        </div>
      </Layout>
    </Suspense>
  );
}
