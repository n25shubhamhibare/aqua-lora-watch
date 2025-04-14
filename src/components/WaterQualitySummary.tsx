
import React from 'react';
import { SensorData } from '../types/sensor';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface WaterQualitySummaryProps {
  sensors: SensorData[];
}

const WaterQualitySummary: React.FC<WaterQualitySummaryProps> = ({ sensors }) => {
  // Count sensors by status
  const statusCounts = {
    good: sensors.filter(s => s.reading.status === 'good').length,
    moderate: sensors.filter(s => s.reading.status === 'moderate').length,
    poor: sensors.filter(s => s.reading.status === 'poor').length
  };
  
  // Determine overall status
  let overallStatus: 'good' | 'moderate' | 'poor' = 'good';
  if (statusCounts.poor > 0) {
    overallStatus = 'poor';
  } else if (statusCounts.moderate > 0) {
    overallStatus = 'moderate';
  }
  
  // Determine message and icon
  let message: string;
  let Icon: React.ElementType;
  let statusClass: string;
  
  switch (overallStatus) {
    case 'good':
      message = 'Water quality is good';
      Icon = CheckCircle;
      statusClass = 'text-status-good';
      break;
    case 'moderate':
      message = 'Water quality needs attention';
      Icon = AlertTriangle;
      statusClass = 'text-status-moderate';
      break;
    case 'poor':
      message = 'Water quality is critical';
      Icon = AlertCircle;
      statusClass = 'text-status-poor';
      break;
  }
  
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-3">
        <Icon className={`h-8 w-8 ${statusClass}`} />
        <div>
          <h2 className={`font-medium text-lg ${statusClass}`}>{message}</h2>
          <p className="text-sm text-gray-600">
            {statusCounts.good} good, {statusCounts.moderate} moderate, {statusCounts.poor} critical
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterQualitySummary;
