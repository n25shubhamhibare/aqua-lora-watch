
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SystemStatus } from '../types/sensor';
import { initialSystemStatus } from '../services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { HardDrive, RefreshCcw, WifiOff, Wifi, Battery, SignalHigh } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'gateway' | 'sensor-node';
  location: string;
  status: SystemStatus;
  lastMaintenance: Date;
  sensors: string[];
}

const mockDevices: Device[] = [
  {
    id: 'gateway-001',
    name: 'Main Gateway',
    type: 'gateway',
    location: 'Pump House',
    status: initialSystemStatus,
    lastMaintenance: new Date(2024, 2, 15),
    sensors: ['ph', 'turbidity', 'tds', 'conductivity', 'oxygen']
  },
  {
    id: 'node-001',
    name: 'Intake Node',
    type: 'sensor-node',
    location: 'Water Intake',
    status: {
      ...initialSystemStatus,
      batteryLevel: 62,
      signalStrength: 76
    },
    lastMaintenance: new Date(2024, 1, 10),
    sensors: ['turbidity', 'tds']
  },
  {
    id: 'node-002',
    name: 'Output Node',
    type: 'sensor-node',
    location: 'Distribution Point',
    status: {
      ...initialSystemStatus,
      batteryLevel: 89,
      signalStrength: 92
    },
    lastMaintenance: new Date(2024, 2, 28),
    sensors: ['ph', 'conductivity', 'oxygen']
  }
];

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();
  
  const filteredDevices = activeTab === 'all' 
    ? devices 
    : activeTab === 'gateway'
      ? devices.filter(d => d.type === 'gateway')
      : devices.filter(d => d.type === 'sensor-node');
      
  const handleRefreshDevice = (deviceId: string) => {
    toast({
      title: "Refreshing device",
      description: "Requesting latest status update from device..."
    });
    
    // Simulate updating device status
    setTimeout(() => {
      setDevices(prev => 
        prev.map(device => {
          if (device.id === deviceId) {
            // Randomize status values a bit
            return {
              ...device,
              status: {
                ...device.status,
                batteryLevel: Math.min(100, device.status.batteryLevel + Math.floor(Math.random() * 5)),
                signalStrength: Math.min(100, Math.max(60, device.status.signalStrength + (Math.random() > 0.5 ? 5 : -5))),
                lastUpdate: new Date(),
                isOnline: true
              }
            };
          }
          return device;
        })
      );
      
      toast({
        title: "Device refreshed",
        description: "Successfully updated device status",
      });
    }, 2000);
  };
  
  const restartDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    
    toast({
      title: "Restarting device",
      description: `Sending restart command to ${device.name}...`
    });
    
    // Simulate device restart
    setDevices(prev => 
      prev.map(d => {
        if (d.id === deviceId) {
          return { ...d, status: { ...d.status, isOnline: false } };
        }
        return d;
      })
    );
    
    setTimeout(() => {
      setDevices(prev => 
        prev.map(d => {
          if (d.id === deviceId) {
            return { 
              ...d, 
              status: { 
                ...d.status, 
                isOnline: true,
                lastUpdate: new Date() 
              } 
            };
          }
          return d;
        })
      );
      
      toast({
        title: "Device restarted",
        description: `${device.name} has been successfully restarted`,
      });
    }, 3000);
  };
  
  const formatMaintenanceDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Device Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Devices</CardTitle>
          <CardDescription>
            Manage your water quality monitoring devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Devices</TabsTrigger>
              <TabsTrigger value="gateway">Gateways</TabsTrigger>
              <TabsTrigger value="sensor-node">Sensor Nodes</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredDevices.map(device => (
                <Card key={device.id} className="border shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{device.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <HardDrive className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{device.type === 'gateway' ? 'Gateway' : 'Sensor Node'}</span>
                          </div>
                        </div>
                        <Badge variant={device.status.isOnline ? "success" : "destructive"}>
                          {device.status.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Location</h4>
                            <p>{device.location}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Sensors</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {device.sensors.map(sensorId => (
                                <Badge key={sensorId} variant="outline">
                                  {sensorId.charAt(0).toUpperCase() + sensorId.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Last Maintenance</h4>
                            <p>{formatMaintenanceDate(device.lastMaintenance)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Battery className={`h-5 w-5 ${
                                  device.status.batteryLevel > 70 
                                    ? 'text-green-500' 
                                    : device.status.batteryLevel > 30 
                                      ? 'text-amber-500' 
                                      : 'text-red-500'
                                }`} />
                                <span className="text-sm font-medium">Battery</span>
                              </div>
                              <p className="mt-1 text-lg font-medium">{device.status.batteryLevel}%</p>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                {device.status.signalStrength > 60 
                                  ? <SignalHigh className="h-5 w-5 text-green-500" /> 
                                  : <SignalHigh className="h-5 w-5 text-amber-500" />
                                }
                                <span className="text-sm font-medium">Signal</span>
                              </div>
                              <p className="mt-1 text-lg font-medium">{device.status.signalStrength}%</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Last Update</h4>
                            <p>{device.status.lastUpdate.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRefreshDevice(device.id)}
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Refresh
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => restartDevice(device.id)}
                            >
                              Restart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagementPage;
