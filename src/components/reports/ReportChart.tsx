/**
 * @fileoverview ReportChart component for data visualization
 * @module ReportChart
 */

import { useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList 
} from "recharts";
import { AlertCircle } from "lucide-react";

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'funnel';

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ReportChartProps {
  title?: string;
  description?: string;
  type: ChartType;
  data: ChartData[];
  dataKey?: string;
  nameKey?: string;
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  isLoading?: boolean;
}

const DEFAULT_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe",
  "#00c49f", "#ffbb28", "#ff8042", "#a4de6c", "#d0ed57"
];

function ReportChartComponent({
  title,
  description,
  type,
  data,
  dataKey = 'value',
  nameKey = 'name',
  dataKeys = ['value'],
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true,
  showGrid = true,
  isLoading = false,
}: ReportChartProps) {
  const chartColors = useMemo(() => 
    dataKeys.map((_, i) => colors[i % colors.length]),
    [dataKeys, colors]
  );

  const hasData = data && data.length > 0;

  const renderChart = () => {
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <AlertCircle className="h-8 w-8 mb-2" aria-hidden="true" />
          <p>Sem dados para exibir</p>
        </div>
      );
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              role="img"
              aria-label={title || "Gráfico de barras"}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={nameKey} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar 
                  key={`bar-${key}-${index}`} 
                  dataKey={key} 
                  fill={chartColors[index]} 
                  radius={[4, 4, 0, 0]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              role="img"
              aria-label={title || "Gráfico de linha"}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={nameKey} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line 
                  key={`line-${key}-${index}`} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={chartColors[index]} 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              role="img"
              aria-label={title || "Gráfico de área"}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={nameKey} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Area 
                  key={`area-${key}-${index}`} 
                  type="monotone" 
                  dataKey={key} 
                  fill={chartColors[index]} 
                  stroke={chartColors[index]} 
                  fillOpacity={0.3} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart role="img" aria-label={title || "Gráfico de pizza"}>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`pie-cell-${entry.name || index}-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
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
            <FunnelChart role="img" aria-label={title || "Gráfico de funil"}>
              <Tooltip />
              <Funnel dataKey={dataKey} data={data} isAnimationActive>
                <LabelList 
                  position="right" 
                  fill="#000" 
                  stroke="none" 
                  dataKey={nameKey} 
                />
                {data.map((entry, index) => (
                  <Cell 
                    key={`funnel-cell-${entry.name || index}-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Tipo de gráfico não suportado: {type}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <Card>
        {title && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div 
            className="animate-pulse bg-muted rounded" 
            style={{ height }}
            aria-label="Carregando gráfico"
          />
        </CardContent>
      </Card>
    );
  }

  // If no title, render chart directly
  if (!title) {
    return (
      <div role="figure" aria-label="Gráfico">
        {renderChart()}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

ReportChartComponent.displayName = 'ReportChart';

export const ReportChart = memo(ReportChartComponent);
export default ReportChart;
