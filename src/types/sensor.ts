
export type SensorStatus = 'good' | 'moderate' | 'poor' | 'unknown';

export interface SensorReading {
  value: number;
  status: SensorStatus;
  unit: string;
}

export interface SensorData {
  id: string;
  name: string;
  reading: SensorReading;
  thresholds: {
    good: [number, number]; // min, max
    moderate: [number, number]; // min, max
  };
  timestamp: Date;
}

export interface SystemStatus {
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: Date;
  isOnline: boolean;
}
