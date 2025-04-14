
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, MoreVertical, PlusCircle, RefreshCw, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for devices
const initialDevices = [
  {
    id: 'device-001',
    name: 'Main Water Tank Sensor',
    type: 'pH & Temperature',
    status: 'online',
    battery: 87,
    lastMaintenance: '2023-12-10',
    firmwareVersion: '3.2.1',
    location: 'Water Tank 1'
  },
  {
    id: 'device-002',
    name: 'Outlet Turbidity Sensor',
    type: 'Turbidity',
    status: 'online',
    battery: 92,
    lastMaintenance: '2024-01-15',
    firmwareVersion: '3.1.7',
    location: 'Outlet Pipe'
  },
  {
    id: 'device-003',
    name: 'Oxygen Level Monitor',
    type: 'Dissolved Oxygen',
    status: 'offline',
    battery: 23,
    lastMaintenance: '2023-11-05',
    firmwareVersion: '3.0.9',
    location: 'Aerator Tank'
  },
  {
    id: 'device-004',
    name: 'Secondary Tank Sensor',
    type: 'pH & Temperature',
    status: 'maintenance',
    battery: 65,
    lastMaintenance: '2024-02-20',
    firmwareVersion: '3.2.0',
    location: 'Water Tank 2'
  }
];

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState(initialDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    location: ''
  });
  
  const { toast } = useToast();
  
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddDevice = () => {
    // Validation
    if (!newDevice.name || !newDevice.type || !newDevice.location) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    // Add the new device
    const device = {
      id: `device-${(devices.length + 1).toString().padStart(3, '0')}`,
      name: newDevice.name,
      type: newDevice.type,
      status: 'online',
      battery: 100,
      lastMaintenance: new Date().toISOString().split('T')[0],
      firmwareVersion: '3.2.1',
      location: newDevice.location
    };
    
    setDevices([...devices, device]);
    setNewDevice({ name: '', type: '', location: '' });
    setIsAddDeviceOpen(false);
    
    toast({
      title: "Device Added",
      description: `${device.name} has been added successfully`,
      variant: "default",
    });
  };
  
  const handleRebootDevice = (deviceId) => {
    // Simulate rebooting a device
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'rebooting' } 
          : device
      )
    );
    
    toast({
      title: "Device Rebooting",
      description: "The device is now rebooting. This may take a minute.",
      variant: "default",
    });
    
    // Simulate the device coming back online after rebooting
    setTimeout(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'online' } 
            : device
        )
      );
      
      toast({
        title: "Reboot Complete",
        description: "The device is now back online.",
        variant: "default",
      });
    }, 3000);
  };
  
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Maintenance</Badge>;
      case 'rebooting':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Rebooting</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Device Management</h1>
        <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Add a new sensor device to your monitoring system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input 
                  id="device-name" 
                  value={newDevice.name} 
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})} 
                  placeholder="e.g. Main Tank pH Sensor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <Input 
                  id="device-type" 
                  value={newDevice.type} 
                  onChange={(e) => setNewDevice({...newDevice, type: e.target.value})} 
                  placeholder="e.g. pH & Temperature"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-location">Location</Label>
                <Input 
                  id="device-location" 
                  value={newDevice.location} 
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})} 
                  placeholder="e.g. Water Tank 1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDevice}>
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search devices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDevices.map(device => (
          <Card key={device.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{device.name}</CardTitle>
                  <CardDescription>{device.type}</CardDescription>
                </div>
                {renderStatusBadge(device.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{device.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Battery:</span>
                  <span>{device.battery}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span>{device.lastMaintenance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Firmware:</span>
                  <span>v{device.firmwareVersion}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRebootDevice(device.id)}
                disabled={device.status === 'rebooting'}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reboot
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit Device</DropdownMenuItem>
                  <DropdownMenuItem>Update Firmware</DropdownMenuItem>
                  <DropdownMenuItem>View History</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Remove Device
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredDevices.length === 0 && (
        <div className="text-center py-10">
          <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No devices found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new device.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeviceManagementPage;
