
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { SensorData } from '../types/sensor';

interface AlertBannerProps {
  sensors: SensorData[];
  onClose: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ sensors, onClose }) => {
  // Get poor status sensors
  const criticalSensors = sensors.filter(sensor => 
    sensor.reading.status === 'poor'
  );
  
  if (criticalSensors.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-status-poor/20 border-l-4 border-status-poor p-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-status-poor h-5 w-5" />
        <div>
          <p className="font-medium text-status-poor">
            Critical Alert{criticalSensors.length > 1 ? 's' : ''}
          </p>
          <p className="text-sm">
            {criticalSensors.map(s => s.name).join(', ')} {criticalSensors.length > 1 ? 'are' : 'is'} at critical levels
          </p>
        </div>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-500 hover:text-gray-700"
        aria-label="Close alert"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default AlertBanner;
