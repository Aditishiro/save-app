
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => ({
    month,
    platforms: Math.floor(Math.random() * 5) + 1, // 1 to 5 platforms
  }));
};

const chartConfig = {
  platforms: {
    label: 'Platforms Created',
    color: 'hsl(var(--accent))', // Use accent theme color
  },
} satisfies ChartConfig;

export default function PlatformCreationsBarChart() {
  const [chartData, setChartData] = useState(generateMonthlyData());

  useEffect(() => {
    setChartData(generateMonthlyData());
  }, []);

  return (
    <Card className="transition-all hover:shadow-xl hover:scale-[1.01]">
      <CardHeader>
        <CardTitle>New Platform Creations This Year</CardTitle>
        <CardDescription>Monthly platform creation counts (mock data).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="platforms" fill="var(--color-platforms)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
