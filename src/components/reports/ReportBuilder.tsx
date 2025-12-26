import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportBuilderProps {
  onExport?: (format: 'pdf' | 'excel') => void;
}

const METRICS = [
  { id: 'candidatos', label: 'Candidatos por Período', type: 'bar' },
  { id: 'vagas', label: 'Vagas Abertas/Fechadas', type: 'line' },
  { id: 'conversao', label: 'Taxa de Conversão', type: 'pie' },
  { id: 'tempo', label: 'Tempo Médio de Contratação', type: 'bar' },
  { id: 'fonte', label: 'Candidatos por Fonte', type: 'pie' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export function ReportBuilder({ onExport }: ReportBuilderProps) {
  const [selectedMetric, setSelectedMetric] = useState('candidatos');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [isLoading, setIsLoading] = useState(false);

  const mockData = [
    { name: 'Jan', value: 45, prev: 30 },
    { name: 'Fev', value: 52, prev: 45 },
    { name: 'Mar', value: 38, prev: 52 },
    { name: 'Abr', value: 65, prev: 38 },
    { name: 'Mai', value: 48, prev: 65 },
    { name: 'Jun', value: 72, prev: 48 },
  ];

  const pieData = [
    { name: 'LinkedIn', value: 35 },
    { name: 'Indeed', value: 25 },
    { name: 'Indicação', value: 20 },
    { name: 'Site', value: 15 },
    { name: 'Outros', value: 5 },
  ];

  const metric = METRICS.find(m => m.id === selectedMetric);

  const renderChart = () => {
    if (metric?.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#8884d8" /></BarChart>
        </ResponsiveContainer>
      );
    }
    if (metric?.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#8884d8" /><Line type="monotone" dataKey="prev" stroke="#82ca9d" /></LineChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Construtor de Relatórios</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}><RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />Atualizar</Button>
          <Button size="sm" onClick={() => onExport?.('pdf')}><Download className="h-4 w-4 mr-1" />Exportar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[250px]"><SelectValue placeholder="Selecione a métrica" /></SelectTrigger>
            <SelectContent>{METRICS.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline"><CalendarIcon className="h-4 w-4 mr-2" />{format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}</Button></PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="range" selected={dateRange} onSelect={(range) => range && setDateRange({ from: range.from || new Date(), to: range.to || new Date() })} locale={ptBR} /></PopoverContent>
          </Popover>
        </div>
        <div className="pt-4">{renderChart()}</div>
      </CardContent>
    </Card>
  );
}

export default ReportBuilder;
