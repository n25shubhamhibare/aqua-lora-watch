
import React from 'react';
import { SystemStatus } from '../types/sensor';
import { Activity, Battery, Signal, AlertTriangle } from 'lucide-react';

interface SystemStatusBarProps {
  status: SystemStatus;
}

const getBatteryIcon = (level: number) => {
  if (level > 75) return <Battery className="h-4 w-4 text-status-good" />;
  if (level > 25) return <Battery className="h-4 w-4 text-status-moderate" />;
  return <Battery className="h-4 w-4 text-status-poor" />;
};

const getSignalIcon = (strength: number) => {
  if (strength > 75) return <Signal className="h-4 w-4 text-status-good" />;
  if (strength > 35) return <Signal className="h-4 w-4 text-status-moderate" />;
  return <Signal className="h-4 w-4 text-status-poor" />;
};

const SystemStatusBar: React.FC<SystemStatusBarProps> = ({ status }) => {
  const { batteryLevel, signalStrength, lastUpdate, isOnline } = status;
  
  const statusString = isOnline ? 'Online' : 'Offline';
  const statusClass = isOnline ? 'text-status-good' : 'text-status-poor';
  
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Activity className={`h-4 w-4 ${statusClass}`} />
            <span className={`font-medium ${statusClass}`}>{statusString}</span>
          </div>
          
          {!isOnline && (
            <div className="flex items-center space-x-1 text-status-poor">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Connection Lost</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {getBatteryIcon(batteryLevel)}
            <span>{Math.round(batteryLevel)}%</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {getSignalIcon(signalStrength)}
            <span>{Math.round(signalStrength)}%</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusBar;
