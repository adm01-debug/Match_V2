import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ImportRow { data: Record<string, any>; isValid: boolean; errors: string[]; }
interface ImportPreviewProps { rows: ImportRow[]; columns: string[]; onConfirm: () => void; onCancel: () => void; isLoading?: boolean; }

export function ImportPreview({ rows, columns, onConfirm, onCancel, isLoading }: ImportPreviewProps) {
  const validCount = rows.filter(r => r.isValid).length;
  const invalidCount = rows.length - validCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Preview da Importação</span>
          <div className="flex gap-2">
            <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />{validCount} válidos</Badge>
            {invalidCount > 0 && <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{invalidCount} inválidos</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-[400px] overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                {columns.map(col => <TableHead key={col}>{col}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 100).map((row, i) => (
                <TableRow key={i} className={!row.isValid ? 'bg-destructive/10' : ''}>
                  <TableCell>
                    {row.isValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-destructive">{row.errors[0]}</span>
                      </div>
                    )}
                  </TableCell>
                  {columns.map(col => <TableCell key={col} className="text-sm">{row.data[col] || '-'}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length > 100 && <p className="text-sm text-muted-foreground text-center">Mostrando 100 de {rows.length} registros</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
          <Button onClick={onConfirm} disabled={isLoading || invalidCount === rows.length}>
            {isLoading ? 'Importando...' : `Importar ${validCount} registros`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ImportPreview;
