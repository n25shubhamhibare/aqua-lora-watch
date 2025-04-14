
import { SensorData, SystemStatus } from "../types/sensor";
import { determineSensorStatus } from "../utils/sensor-utils";

// Initial sensor data
export const initialSensors: SensorData[] = [
  {
    id: "ph",
    name: "pH Level",
    reading: {
      value: 7.2,
      status: "good",
      unit: "pH"
    },
    thresholds: {
      good: [6.5, 8.0],
      moderate: [5.0, 9.0]
    },
    timestamp: new Date()
  },
  {
    id: "turbidity",
    name: "Turbidity",
    reading: {
      value: 2.3,
      status: "good",
      unit: "NTU"
    },
    thresholds: {
      good: [0, 5],
      moderate: [5, 10]
    },
    timestamp: new Date()
  },
  {
    id: "tds",
    name: "Total Dissolved Solids",
    reading: {
      value: 180,
      status: "good",
      unit: "ppm"
    },
    thresholds: {
      good: [0, 300],
      moderate: [300, 500]
    },
    timestamp: new Date()
  },
  {
    id: "conductivity",
    name: "Conductivity",
    reading: {
      value: 350,
      status: "good",
      unit: "μS/cm"
    },
    thresholds: {
      good: [100, 500],
      moderate: [50, 800]
    },
    timestamp: new Date()
  },
  {
    id: "oxygen",
    name: "Dissolved Oxygen",
    reading: {
      value: 8.1,
      status: "good",
      unit: "mg/L"
    },
    thresholds: {
      good: [6.5, 9.5],
      moderate: [5.0, 12.0]
    },
    timestamp: new Date()
  }
];

// Initial system status
export const initialSystemStatus: SystemStatus = {
  batteryLevel: 78,
  signalStrength: 85,
  lastUpdate: new Date(),
  isOnline: true
};

// Update a sensor with random fluctuations
const updateSensor = (sensor: SensorData): SensorData => {
  const variance = 0.1; // 10% change maximum
  const currentValue = sensor.reading.value;
  
  // Generate random fluctuation
  const randomChange = (Math.random() * 2 - 1) * variance * currentValue;
  let newValue = currentValue + randomChange;
  
  // Ensure values stay within realistic ranges
  switch(sensor.id) {
    case "ph":
      newValue = Math.max(0, Math.min(14, newValue));
      break;
    case "turbidity":
    case "tds":
    case "conductivity":
    case "oxygen":
      newValue = Math.max(0, newValue);
      break;
  }
  
  // Update status based on new value and thresholds
  const status = determineSensorStatus(
    newValue, 
    sensor.thresholds.good, 
    sensor.thresholds.moderate
  );
  
  return {
    ...sensor,
    reading: {
      ...sensor.reading,
      value: newValue,
      status
    },
    timestamp: new Date()
  };
};

// Update system status
const updateSystemStatus = (status: SystemStatus): SystemStatus => {
  // Randomly fluctuate battery level (always decreasing)
  const batteryDrain = Math.random() * 0.5;
  const newBatteryLevel = Math.max(0, status.batteryLevel - batteryDrain);
  
  // Randomly fluctuate signal strength
  const signalChange = (Math.random() * 2 - 1) * 5;
  const newSignalStrength = Math.max(0, Math.min(100, status.signalStrength + signalChange));
  
  return {
    ...status,
    batteryLevel: newBatteryLevel,
    signalStrength: newSignalStrength,
    lastUpdate: new Date(),
    isOnline: Math.random() > 0.02 // 2% chance of going offline
  };
};

// Simulate IOT data updates (exported for use in components)
export const simulateDataUpdates = (
  currentSensors: SensorData[],
  currentStatus: SystemStatus,
  setData: (sensors: SensorData[]) => void,
  setStatus: (status: SystemStatus) => void
) => {
  const interval = setInterval(() => {
    // Update all sensors
    const updatedSensors = currentSensors.map(updateSensor);
    
    // Update system status
    const updatedStatus = updateSystemStatus(currentStatus);
    
    // Set new data
    setData(updatedSensors);
    setStatus(updatedStatus);
  }, 5000); // Update every 5 seconds
  
  return interval;
};
