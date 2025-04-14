
import React from 'react';
import { SensorStatus } from '../types/sensor';
import { getStatusText } from '../utils/sensor-utils';

interface StatusBadgeProps {
  status: SensorStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const baseClass = 'status-badge';
  
  let statusClass = '';
  switch (status) {
    case 'good':
      statusClass = 'status-badge-good';
      break;
    case 'moderate':
      statusClass = 'status-badge-moderate';
      break;
    case 'poor':
      statusClass = 'status-badge-poor';
      break;
    default:
      statusClass = 'bg-gray-200 text-gray-800';
  }
  
  return (
    <span className={`${baseClass} ${statusClass} ${className}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
