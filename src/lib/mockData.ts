
// Mock data for the monitoring system
export interface Device {
  id: string;
  hostname: string;
  status: 'online' | 'offline';
  location: string;
  cpu_usage: number;
  ram_usage: number;
  disk_usage: number;
  temperature: number;
  last_seen: string;
  ip_address: string;
  os: string;
  geo?: {
    lat: number;
    lon: number;
    city: string;
    country: string;
  };
}

export const mockDevices: Device[] = [
  {
    id: '1',
    hostname: 'ub-mini-01',
    status: 'online',
    location: 'Bengaluru Office',
    cpu_usage: 24.5,
    ram_usage: 67.2,
    disk_usage: 41.7,
    temperature: 52.0,
    last_seen: 'Just now',
    ip_address: '192.168.1.50',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 12.9716, lon: 77.5946, city: 'Bengaluru', country: 'India' }
  },
  {
    id: '2',
    hostname: 'ub-mini-02',
    status: 'online',
    location: 'Mumbai Branch',
    cpu_usage: 18.3,
    ram_usage: 45.8,
    disk_usage: 32.1,
    temperature: 48.5,
    last_seen: '2 minutes ago',
    ip_address: '192.168.1.51',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 19.0760, lon: 72.8777, city: 'Mumbai', country: 'India' }
  },
  {
    id: '3',
    hostname: 'ub-mini-03',
    status: 'offline',
    location: 'Delhi Regional',
    cpu_usage: 0,
    ram_usage: 0,
    disk_usage: 28.9,
    temperature: 0,
    last_seen: '15 minutes ago',
    ip_address: '192.168.1.52',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 28.6139, lon: 77.2090, city: 'Delhi', country: 'India' }
  },
  {
    id: '4',
    hostname: 'ub-mini-04',
    status: 'online',
    location: 'Chennai Hub',
    cpu_usage: 76.1,
    ram_usage: 82.4,
    disk_usage: 56.3,
    temperature: 64.2,
    last_seen: 'Just now',
    ip_address: '192.168.1.53',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 13.0827, lon: 80.2707, city: 'Chennai', country: 'India' }
  },
  {
    id: '5',
    hostname: 'ub-mini-05',
    status: 'online',
    location: 'Hyderabad Center',
    cpu_usage: 35.7,
    ram_usage: 58.9,
    disk_usage: 73.2,
    temperature: 57.1,
    last_seen: '1 minute ago',
    ip_address: '192.168.1.54',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 17.3850, lon: 78.4867, city: 'Hyderabad', country: 'India' }
  },
  {
    id: '6',
    hostname: 'ub-mini-06',
    status: 'online',
    location: 'Pune Office',
    cpu_usage: 12.8,
    ram_usage: 34.2,
    disk_usage: 19.6,
    temperature: 43.9,
    last_seen: 'Just now',
    ip_address: '192.168.1.55',
    os: 'Ubuntu 22.04.4 LTS',
    geo: { lat: 18.5204, lon: 73.8567, city: 'Pune', country: 'India' }
  }
];

export const mockSystemInfo = {
  os: 'Ubuntu 22.04.4 LTS',
  kernel: '6.8.0-35-generic',
  cpu: 'Intel(R) Core(TM) i5-1145G7 @ 2.60GHz',
  ram: '16 GB DDR4',
  uptime: '2 days, 14 hours, 32 minutes',
  loadAvg: '0.31, 0.28, 0.22'
};

export const mockNetworkInfo = {
  interfaces: [
    {
      name: 'eth0',
      type: 'ethernet',
      status: 'up',
      ipv4: '192.168.1.50',
      gateway: '192.168.1.1',
      dns: ['1.1.1.1', '8.8.8.8'],
      mac: '00:1B:44:11:3A:B7'
    },
    {
      name: 'wlan0',
      type: 'wifi',
      status: 'down',
      ipv4: 'N/A',
      gateway: 'N/A',
      dns: [],
      mac: '02:42:AC:11:00:02'
    }
  ]
};

export const mockProcesses = [
  { pid: 1234, name: 'chromium-browser', cpu: 34.2, memory: 2048 },
  { pid: 2222, name: 'Xorg', cpu: 8.5, memory: 1200 },
  { pid: 3456, name: 'gnome-shell', cpu: 6.1, memory: 890 },
  { pid: 4567, name: 'systemd', cpu: 2.3, memory: 245 },
  { pid: 5678, name: 'NetworkManager', cpu: 1.8, memory: 156 }
];

export const generateMockMetrics = (points: number = 20) => {
  const now = Date.now();
  const metrics = [];
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - (i * 30000); // 30 seconds interval
    metrics.push({
      timestamp,
      cpu: Math.max(5, Math.min(95, 25 + (Math.random() - 0.5) * 20)),
      memory: Math.max(10, Math.min(90, 45 + (Math.random() - 0.5) * 15)),
      temperature: Math.max(35, Math.min(80, 50 + (Math.random() - 0.5) * 10))
    });
  }
  
  return metrics;
};
