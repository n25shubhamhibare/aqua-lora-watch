
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SensorCard from '../components/SensorCard';
import SystemStatusBar from '../components/SystemStatusBar';
import NotificationPanel from '../components/NotificationPanel';
import AlertBanner from '../components/AlertBanner';
import WaterQualitySummary from '../components/WaterQualitySummary';
import { SensorData, SystemStatus } from '../types/sensor';
import { initialSensors, initialSystemStatus, simulateDataUpdates } from '../services/mockDataService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sensors, setSensors] = useState<SensorData[]>(initialSensors);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(initialSystemStatus);
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const { toast } = useToast();
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = simulateDataUpdates(
      sensors,
      systemStatus,
      setSensors,
      setSystemStatus
    );
    
    return () => clearInterval(interval);
  }, [sensors, systemStatus]);
  
  // Show toast notifications for status changes
  useEffect(() => {
    const poorStatusSensors = sensors.filter(s => s.reading.status === 'poor');
    
    poorStatusSensors.forEach(sensor => {
      toast({
        title: `Alert: ${sensor.name}`,
        description: `${sensor.name} has reached a critical level of ${sensor.reading.value.toFixed(2)} ${sensor.reading.unit}`,
        variant: "destructive",
      });
    });
  }, [sensors, toast]);
  
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Alert Banner */}
        {showAlertBanner && (
          <div className="mb-4">
            <AlertBanner 
              sensors={sensors} 
              onClose={() => setShowAlertBanner(false)} 
            />
          </div>
        )}
        
        {/* Header */}
        <div className="mb-6">
          <Header />
        </div>
        
        {/* System Status Bar */}
        <div className="mb-6">
          <SystemStatusBar status={systemStatus} />
        </div>
        
        {/* Water Quality Summary */}
        <div className="mb-6">
          <WaterQualitySummary sensors={sensors} />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Sensor Cards Grid - Takes 2/3 of the space */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sensors.map(sensor => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
          
          {/* Notification Panel - Takes 1/3 of the space */}
          <div className="col-span-1">
            <NotificationPanel sensors={sensors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
