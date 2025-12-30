import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportChart } from "./ReportChart";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SourceData {
  name: string;
  candidates: number;
  hires: number;
  conversionRate: number;
  avgTimeToHire: number;
  costPerHire?: number;
}

interface SourceEffectivenessReportProps {
  data: SourceData[];
  period: string;
}

export function SourceEffectivenessReport({ data, period }: SourceEffectivenessReportProps) {
  const sortedByHires = [...data].sort((a, b) => b.hires - a.hires);
  const sortedByConversion = [...data].sort((a, b) => b.conversionRate - a.conversionRate);
  const totalCandidates = data.reduce((acc, s) => acc + s.candidates, 0);
  const totalHires = data.reduce((acc, s) => acc + s.hires, 0);

  const chartData = data.map(s => ({ name: s.name, value: s.candidates }));
  const hiresChartData = data.map(s => ({ name: s.name, value: s.hires }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Fontes Ativas</p>
            <p className="text-3xl font-bold">{data.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Candidatos</p>
            <p className="text-3xl font-bold">{totalCandidates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Contratados</p>
            <p className="text-3xl font-bold">{totalHires}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Melhor Fonte</p>
            <p className="text-xl font-bold truncate">{sortedByConversion[0]?.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart
          title="Candidatos por Fonte"
          type="pie"
          data={chartData}
          height={300}
        />
        <ReportChart
          title="Contratações por Fonte"
          type="bar"
          data={hiresChartData}
          height={300}
        />
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Fonte</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonte</TableHead>
                <TableHead className="text-right">Candidatos</TableHead>
                <TableHead className="text-right">Contratados</TableHead>
                <TableHead className="text-right">Conversão</TableHead>
                <TableHead className="text-right">Tempo Médio</TableHead>
                <TableHead className="text-right">Custo/Contratação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedByHires.map((source) => (
                <TableRow key={source.name}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell className="text-right">{source.candidates}</TableCell>
                  <TableCell className="text-right">{source.hires}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={source.conversionRate >= 10 ? "bg-green-500" : source.conversionRate >= 5 ? "bg-yellow-500" : "bg-red-500"}>
                      {source.conversionRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{source.avgTimeToHire} dias</TableCell>
                  <TableCell className="text-right">
                    {source.costPerHire ? `R$ ${source.costPerHire.toLocaleString()}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
