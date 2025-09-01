
// Mock data for the monitoring system
export interface Device {
  deviceIdentifier: string;
  hostName: string;
  connectionStatus: 'online' | 'offline';
  locationLabel: string;
  hierarchicalLabels: string[];
  centralProcessingUnitUsagePercentage: number;
  randomAccessMemoryUsagePercentage: number;
  diskUsagePercentage: number;
  temperatureCelsius: number;
  lastSeenTimestampIso8601: string;
  internetProtocolAddressV4: string;
  operatingSystem: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    city: string;
    region: string;
    country: string;
    internetProtocolAddressPublic: string;
  };
}

export interface DeviceDetail {
  device: {
    deviceIdentifier: string;
    customDisplayName: string;
    labels: Record<string, string>;
    registrationTimestampIso8601: string | null;
  };
  systemInformation: {
    hostName: string;
    operatingSystem: string;
    kernelVersion: string;
    uptimeSeconds: number;
  };
  hardwareInformation: {
    centralProcessingUnitModel: string;
    centralProcessingUnitCoreCount: number;
    randomAccessMemoryTotalGigabytes: number;
    storageDevices: Array<{
      deviceName: string;
      sizeGigabytes: number;
    }>;
  };
  networkInformation: {
    online: boolean;
    interfaces: Array<{
      interfaceName: string;
      interfaceType: string;
      operationalState: string;
      internetProtocolAddressV4: string;
      internetProtocolAddressV6: string | null;
      defaultGateway: string;
      domainNameSystemServers: string[];
      mediaAccessControlAddress: string;
    }>;
  };
  geolocationInformation: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    internetProtocolAddressPublic: string;
    provider: string;
  };
  currentMetrics: {
    timestampIso8601: string;
    centralProcessingUnitUsagePercentage: number;
    systemLoadAverage: [number, number, number];
    memory: {
      totalMegabytes: number;
      usedMegabytes: number;
      usedPercentage: number;
    };
    diskUsage: Array<{
      mountPoint: string;
      usedPercentage: number;
    }>;
    temperatureCelsius: number;
    topProcesses: Array<{
      processIdentifier: number;
      commandName: string;
      centralProcessingUnitPercentage: number;
      memoryPercentage: number;
    }>;
  };
}

