
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

const chartData = [
  { day: 'Mon', submissions: Math.floor(Math.random() * 20) + 5 },
  { day: 'Tue', submissions: Math.floor(Math.random() * 20) + 5 },
  { day: 'Wed', submissions: Math.floor(Math.random() * 20) + 5 },
  { day: 'Thu', submissions: Math.floor(Math.random() * 20) + 5 },
  { day: 'Fri', submissions: Math.floor(Math.random() * 20) + 10 },
  { day: 'Sat', submissions: Math.floor(Math.random() * 15) + 3 },
  { day: 'Sun', submissions: Math.floor(Math.random() * 10) + 2 },
];

const chartConfig = {
  submissions: {
    label: 'Submissions',
    color: 'hsl(var(--primary))', // Use primary theme color
  },
} satisfies ChartConfig;

export default function FormSubmissionsBarChart() {
  return (
    <Card className="transition-all hover:shadow-xl hover:scale-[1.01]">
      <CardHeader>
        <CardTitle>Form Submissions This Week</CardTitle>
        <CardDescription>Daily submission counts for the past 7 days (mock data).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="submissions" fill="var(--color-submissions)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
