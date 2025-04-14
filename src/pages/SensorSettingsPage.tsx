
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Check, Settings } from 'lucide-react';

const SensorSettingsPage = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState({
    ph: { min: 6.5, max: 8.5 },
    temperature: { min: 10, max: 30 },
    turbidity: { min: 0, max: 5 },
    dissolvedOxygen: { min: 6, max: 12 },
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    frequency: 'immediate',
  });
  
  const [calibration, setCalibration] = useState({
    lastCalibrated: '2023-10-15',
    calibrationDue: '2024-04-15',
    autoCalibration: false,
  });
  
  const handleThresholdChange = (sensor, type, value) => {
    setThresholds(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: value
      }
    }));
  };
  
  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleCalibrationToggle = () => {
    setCalibration(prev => ({
      ...prev,
      autoCalibration: !prev.autoCalibration
    }));
    
    toast({
      title: `Auto-calibration ${calibration.autoCalibration ? 'disabled' : 'enabled'}`,
      description: `Sensors will ${calibration.autoCalibration ? 'no longer' : 'now'} calibrate automatically`,
      variant: calibration.autoCalibration ? "destructive" : "default",
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your sensor settings have been updated successfully",
      variant: "default",
    });
  };
  
  const handleResetDefaults = () => {
    // Reset to default values
    setThresholds({
      ph: { min: 6.5, max: 8.5 },
      temperature: { min: 10, max: 30 },
      turbidity: { min: 0, max: 5 },
      dissolvedOxygen: { min: 6, max: 12 },
    });
    
    setNotifications({
      email: true,
      sms: false,
      push: true,
      frequency: 'immediate',
    });
    
    toast({
      title: "Defaults restored",
      description: "All settings have been reset to default values",
      variant: "default",
    });
  };
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sensor Settings</h1>
        <Button onClick={handleSaveSettings} className="bg-primary">
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="thresholds">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="thresholds">Alarm Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alarm Thresholds</CardTitle>
              <CardDescription>
                Configure when alarms should be triggered based on sensor readings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* pH Thresholds */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="ph-threshold">pH Level</Label>
                  <div className="text-sm text-gray-500">
                    Min: {thresholds.ph.min} | Max: {thresholds.ph.max}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ph-min">Minimum</Label>
                    <Input 
                      id="ph-min" 
                      type="number" 
                      value={thresholds.ph.min} 
                      onChange={(e) => handleThresholdChange('ph', 'min', parseFloat(e.target.value))}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ph-max">Maximum</Label>
                    <Input 
                      id="ph-max" 
                      type="number" 
                      value={thresholds.ph.max} 
                      onChange={(e) => handleThresholdChange('ph', 'max', parseFloat(e.target.value))}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
              
              {/* Temperature Thresholds */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="temp-threshold">Temperature (°C)</Label>
                  <div className="text-sm text-gray-500">
                    Min: {thresholds.temperature.min}°C | Max: {thresholds.temperature.max}°C
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temp-min">Minimum</Label>
                    <Input 
                      id="temp-min" 
                      type="number" 
                      value={thresholds.temperature.min} 
                      onChange={(e) => handleThresholdChange('temperature', 'min', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="temp-max">Maximum</Label>
                    <Input 
                      id="temp-max" 
                      type="number" 
                      value={thresholds.temperature.max} 
                      onChange={(e) => handleThresholdChange('temperature', 'max', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              {/* More sensors would follow the same pattern */}
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you want to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts via text message</p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={notifications.push} 
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calibration">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Calibration</CardTitle>
              <CardDescription>
                Manage calibration schedules and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Last Calibration</Label>
                  <p className="text-lg font-medium">{calibration.lastCalibrated}</p>
                </div>
                <div>
                  <Label>Next Calibration Due</Label>
                  <p className="text-lg font-medium">{calibration.calibrationDue}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-calibration">Auto-Calibration</Label>
                  <p className="text-sm text-gray-500">Enable automatic sensor calibration</p>
                </div>
                <Switch 
                  id="auto-calibration" 
                  checked={calibration.autoCalibration} 
                  onCheckedChange={handleCalibrationToggle}
                />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Run Manual Calibration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SensorSettingsPage;