export const mockDevices: Device[] = [
  {
    deviceIdentifier: '1',
    hostName: 'ub-mini-01',
    connectionStatus: 'online',
    locationLabel: 'Bengaluru Office',
    hierarchicalLabels: ['India', 'Karnataka', 'Bengaluru'],
    centralProcessingUnitUsagePercentage: 24.5,
    randomAccessMemoryUsagePercentage: 67.2,
    diskUsagePercentage: 41.7,
    temperatureCelsius: 52.0,
    lastSeenTimestampIso8601: '2025-01-09T12:34:10Z',
    internetProtocolAddressV4: '192.168.1.50',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 12.9716, longitude: 77.5946, city: 'Bengaluru', region: 'KA', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  },
  {
    deviceIdentifier: '2',
    hostName: 'ub-mini-02',
    connectionStatus: 'online',
    locationLabel: 'Mumbai Branch',
    hierarchicalLabels: ['India', 'Maharashtra', 'Mumbai'],
    centralProcessingUnitUsagePercentage: 18.3,
    randomAccessMemoryUsagePercentage: 45.8,
    diskUsagePercentage: 32.1,
    temperatureCelsius: 48.5,
    lastSeenTimestampIso8601: '2025-01-09T12:32:10Z',
    internetProtocolAddressV4: '192.168.1.51',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 19.0760, longitude: 72.8777, city: 'Mumbai', region: 'MH', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  },
  {
    deviceIdentifier: '3',
    hostName: 'ub-mini-03',
    connectionStatus: 'offline',
    locationLabel: 'Delhi Regional',
    hierarchicalLabels: ['India', 'Delhi', 'New Delhi'],
    centralProcessingUnitUsagePercentage: 0,
    randomAccessMemoryUsagePercentage: 0,
    diskUsagePercentage: 28.9,
    temperatureCelsius: 0,
    lastSeenTimestampIso8601: '2025-01-09T12:19:10Z',
    internetProtocolAddressV4: '192.168.1.52',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 28.6139, longitude: 77.2090, city: 'Delhi', region: 'DL', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  },
  {
    deviceIdentifier: '4',
    hostName: 'ub-mini-04',
    connectionStatus: 'online',
    locationLabel: 'Chennai Hub',
    hierarchicalLabels: ['India', 'Tamil Nadu', 'Chennai'],
    centralProcessingUnitUsagePercentage: 76.1,
    randomAccessMemoryUsagePercentage: 82.4,
    diskUsagePercentage: 56.3,
    temperatureCelsius: 64.2,
    lastSeenTimestampIso8601: '2025-01-09T12:34:10Z',
    internetProtocolAddressV4: '192.168.1.53',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 13.0827, longitude: 80.2707, city: 'Chennai', region: 'TN', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  },
  {
    deviceIdentifier: '5',
    hostName: 'ub-mini-05',
    connectionStatus: 'online',
    locationLabel: 'Hyderabad Center',
    hierarchicalLabels: ['India', 'Telangana', 'Hyderabad'],
    centralProcessingUnitUsagePercentage: 35.7,
    randomAccessMemoryUsagePercentage: 58.9,
    diskUsagePercentage: 73.2,
    temperatureCelsius: 57.1,
    lastSeenTimestampIso8601: '2025-01-09T12:33:10Z',
    internetProtocolAddressV4: '192.168.1.54',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 17.3850, longitude: 78.4867, city: 'Hyderabad', region: 'TS', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  },
  {
    deviceIdentifier: '6',
    hostName: 'ub-mini-06',
    connectionStatus: 'online',
    locationLabel: 'Pune Office',
    hierarchicalLabels: ['India', 'Maharashtra', 'Pune'],
    centralProcessingUnitUsagePercentage: 12.8,
    randomAccessMemoryUsagePercentage: 34.2,
    diskUsagePercentage: 19.6,
    temperatureCelsius: 43.9,
    lastSeenTimestampIso8601: '2025-01-09T12:34:10Z',
    internetProtocolAddressV4: '192.168.1.55',
    operatingSystem: 'Ubuntu 22.04.4 LTS',
    geolocation: { latitude: 18.5204, longitude: 73.8567, city: 'Pune', region: 'MH', country: 'IN', internetProtocolAddressPublic: '49.xx.xx.xx' }
  }
];

export const mockDeviceDetails: DeviceDetail[] = [
  {
    device: {
      deviceIdentifier: '1',
      customDisplayName: 'ub-mini-01',
      labels: { location: 'Bengaluru Office', department: 'IT' },
      registrationTimestampIso8601: '2025-01-01T10:00:00Z'
    },
    systemInformation: {
      hostName: 'ub-mini-01',
      operatingSystem: 'Ubuntu 22.04.4 LTS',
      kernelVersion: '6.8.0-35-generic',
      uptimeSeconds: 86400
    },
    hardwareInformation: {
      centralProcessingUnitModel: 'Intel(R) Core(TM) i5-1145G7 @ 2.60GHz',
      centralProcessingUnitCoreCount: 8,
      randomAccessMemoryTotalGigabytes: 16,
      storageDevices: [
        { deviceName: 'nvme0n1', sizeGigabytes: 512 }
      ]
    },
    networkInformation: {
      online: true,
      interfaces: [
        {
          interfaceName: 'eth0',
          interfaceType: 'ethernet',
          operationalState: 'up',
          internetProtocolAddressV4: '192.168.1.50',
          internetProtocolAddressV6: null,
          defaultGateway: '192.168.1.1',
          domainNameSystemServers: ['1.1.1.1', '8.8.8.8'],
          mediaAccessControlAddress: '00:1B:44:11:3A:B7'
        },
        {
          interfaceName: 'wlan0',
          interfaceType: 'wifi',
          operationalState: 'down',
          internetProtocolAddressV4: 'N/A',
          internetProtocolAddressV6: null,
          defaultGateway: 'N/A',
          domainNameSystemServers: [],
          mediaAccessControlAddress: '02:42:AC:11:00:02'
        }
      ]
    },
    geolocationInformation: {
      city: 'Bengaluru',
      region: 'Karnataka',
      country: 'IN',
      latitude: 12.9716,
      longitude: 77.5946,
      internetProtocolAddressPublic: '49.xx.xx.xx',
      provider: 'ipapi'
    },
    currentMetrics: {
      timestampIso8601: '2025-01-09T12:34:56Z',
      centralProcessingUnitUsagePercentage: 24.5,
      systemLoadAverage: [0.31, 0.28, 0.22],
      memory: {
        totalMegabytes: 16384,
        usedMegabytes: 4096,
        usedPercentage: 25.0
      },
      diskUsage: [
        { mountPoint: '/', usedPercentage: 41.7 },
        { mountPoint: '/boot/efi', usedPercentage: 1.2 }
      ],
      temperatureCelsius: 52.0,
      topProcesses: [
        { processIdentifier: 1234, commandName: 'chromium-browser', centralProcessingUnitPercentage: 34.2, memoryPercentage: 12.5 },
        { processIdentifier: 2222, commandName: 'Xorg', centralProcessingUnitPercentage: 8.5, memoryPercentage: 7.3 },
        { processIdentifier: 3456, commandName: 'gnome-shell', centralProcessingUnitPercentage: 6.1, memoryPercentage: 5.4 },
        { processIdentifier: 4567, commandName: 'systemd', centralProcessingUnitPercentage: 2.3, memoryPercentage: 1.5 },
        { processIdentifier: 5678, commandName: 'NetworkManager', centralProcessingUnitPercentage: 1.8, memoryPercentage: 0.9 }
      ]
    }
  }
];

