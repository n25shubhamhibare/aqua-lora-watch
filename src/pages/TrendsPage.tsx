
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { generateMockHistoryData } from '../utils/sensor-utils';
import { initialSensors } from '../services/mockDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorData } from '../types/sensor';

const timeRanges = [
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' }
];

const TrendsPage = () => {
  const [selectedSensor, setSelectedSensor] = useState<string>(initialSensors[0].id);
  const [timeRange, setTimeRange] = useState<string>('day');
  
  // Find the selected sensor from the initialSensors
  const sensor = initialSensors.find(s => s.id === selectedSensor) || initialSensors[0];
  
  // Generate historical data based on the selected time range
  const generateChartData = (sensor: SensorData, range: string) => {
    switch (range) {
      case 'day':
        return generateMockHistoryData(sensor, 24, 60);
      case 'week':
        return generateMockHistoryData(sensor, 168, 240);
      case 'month':
        return generateMockHistoryData(sensor, 720, 720);
      default:
        return generateMockHistoryData(sensor, 24, 60);
    }
  };
  
  const chartData = generateChartData(sensor, timeRange);
  
  // Format date for display
  const formatDate = (date: Date) => {
    if (timeRange === 'day') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === 'week') {
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Determine min and max values for the chart
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values) * 0.9;
  const maxValue = Math.max(...values) * 1.1;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Water Quality Trends</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sensor</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sensor" />
              </SelectTrigger>
              <SelectContent>
                {initialSensors.map(sensor => (
                  <SelectItem key={sensor.id} value={sensor.id}>
                    {sensor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Time Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day" value={timeRange} onValueChange={setTimeRange}>
              <TabsList className="grid grid-cols-3">
                {timeRanges.map(range => (
                  <TabsTrigger key={range.value} value={range.value}>
                    {range.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{sensor.name} Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ChartContainer 
              config={{
                [sensor.id]: {
                  label: sensor.name,
                  color: "#8884d8"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(time) => formatDate(time)}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[minValue, maxValue]}
                    tickFormatter={(value) => value.toFixed(1)}
                    label={{ value: sensor.reading.unit, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(label) => {
                      if (label instanceof Date) {
                        return formatDate(label);
                      }
                      return '';
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)} ${sensor.reading.unit}`, sensor.name]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={sensor.name} 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Average</h3>
              <p className="text-xl font-medium">
                {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)} {sensor.reading.unit}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Minimum</h3>
              <p className="text-xl font-medium">
                {Math.min(...values).toFixed(2)} {sensor.reading.unit}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Maximum</h3>
              <p className="text-xl font-medium">
                {Math.max(...values).toFixed(2)} {sensor.reading.unit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsPage;
