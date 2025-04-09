import { useEffect, useState } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  time: string;
  payment: number;
  offer: number;
}

interface TransactionChartProps {
  paymentCount: number;
  offerCount: number;
  className?: string;
}

export function TransactionChart({ paymentCount, offerCount, className }: TransactionChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  
  // Update chart data with new transaction counts
  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setData(prevData => {
      // Keep only the last 20 time points
      const newData = [...prevData, { time, payment: paymentCount, offer: offerCount }];
      if (newData.length > 20) {
        return newData.slice(newData.length - 20);
      }
      return newData;
    });
  }, [paymentCount, offerCount]);

  // Initialize with empty data points if needed
  useEffect(() => {
    if (data.length === 0) {
      const initialData: ChartData[] = [];
      const now = new Date();
      
      // Create some initial empty data points at 30-second intervals
      for (let i = 5; i >= 0; i--) {
        const pastTime = new Date(now.getTime() - i * 30000);
        initialData.push({
          time: pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          payment: 0,
          offer: 0
        });
      }
      
      setData(initialData);
    }
  }, [data.length]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Live transaction volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOffer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              minTickGap={20}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={30}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            />
            <Area
              type="monotone"
              dataKey="payment"
              stackId="1"
              stroke="#8B5CF6"
              fill="url(#colorPayment)"
            />
            <Area
              type="monotone"
              dataKey="offer"
              stackId="1"
              stroke="#3B82F6"
              fill="url(#colorOffer)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
