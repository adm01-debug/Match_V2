/**
 * @module LinkedInImportDialog
 * @description Dialog to import candidate data from LinkedIn profile
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Linkedin, User, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useLinkedInImport } from '@/hooks/useLinkedInImport';

interface LinkedInImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LinkedInImportDialog({ open, onOpenChange, onSuccess }: LinkedInImportDialogProps) {
  const [url, setUrl] = useState('');
  const { importFromLinkedIn, saveCandidato, isImporting, isSaving, importedData } = useLinkedInImport();
  const [step, setStep] = useState<'input' | 'preview' | 'done'>('input');

  const handleImport = async () => {
    try {
      await importFromLinkedIn(url);
      setStep('preview');
    } catch {
      // error handled in hook
    }
  };

  const handleSave = async () => {
    if (!importedData) return;
    try {
      await saveCandidato(importedData);
      setStep('done');
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
        setStep('input');
        setUrl('');
      }, 1500);
    } catch {
      // error handled in hook
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('input');
    setUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-[#0077B5]" />
            Importar do LinkedIn
          </DialogTitle>
          <DialogDescription>
            Cole a URL do perfil do LinkedIn para importar os dados do candidato
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>URL do Perfil LinkedIn</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/nome-do-candidato"
                />
                <p className="text-xs text-muted-foreground">
                  Ex: https://linkedin.com/in/joao-silva-123456
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleImport} disabled={!url.trim() || isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Linkedin className="h-4 w-4 mr-2" />
                    Importar Dados
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'preview' && importedData && (
          <>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{importedData.nome}</h3>
                      {importedData.email && (
                        <p className="text-sm text-muted-foreground">{importedData.email}</p>
                      )}
                    </div>
                  </div>

                  {importedData.resumo && (
                    <p className="text-sm text-muted-foreground">{importedData.resumo}</p>
                  )}

                  {importedData.habilidades?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Habilidades</p>
                      <div className="flex flex-wrap gap-1">
                        {importedData.habilidades.slice(0, 10).map((h, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {importedData.experiencias?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Experiência
                      </p>
                      {importedData.experiencias.slice(0, 3).map((exp, i) => (
                        <div key={i} className="text-sm ml-4 mb-1">
                          <span className="font-medium">{exp.cargo}</span> - {exp.empresa}
                          <span className="text-muted-foreground text-xs ml-1">({exp.periodo})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {importedData.formacao?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Formação
                      </p>
                      {importedData.formacao.slice(0, 2).map((f, i) => (
                        <div key={i} className="text-sm ml-4 mb-1">
                          <span className="font-medium">{f.curso}</span> - {f.instituicao}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('input')}>Voltar</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Candidato'
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'done' && (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="font-semibold text-lg">Candidato importado!</h3>
            <p className="text-sm text-muted-foreground">Os dados foram salvos com sucesso.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LinkedInImportDialog;
