
import React from 'react';
import { SensorData } from '../types/sensor';
import { Bell, AlertCircle } from 'lucide-react';

interface NotificationPanelProps {
  sensors: SensorData[];
}

interface Notification {
  id: string;
  sensor: string;
  message: string;
  time: Date;
  severity: 'warning' | 'critical';
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ sensors }) => {
  // Generate notifications based on sensor statuses
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    
    sensors.forEach(sensor => {
      if (sensor.reading.status === 'moderate') {
        notifications.push({
          id: `${sensor.id}-${Date.now()}-moderate`,
          sensor: sensor.name,
          message: `${sensor.name} level is outside optimal range`,
          time: new Date(),
          severity: 'warning'
        });
      } else if (sensor.reading.status === 'poor') {
        notifications.push({
          id: `${sensor.id}-${Date.now()}-poor`,
          sensor: sensor.name,
          message: `${sensor.name} level is critical`,
          time: new Date(),
          severity: 'critical'
        });
      }
    });
    
    return notifications;
  };
  
  const notifications = generateNotifications();
  
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {notifications.length > 0 && (
            <div className="flex items-center space-x-1">
              <Bell className="h-4 w-4 text-status-moderate" />
              <span className="text-sm font-medium text-status-moderate">
                {notifications.length} alerts
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-2 max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded-md text-sm ${
                  notification.severity === 'critical' 
                    ? 'bg-status-poor/10 border border-status-poor/20' 
                    : 'bg-status-moderate/10 border border-status-moderate/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    notification.severity === 'critical' 
                      ? 'text-status-poor' 
                      : 'text-status-moderate'
                  }`} />
                  <div>
                    <p className="font-medium">{notification.sensor}</p>
                    <p className="text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
