
import React from 'react';
import { SensorData } from '../types/sensor';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { formatSensorValue } from '../utils/sensor-utils';

interface SensorGaugeProps {
  sensor: SensorData;
  size?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return '#10b981';
    case 'moderate':
      return '#f59e0b';
    case 'poor':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const SensorGauge: React.FC<SensorGaugeProps> = ({ sensor, size = 120 }) => {
  const { reading, thresholds } = sensor;
  const { value, status, unit } = reading;
  
  // Calculate percentage for gauge based on thresholds
  const calculatePercentage = () => {
    // Get the total possible range
    const min = Math.min(thresholds.moderate[0], 0);
    const max = Math.max(thresholds.moderate[1], value * 1.2);
    const range = max - min;
    
    // Calculate percentage
    return Math.min(100, Math.max(0, ((value - min) / range) * 100));
  };
  
  const percentage = calculatePercentage();
  const statusColor = getStatusColor(status);
  
  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <CircularProgressbar
        value={percentage}
        text={formatSensorValue(value, '', 1)}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: 'round',
          textSize: '16px',
          pathTransitionDuration: 0.5,
          pathColor: statusColor,
          textColor: '#6b7280',
          trailColor: '#e5e7eb',
        })}
      />
      <div className="text-center mt-2 text-sm text-gray-500">{unit}</div>
    </div>
  );
};

export default SensorGauge;
