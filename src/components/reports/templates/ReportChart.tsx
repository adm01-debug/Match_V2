import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface ReportChartProps {
  data: Record<string, unknown>[];
  type?: 'bar' | 'pie' | 'line';
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
  className?: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export function ReportChart({ 
  data, 
  type = 'bar', 
  dataKey = 'value', 
  nameKey = 'name',
  colors = COLORS,
  height = 300,
  className 
}: ReportChartProps) {
  if (type === 'pie') {
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={nameKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey={nameKey} className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReportChart;
