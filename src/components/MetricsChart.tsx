
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockMetrics } from '@/lib/mockData';
import { useState, useEffect } from 'react';

const MetricsChart = () => {
  const [data, setData] = useState(generateMockMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        newData.shift(); // Remove oldest point
        newData.push({
          timestamp: Date.now(),
          centralProcessingUnitUsagePercentage: Math.max(5, Math.min(95, 25 + (Math.random() - 0.5) * 20)),
          randomAccessMemoryUsagePercentage: Math.max(10, Math.min(90, 45 + (Math.random() - 0.5) * 15)),
          temperatureCelsius: Math.max(35, Math.min(80, 50 + (Math.random() - 0.5) * 10))
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={formatTime}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            labelFormatter={(value) => `Time: ${formatTime(value as number)}`}
            formatter={(value: any, name: string) => [
              `${Math.round(value)}${name === 'temperatureCelsius' ? '°C' : '%'}`,
              name === 'centralProcessingUnitUsagePercentage' ? 'CPU Usage' : 
              name === 'randomAccessMemoryUsagePercentage' ? 'Memory Usage' : 'Temperature'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="centralProcessingUnitUsagePercentage" 
            stroke="hsl(217 91% 60%)" 
            strokeWidth={2}
            dot={false}
            name="CPU Usage"
          />
          <Line 
            type="monotone" 
            dataKey="randomAccessMemoryUsagePercentage" 
            stroke="hsl(142 76% 36%)" 
            strokeWidth={2}
            dot={false}
            name="Memory Usage"
          />
          <Line 
            type="monotone" 
            dataKey="temperatureCelsius" 
            stroke="hsl(0 84% 60%)" 
            strokeWidth={2}
            dot={false}
            name="Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
