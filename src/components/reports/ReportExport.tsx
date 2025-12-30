import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, FileText, Image, Loader2 } from "lucide-react";

interface ReportExportProps {
  reportName: string;
  data: Record<string, unknown>[];
  onExport?: (format: string) => void;
}

export function ReportExport({ reportName, data, onExport }: ReportExportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");

  const exportToCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    downloadFile(csvContent, `${reportName}.csv`, "text/csv");
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${reportName}.json`, "application/json");
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Relatório");
      XLSX.writeFile(wb, `${reportName}.xlsx`);
      toast({ title: "Exportado!", description: "Arquivo Excel gerado com sucesso." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível gerar o Excel.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("report-content");
      if (element) {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${reportName}.png`;
        link.href = imgData;
        link.click();
      }
      toast({ title: "Exportado!", description: "Imagem do relatório gerada." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível gerar a imagem.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const sendByEmail = async () => {
    if (!email) return;
    setIsExporting(true);
    try {
      // Simular envio - integrar com backend real
      await new Promise(r => setTimeout(r, 1000));
      toast({ title: "Enviado!", description: `Relatório enviado para ${email}` });
      setShowEmailDialog(false);
      setEmail("");
    } catch {
      toast({ title: "Erro", description: "Falha ao enviar email.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exportado!", description: `${filename} baixado.` });
    onExport?.(type);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportToCSV}>
            <FileText className="h-4 w-4 mr-2" />CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToJSON}>
            <FileText className="h-4 w-4 mr-2" />JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToPDF}>
            <Image className="h-4 w-4 mr-2" />Imagem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enviar por Email</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancelar</Button>
            <Button onClick={sendByEmail} disabled={isExporting || !email}>
              {isExporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
