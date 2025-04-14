
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { initialSensors } from '../services/mockDataService';
import { SensorData } from '../types/sensor';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface ThresholdSettings {
  goodMin: number;
  goodMax: number;
  moderateMin: number;
  moderateMax: number;
}

const SensorSettingsPage = () => {
  const [sensors, setSensors] = useState<SensorData[]>(initialSensors);
  const [settings, setSettings] = useState<Record<string, ThresholdSettings>>(
    initialSensors.reduce((acc, sensor) => {
      return {
        ...acc,
        [sensor.id]: {
          goodMin: sensor.thresholds.good[0],
          goodMax: sensor.thresholds.good[1],
          moderateMin: sensor.thresholds.moderate[0],
          moderateMax: sensor.thresholds.moderate[1]
        }
      };
    }, {})
  );
  const [activeTab, setActiveTab] = useState(sensors[0].id);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    initialSensors.reduce((acc, sensor) => ({ ...acc, [sensor.id]: true }), {})
  );
  const { toast } = useToast();
  
  const handleSaveSettings = (sensorId: string) => {
    // In a real app, this would send settings to an API
    const sensorSettings = settings[sensorId];
    
    // Update local sensor state
    setSensors(prev => 
      prev.map(sensor => {
        if (sensor.id === sensorId) {
          return {
            ...sensor,
            thresholds: {
              good: [sensorSettings.goodMin, sensorSettings.goodMax],
              moderate: [sensorSettings.moderateMin, sensorSettings.moderateMax]
            }
          };
        }
        return sensor;
      })
    );
    
    toast({
      title: "Settings saved",
      description: `Successfully updated settings for ${sensors.find(s => s.id === sensorId)?.name}`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    });
  };
  
  const handleThresholdChange = (
    sensorId: string, 
    thresholdType: keyof ThresholdSettings, 
    value: number[]
  ) => {
    setSettings(prev => ({
      ...prev,
      [sensorId]: {
        ...prev[sensorId],
        [thresholdType]: value[0]
      }
    }));
  };
  
  const toggleNotifications = (sensorId: string) => {
    setNotifications(prev => ({
      ...prev,
      [sensorId]: !prev[sensorId]
    }));
    
    const sensor = sensors.find(s => s.id === sensorId);
    toast({
      title: prev => `Notifications ${notifications[sensorId] ? 'disabled' : 'enabled'}`,
      description: `Notification settings updated for ${sensor?.name}`,
    });
  };
  
  const getUnit = (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor?.reading.unit || '';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sensor Settings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Threshold Configuration</CardTitle>
          <CardDescription>
            Configure alert thresholds for each water quality parameter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5">
              {sensors.map(sensor => (
                <TabsTrigger key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sensors.map(sensor => (
              <TabsContent key={sensor.id} value={sensor.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-medium">Good Range</h3>
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label>Minimum ({getUnit(sensor.id)})</label>
                            <span>{settings[sensor.id].goodMin}</span>
                          </div>
                          <Slider 
                            value={[settings[sensor.id].goodMin]} 
                            min={settings[sensor.id].moderateMin} 
                            max={settings[sensor.id].goodMax}
                            step={0.1}
                            onValueChange={(value) => handleThresholdChange(sensor.id, 'goodMin', value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label>Maximum ({getUnit(sensor.id)})</label>
                            <span>{settings[sensor.id].goodMax}</span>
                          </div>
                          <Slider 
                            value={[settings[sensor.id].goodMax]} 
                            min={settings[sensor.id].goodMin} 
                            max={settings[sensor.id].moderateMax}
                            step={0.1}
                            onValueChange={(value) => handleThresholdChange(sensor.id, 'goodMax', value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 font-medium">Moderate Range</h3>
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label>Minimum ({getUnit(sensor.id)})</label>
                            <span>{settings[sensor.id].moderateMin}</span>
                          </div>
                          <Slider 
                            value={[settings[sensor.id].moderateMin]} 
                            min={settings[sensor.id].moderateMin * 0.5} 
                            max={settings[sensor.id].goodMin}
                            step={0.1}
                            onValueChange={(value) => handleThresholdChange(sensor.id, 'moderateMin', value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label>Maximum ({getUnit(sensor.id)})</label>
                            <span>{settings[sensor.id].moderateMax}</span>
                          </div>
                          <Slider 
                            value={[settings[sensor.id].moderateMax]} 
                            min={settings[sensor.id].goodMax} 
                            max={settings[sensor.id].moderateMax * 1.5}
                            step={0.1}
                            onValueChange={(value) => handleThresholdChange(sensor.id, 'moderateMax', value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-medium">Notification Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Enable Notifications</span>
                          <Switch 
                            checked={notifications[sensor.id]} 
                            onCheckedChange={() => toggleNotifications(sensor.id)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sound Alerts</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email Alerts</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="mb-2 font-medium">Current Reading</h3>
                      <div className="text-2xl font-bold">
                        {sensor.reading.value.toFixed(2)} {getUnit(sensor.id)}
                      </div>
                      <div className={`text-sm mt-1 ${
                        sensor.reading.status === 'good' 
                          ? 'text-green-600' 
                          : sensor.reading.status === 'moderate' 
                            ? 'text-amber-600' 
                            : 'text-red-600'
                      }`}>
                        Status: {sensor.reading.status.charAt(0).toUpperCase() + sensor.reading.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button onClick={() => handleSaveSettings(sensor.id)}>
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorSettingsPage;
