import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { importService, ImportResult } from '@/services/importService';

type Step = 'upload' | 'preview' | 'mapping' | 'importing' | 'complete';

interface ImportWizardProps {
  onComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  importType: 'candidatos' | 'vagas';
}

export function ImportWizard({ onComplete, onCancel, importType }: ImportWizardProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setError(null);

    try {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const parsedData = isExcel
        ? await importService.readExcel(file)
        : importService.parseCSV(await importService.readFile(file));

      if (parsedData.length === 0) {
        setError('Arquivo vazio ou formato inválido');
        return;
      }

      setData(parsedData);
      setStep('preview');
    } catch (err) {
      setError('Erro ao processar arquivo');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!file) return;

    setStep('importing');
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      const importResult = importType === 'candidatos'
        ? await importService.importCandidatos(file)
        : await importService.importCandidatos(file); // TODO: Add importVagas

      clearInterval(progressInterval);
      setProgress(100);
      setResult(importResult);
      setStep('complete');
      onComplete?.(importResult);
    } catch (err: any) {
      setError(err.message || 'Erro durante importação');
      setStep('preview');
    }
  };

  const headers = importService.getHeaders(data);
  const preview = importService.preview(data);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Importar {importType === 'candidatos' ? 'Candidatos' : 'Vagas'}
        </CardTitle>
        <CardDescription>
          {step === 'upload' && 'Arraste um arquivo CSV ou Excel para começar'}
          {step === 'preview' && `${data.length} registros encontrados`}
          {step === 'importing' && 'Importando dados...'}
          {step === 'complete' && 'Importação concluída!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'upload' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">CSV, XLS ou XLSX até 10MB</p>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.slice(0, 5).map(h => <TableHead key={h}>{h}</TableHead>)}
                    {headers.length > 5 && <TableHead>...</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, i) => (
                    <TableRow key={i}>
                      {headers.slice(0, 5).map(h => <TableCell key={h}>{String(row[h] ?? '')}</TableCell>)}
                      {headers.length > 5 && <TableCell>...</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              Mostrando {preview.length} de {data.length} registros
            </p>
          </div>
        )}

        {step === 'importing' && (
          <div className="py-8 space-y-4">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-muted-foreground">Importando {data.length} registros...</p>
          </div>
        )}

        {step === 'complete' && result && (
          <div className="py-8 space-y-4 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{result.success} importados</p>
              {result.failed > 0 && (
                <p className="text-sm text-destructive">{result.failed} com erro</p>
              )}
            </div>
            {result.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  {result.errors.slice(0, 3).map(e => `Linha ${e.row}: ${e.error}`).join('; ')}
                  {result.errors.length > 3 && ` e mais ${result.errors.length - 3} erros`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            {step === 'complete' ? 'Fechar' : 'Cancelar'}
          </Button>
          {step === 'preview' && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <Button onClick={handleImport}>
                Importar {data.length} registros <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ImportWizard;
