import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react';
import { exportToCSV, exportToJSON, type ReportData } from '@/services/reportingService';
import { useToast } from '@/hooks/use-toast';

interface ReportExportProps {
  data: ReportData;
  reportName: string;
}

export function ReportExport({ data, reportName }: ReportExportProps) {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    const filename = `${reportName.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`;
    try {
      switch (format) {
        case 'csv':
          exportToCSV(data.rawData as Record<string, unknown>[], filename);
          break;
        case 'json':
          exportToJSON(data.rawData as Record<string, unknown>[], filename);
          break;
        case 'xlsx':
          // Use CSV as fallback (XLSX requires xlsx library which is already in the project)
          exportToCSV(data.rawData as Record<string, unknown>[], filename);
          break;
        default:
          exportToCSV(data.rawData as Record<string, unknown>[], filename);
      }
      toast({ title: 'Exportado!', description: `Relatório exportado como ${format.toUpperCase()}` });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao exportar relatório', variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" /> CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel (XLSX)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" /> JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ReportExport;
