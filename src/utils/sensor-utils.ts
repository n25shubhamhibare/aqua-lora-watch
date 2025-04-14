
import { SensorData, SensorStatus } from "../types/sensor";

/**
 * Determine sensor status based on thresholds
 */
export const determineSensorStatus = (
  value: number,
  goodRange: [number, number],
  moderateRange: [number, number]
): SensorStatus => {
  if (value >= goodRange[0] && value <= goodRange[1]) {
    return "good";
  } else if (
    (value >= moderateRange[0] && value < goodRange[0]) ||
    (value > goodRange[1] && value <= moderateRange[1])
  ) {
    return "moderate";
  } else {
    return "poor";
  }
};

/**
 * Format sensor value with proper units
 */
export const formatSensorValue = (
  value: number,
  unit: string,
  precision: number = 2
): string => {
  return `${value.toFixed(precision)} ${unit}`;
};

/**
 * Get status text representation
 */
export const getStatusText = (status: SensorStatus): string => {
  switch (status) {
    case "good":
      return "Good";
    case "moderate":
      return "Moderate";
    case "poor":
      return "Poor";
    default:
      return "Unknown";
  }
};

/**
 * Get a color for chart based on sensor type
 */
export const getSensorColor = (sensorId: string): string => {
  switch (sensorId) {
    case "ph":
      return "#8884d8"; // purple
    case "turbidity":
      return "#82ca9d"; // green
    case "tds":
      return "#8dd1e1"; // light blue
    case "conductivity":
      return "#a4de6c"; // light green
    case "oxygen":
      return "#ffc658"; // yellow
    default:
      return "#83a6ed"; // blue
  }
};

/**
 * Generate mock historical data for a sensor 
 */
export const generateMockHistoryData = (
  sensor: SensorData,
  hours: number = 24,
  interval: number = 30 // minutes
) => {
  const now = new Date();
  const data = [];
  const value = sensor.reading.value;
  const variance = value * 0.2; // 20% variance

  for (let i = hours * 60; i >= 0; i -= interval) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    
    // Generate random value within variance
    const randomFactor = Math.random() * 2 - 1; // between -1 and 1
    const newValue = value + randomFactor * variance;
    
    // Ensure it's within possible range
    const clampedValue = Math.max(0, newValue);
    
    // Determine status based on thresholds
    const status = determineSensorStatus(
      clampedValue,
      sensor.thresholds.good,
      sensor.thresholds.moderate
    );
    
    data.push({
      time,
      value: clampedValue,
      status
    });
  }
  
  return data;
};
