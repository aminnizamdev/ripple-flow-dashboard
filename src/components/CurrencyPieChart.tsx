
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrencyData {
  currency: string;
  value: number;
  color: string;
}

interface CurrencyPieChartProps {
  currencies: Map<string, number>;
  className?: string;
}

const COLORS = [
  "#9b87f5", // Primary ripple
  "#7e69ab", // Secondary ripple
  "#6e59a5", // Tertiary ripple
  "#5144a6", // Dark ripple
  "#8BC34A", // Green
  "#FF9800", // Orange
  "#00BCD4", // Cyan
  "#F44336", // Red
  "#FFEB3B", // Yellow
  "#673AB7", // Deep purple
  "#E91E63", // Pink
];

export function CurrencyPieChart({ currencies, className }: CurrencyPieChartProps) {
  // Convert the currency map to chart data
  const chartData: CurrencyData[] = Array.from(currencies.entries())
    .map(([currency, value], index) => ({
      currency,
      value,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value) // Sort by value descending
    .slice(0, 10); // Only show top 10 currencies

  // Calculate "Others" if there are more than 10 currencies
  if (currencies.size > 10) {
    const topCurrenciesTotal = chartData.reduce((sum, item) => sum + item.value, 0);
    const allCurrenciesTotal = Array.from(currencies.values()).reduce((sum, value) => sum + value, 0);
    const othersValue = allCurrenciesTotal - topCurrenciesTotal;
    
    if (othersValue > 0) {
      chartData.push({
        currency: "Others",
        value: othersValue,
        color: "#CCCCCC"
      });
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Currency Distribution</CardTitle>
        <CardDescription>Transaction volume by currency</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[240px] text-muted-foreground">
            No currency data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ currency, value, percent }) => 
                  `${currency}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} transactions`, 'Volume']}
                contentStyle={{ 
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
