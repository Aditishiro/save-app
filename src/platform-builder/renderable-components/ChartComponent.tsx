
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import PlaceholderComponent from './PlaceholderComponent';


interface ChartComponentProps {
  instance: PlatformComponentInstance;
}

// Mock data generation for demonstration
const generateChartData = (keys: string[]) => {
  if (keys.length < 2) return [];
  const [nameKey, valueKey] = keys;
  
  return [
    { [nameKey]: 'Equities', [valueKey]: Math.floor(Math.random() * 50000) + 10000, fill: 'hsl(var(--chart-1))' },
    { [nameKey]: 'Bonds', [valueKey]: Math.floor(Math.random() * 40000) + 10000, fill: 'hsl(var(--chart-2))' },
    { [nameKey]: 'Real Estate', [valueKey]: Math.floor(Math.random() * 25000) + 5000, fill: 'hsl(var(--chart-3))' },
    { [nameKey]: 'Commodities', [valueKey]: Math.floor(Math.random() * 15000) + 5000, fill: 'hsl(var(--chart-4))' },
    { [nameKey]: 'Cash', [valueKey]: Math.floor(Math.random() * 10000) + 2000, fill: 'hsl(var(--chart-5))' },
  ];
};


export default function ChartComponent({ instance }: ChartComponentProps) {
  const { configuredValues } = instance;

  const title = configuredValues?.title || 'Chart';
  const description = configuredValues?.description;
  const chartType = configuredValues?.chartType || 'bar'; // 'pie' or 'bar'
  const dataKeys = (configuredValues?.dataKeys || 'name,value').split(',').map((k: string) => k.trim());
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (dataKeys.length >= 2) {
      setChartData(generateChartData(dataKeys));
    }
  }, [configuredValues.dataKeys]);

  if (dataKeys.length < 2) {
    return <PlaceholderComponent instance={instance} />;
  }
  
  const [nameKey, valueKey] = dataKeys;

  const chartConfig = {
    [valueKey]: {
      label: configuredValues?.yAxisLabel || 'Value',
    },
    ...chartData.reduce((acc, item) => {
        const name = item[nameKey];
        if (name) {
            acc[name] = {
                label: name,
                color: item.fill,
            }
        }
        return acc;
    }, {})
  } satisfies ChartConfig;


  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey={valueKey}
                nameKey={nameKey}
                innerRadius={60}
                strokeWidth={5}
              />
              <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
            </PieChart>
          </ChartContainer>
        );
      case 'bar':
        return (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={nameKey} tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey={valueKey} fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
        );
      default:
        return <p>Unsupported chart type: {chartType}</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

