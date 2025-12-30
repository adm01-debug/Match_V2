import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportChart } from "./ReportChart";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";

interface RecruiterData {
  id: string;
  name: string;
  avatar?: string;
  totalCandidates: number;
  totalHires: number;
  avgTimeToHire: number;
  conversionRate: number;
  interviewsConducted: number;
}

interface RecruiterPerformanceReportProps {
  data: RecruiterData[];
  period: string;
}

export function RecruiterPerformanceReport({ data, period }: RecruiterPerformanceReportProps) {
  const sortedByHires = [...data].sort((a, b) => b.totalHires - a.totalHires);
  const topPerformer = sortedByHires[0];

  const chartData = data.map(r => ({
    name: r.name.split(" ")[0],
    contratações: r.totalHires,
    candidatos: r.totalCandidates,
  }));

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="w-5 text-center text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Performer */}
      {topPerformer && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-10 w-10 text-yellow-500" />
              <Avatar className="h-16 w-16">
                <AvatarImage src={topPerformer.avatar} />
                <AvatarFallback>{topPerformer.name.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Top Performer do Período</p>
                <p className="text-2xl font-bold">{topPerformer.name}</p>
                <p className="text-sm">{topPerformer.totalHires} contratações • {topPerformer.conversionRate.toFixed(1)}% conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <ReportChart
        title="Comparativo de Performance"
        description="Candidatos processados vs contratações"
        type="bar"
        data={chartData}
        dataKeys={["candidatos", "contratações"]}
        height={300}
      />

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Recrutadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByHires.map((recruiter, index) => (
              <div key={recruiter.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <Avatar>
                    <AvatarImage src={recruiter.avatar} />
                    <AvatarFallback>{recruiter.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{recruiter.name}</p>
                    <p className="text-sm text-muted-foreground">{recruiter.interviewsConducted} entrevistas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold">{recruiter.totalCandidates}</p>
                    <p className="text-muted-foreground">Candidatos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-600">{recruiter.totalHires}</p>
                    <p className="text-muted-foreground">Contratações</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary">{recruiter.avgTimeToHire}d</Badge>
                    <p className="text-muted-foreground text-xs">Média</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
