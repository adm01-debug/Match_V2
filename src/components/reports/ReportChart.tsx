import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'funnel';

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ReportChartProps {
  title: string;
  description?: string;
  type: ChartType;
  data: ChartData[];
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

const DEFAULT_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe",
  "#00c49f", "#ffbb28", "#ff8042", "#a4de6c", "#d0ed57"
];

export function ReportChart({
  title,
  description,
  type,
  data,
  dataKeys = ['value'],
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true,
  showGrid = true,
}: ReportChartProps) {
  const chartColors = useMemo(() => 
    dataKeys.map((_, i) => colors[i % colors.length]),
    [dataKeys, colors]
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={chartColors[index]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={chartColors[index]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Area key={key} type="monotone" dataKey={key} fill={chartColors[index]} stroke={chartColors[index]} fillOpacity={0.3} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={data} isAnimationActive>
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
