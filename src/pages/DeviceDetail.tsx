
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Monitor, Cpu, HardDrive, Thermometer, Network, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockDevices, mockSystemInfo, mockNetworkInfo, mockProcesses } from "@/lib/mockData";
import MetricsChart from "@/components/MetricsChart";
import GeoMap from "@/components/GeoMap";

const DeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(mockDevices.find(d => d.deviceIdentifier === id));
  const [systemInfo] = useState(mockSystemInfo);
  const [networkInfo] = useState(mockNetworkInfo);
  const [processes] = useState(mockProcesses);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (device) {
        setDevice(prev => prev ? {
          ...prev,
          centralProcessingUnitUsagePercentage: Math.max(5, Math.min(95, prev.centralProcessingUnitUsagePercentage + (Math.random() - 0.5) * 10)),
          randomAccessMemoryUsagePercentage: Math.max(10, Math.min(90, prev.randomAccessMemoryUsagePercentage + (Math.random() - 0.5) * 8)),
          temperatureCelsius: Math.max(35, Math.min(80, prev.temperatureCelsius + (Math.random() - 0.5) * 4))
        } : null);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [device]);

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Device Not Found</h1>
          <Button onClick={() => navigate('/portal')}>Back to Portal</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/portal')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{device.hostName}</h1>
              <div className={`status-indicator ${device.connectionStatus === 'online' ? 'status-online' : 'status-offline'}`} />
              <Badge variant={device.connectionStatus === 'online' ? 'default' : 'destructive'}>
                {device.connectionStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {device.locationLabel} • Last seen: {new Date(device.lastSeenTimestampIso8601).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Live Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="w-8 h-8 text-primary" />
                <div className={`status-indicator ${device.centralProcessingUnitUsagePercentage > 80 ? 'status-offline' : device.centralProcessingUnitUsagePercentage > 60 ? 'status-warning' : 'status-online'}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">CPU Usage</p>
              <p className="metric-value">{Math.round(device.centralProcessingUnitUsagePercentage)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Monitor className="w-8 h-8 text-primary" />
                <div className={`status-indicator ${device.randomAccessMemoryUsagePercentage > 80 ? 'status-offline' : device.randomAccessMemoryUsagePercentage > 60 ? 'status-warning' : 'status-online'}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">RAM Usage</p>
              <p className="metric-value">{Math.round(device.randomAccessMemoryUsagePercentage)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HardDrive className="w-8 h-8 text-primary" />
                <div className={`status-indicator ${device.diskUsagePercentage > 80 ? 'status-offline' : device.diskUsagePercentage > 60 ? 'status-warning' : 'status-online'}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Disk Usage</p>
              <p className="metric-value">{Math.round(device.diskUsagePercentage)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8 text-primary" />
                <div className={`status-indicator ${device.temperatureCelsius > 70 ? 'status-offline' : device.temperatureCelsius > 60 ? 'status-warning' : 'status-online'}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
              <p className="metric-value">{Math.round(device.temperatureCelsius)}°C</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Operating System</p>
                    <p className="font-medium">{systemInfo.operatingSystem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kernel</p>
                    <p className="font-mono text-sm">{systemInfo.kernelVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="font-medium">{systemInfo.centralProcessingUnitModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RAM</p>
                    <p className="font-medium">{systemInfo.randomAccessMemoryTotalGigabytes} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-mono text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(systemInfo.uptimeSeconds / 86400)} days, {Math.floor((systemInfo.uptimeSeconds % 86400) / 3600)} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Load Average</p>
                    <p className="font-mono text-sm">{systemInfo.systemLoadAverage.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsChart />
              </CardContent>
            </Card>

            {/* Network Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Network Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkInfo.interfaces.map((iface, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          {iface.interfaceName} ({iface.interfaceType})
                          <Badge variant={iface.operationalState === 'up' ? 'default' : 'secondary'}>
                            {iface.operationalState}
                          </Badge>
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">IPv4 Address</p>
                          <p className="font-mono">{iface.internetProtocolAddressV4}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gateway</p>
                          <p className="font-mono">{iface.defaultGateway}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">DNS Servers</p>
                          <p className="font-mono">{iface.domainNameSystemServers.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">MAC Address</p>
                          <p className="font-mono">{iface.mediaAccessControlAddress}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Geographic Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GeoMap device={device} />
              </CardContent>
            </Card>

            {/* Top Processes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Top Processes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processes.map((process, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{process.commandName}</p>
                        <p className="text-muted-foreground font-mono text-xs">PID: {process.processIdentifier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{process.centralProcessingUnitPercentage}%</p>
                        <p className="text-muted-foreground font-mono text-xs">{process.memoryPercentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
