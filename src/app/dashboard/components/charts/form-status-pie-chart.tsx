
'use client';

import { Pie, PieChart } from 'recharts';
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
  { status: 'Published', count: Math.floor(Math.random() * 10) + 5, fill: 'hsl(var(--chart-1))' },
  { status: 'Draft', count: Math.floor(Math.random() * 5) + 2, fill: 'hsl(var(--chart-2))' },
  { status: 'Archived', count: Math.floor(Math.random() * 3) + 1, fill: 'hsl(var(--chart-3))' },
];

const chartConfig = {
  count: {
    label: 'Count',
  },
  Published: {
    label: 'Published',
    color: 'hsl(var(--chart-1))',
  },
  Draft: {
    label: 'Draft',
    color: 'hsl(var(--chart-2))',
  },
  Archived: {
    label: 'Archived',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function FormStatusPieChart() {
  return (
    <Card className="flex flex-col transition-all hover:shadow-xl hover:scale-[1.01]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Form Status Distribution</CardTitle>
        <CardDescription>Overview of your forms by status (mock data).</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