export const mockSystemInfo = {
  operatingSystem: 'Ubuntu 22.04.4 LTS',
  kernelVersion: '6.8.0-35-generic',
  centralProcessingUnitModel: 'Intel(R) Core(TM) i5-1145G7 @ 2.60GHz',
  randomAccessMemoryTotalGigabytes: 16,
  uptimeSeconds: 86400,
  systemLoadAverage: [0.31, 0.28, 0.22]
};

export const mockNetworkInfo = {
  interfaces: [
    {
      interfaceName: 'eth0',
      interfaceType: 'ethernet',
      operationalState: 'up',
      internetProtocolAddressV4: '192.168.1.50',
      defaultGateway: '192.168.1.1',
      domainNameSystemServers: ['1.1.1.1', '8.8.8.8'],
      mediaAccessControlAddress: '00:1B:44:11:3A:B7'
    },
    {
      interfaceName: 'wlan0',
      interfaceType: 'wifi',
      operationalState: 'down',
      internetProtocolAddressV4: 'N/A',
      defaultGateway: 'N/A',
      domainNameSystemServers: [],
      mediaAccessControlAddress: '02:42:AC:11:00:02'
    }
  ]
};

export const mockProcesses = [
  { processIdentifier: 1234, commandName: 'chromium-browser', centralProcessingUnitPercentage: 34.2, memoryPercentage: 12.5 },
  { processIdentifier: 2222, commandName: 'Xorg', centralProcessingUnitPercentage: 8.5, memoryPercentage: 7.3 },
  { processIdentifier: 3456, commandName: 'gnome-shell', centralProcessingUnitPercentage: 6.1, memoryPercentage: 5.4 },
  { processIdentifier: 4567, commandName: 'systemd', centralProcessingUnitPercentage: 2.3, memoryPercentage: 1.5 },
  { processIdentifier: 5678, commandName: 'NetworkManager', centralProcessingUnitPercentage: 1.8, memoryPercentage: 0.9 }
];

export const generateMockMetrics = (points: number = 20) => {
  const now = Date.now();
  const metrics = [];
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - (i * 30000); // 30 seconds interval
    metrics.push({
      timestamp,
      centralProcessingUnitUsagePercentage: Math.max(5, Math.min(95, 25 + (Math.random() - 0.5) * 20)),
      randomAccessMemoryUsagePercentage: Math.max(10, Math.min(90, 45 + (Math.random() - 0.5) * 15)),
      temperatureCelsius: Math.max(35, Math.min(80, 50 + (Math.random() - 0.5) * 10))
    });
  }
  
  return metrics;
};
