import { Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from '@/components/layout/Layout';
import { ResumeParser } from '@/components/candidatos/ResumeParser';
import { LinkedInImportDialog } from '@/components/candidatos/LinkedInImportDialog';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';

export default function ResumeParserPage() {
  const [linkedInOpen, setLinkedInOpen] = useState(false);

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parser de Currículo</h1>
              <p className="text-muted-foreground mt-1">
                Extraia automaticamente informações de currículos usando inteligência artificial
              </p>
            </div>
            <Button variant="outline" onClick={() => setLinkedInOpen(true)}>
              <Linkedin className="h-4 w-4 mr-2" />
              Importar do LinkedIn
            </Button>
          </div>

          <ResumeParser 
            onParsed={() => {
              // Handle parsed data
            }}
          />

          <LinkedInImportDialog
            open={linkedInOpen}
            onOpenChange={setLinkedInOpen}
          />
        </div>
      </Layout>
    </Suspense>
  );
}
