
import React from 'react';
import { SensorData } from '../types/sensor';
import StatusBadge from './StatusBadge';
import SensorGauge from './SensorGauge';
import { formatSensorValue } from '../utils/sensor-utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockHistoryData, getSensorColor } from '../utils/sensor-utils';

interface SensorCardProps {
  sensor: SensorData;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const { name, reading, timestamp } = sensor;
  const chartData = generateMockHistoryData(sensor, 4, 30); // 4 hours of data, 30 min intervals
  const chartColor = getSensorColor(sensor.id);
  
  return (
    <div className="sensor-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500">
            {formatSensorValue(reading.value, reading.unit)}
          </p>
        </div>
        <StatusBadge status={reading.status} />
      </div>
      
      <div className="mb-6">
        <SensorGauge sensor={sensor} />
      </div>
      
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis 
              dataKey="time" 
              tick={false}
              axisLine={false}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              formatter={(value: number) => [formatSensorValue(value, reading.unit), "Value"]}
              labelFormatter={(label: Date) => {
                if (label instanceof Date) {
                  return label.toLocaleTimeString();
                }
                return '';
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              fill={`${chartColor}33`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-right">
        Updated: {timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SensorCard;
