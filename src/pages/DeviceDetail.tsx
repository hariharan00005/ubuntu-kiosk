import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Monitor,
  Cpu,
  HardDrive,
  Thermometer,
  Network,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricsChart from "@/components/MetricsChart";
import GeoMap from "@/components/GeoMap";
import { useDeviceQuery } from "@/hooks/devices";
import { Device } from "@/lib/mockData";
import { Skeleton } from "@/components/ui/skeleton";

function DeviceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Live Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metrics Chart */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-56 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Network Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-56" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <div key={j}>
                          <Skeleton className="h-4 w-28 mb-1" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Geographic Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Processes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-10 ml-auto mb-1" />
                      <Skeleton className="h-3 w-8 ml-auto" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useDeviceQuery(id);

  if (isLoading) return <DeviceDetailSkeleton />;
  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Device Not Found</h1>
          <Button onClick={() => navigate("/portal")}>Back to Portal</Button>
        </div>
      </div>
    );
  }

  const {
    device,
    systemInformation,
    hardwareInformation,
    networkInformation,
    currentMetrics,
    geolocationInformation,
  } = data;

  const cpu = Math.round(currentMetrics.centralProcessingUnitUsagePercentage);
  const ram = Math.round(currentMetrics.memory.usedPercentage);
  const disk = Math.round(
    currentMetrics.diskUsage.reduce((a, d) => a + d.usedPercentage, 0) /
      Math.max(1, currentMetrics.diskUsage.length)
  );
  const temp = Math.round(currentMetrics.temperatureCelsius);

  // Build a light-weight Device shape for GeoMap prop compatibility
  const mapDevice: Device = {
    deviceIdentifier: device.deviceIdentifier,
    hostName: systemInformation.hostName,
    connectionStatus: networkInformation.online ? "online" : "offline",
    locationLabel: `${geolocationInformation.city}, ${geolocationInformation.region}`,
    hierarchicalLabels: [geolocationInformation.country],
    centralProcessingUnitUsagePercentage: currentMetrics.centralProcessingUnitUsagePercentage,
    randomAccessMemoryUsagePercentage: currentMetrics.memory.usedPercentage,
    diskUsagePercentage: disk,
    temperatureCelsius: currentMetrics.temperatureCelsius,
    lastSeenTimestampIso8601: currentMetrics.timestampIso8601,
    internetProtocolAddressV4:
      networkInformation.interfaces[0]?.internetProtocolAddressV4 ?? "",
    operatingSystem: systemInformation.operatingSystem,
    geolocation: {
      latitude: geolocationInformation.latitude,
      longitude: geolocationInformation.longitude,
      city: geolocationInformation.city,
      region: geolocationInformation.region,
      country: geolocationInformation.country,
      internetProtocolAddressPublic: geolocationInformation.internetProtocolAddressPublic,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate("/portal")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{systemInformation.hostName}</h1>
              <div
                className={`status-indicator ${
                  networkInformation.online ? "status-online" : "status-offline"
                }`}
              />
              <Badge variant={networkInformation.online ? "default" : "destructive"}>
                {networkInformation.online ? "online" : "offline"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {geolocationInformation.city}, {geolocationInformation.region} • Last metrics:{" "}
              {new Date(currentMetrics.timestampIso8601).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Live Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="w-8 h-8 text-primary" />
                <div
                  className={`status-indicator ${
                    cpu > 80 ? "status-offline" : cpu > 60 ? "status-warning" : "status-online"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">CPU Usage</p>
              <p className="metric-value">{cpu}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Monitor className="w-8 h-8 text-primary" />
                <div
                  className={`status-indicator ${
                    ram > 80 ? "status-offline" : ram > 60 ? "status-warning" : "status-online"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">RAM Usage</p>
              <p className="metric-value">{ram}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HardDrive className="w-8 h-8 text-primary" />
                <div
                  className={`status-indicator ${
                    disk > 80 ? "status-offline" : disk > 60 ? "status-warning" : "status-online"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Disk Usage</p>
              <p className="metric-value">{disk}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8 text-primary" />
                <div
                  className={`status-indicator ${
                    temp > 70 ? "status-offline" : temp > 60 ? "status-warning" : "status-online"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
              <p className="metric-value">{temp}°C</p>
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
                    <p className="font-medium">{systemInformation.operatingSystem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kernel</p>
                    <p className="font-mono text-sm">{systemInformation.kernelVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="font-medium">{hardwareInformation.centralProcessingUnitModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RAM</p>
                    <p className="font-medium">
                      {hardwareInformation.randomAccessMemoryTotalGigabytes} GB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-mono text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(systemInformation.uptimeSeconds / 86400)} days,{" "}
                      {Math.floor((systemInformation.uptimeSeconds % 86400) / 3600)} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Load Average</p>
                    <p className="font-mono text-sm">
                      {currentMetrics.systemLoadAverage.join(", ")}
                    </p>
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
                  {networkInformation.interfaces.map((iface, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          {iface.interfaceName} ({iface.interfaceType})
                          <Badge
                            variant={iface.operationalState === "up" ? "default" : "secondary"}
                          >
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
                          <p className="font-mono">{iface.domainNameSystemServers.join(", ")}</p>
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
                <GeoMap device={mapDevice} />
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
                  {currentMetrics.topProcesses.map((process, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{process.commandName}</p>
                        <p className="text-muted-foreground font-mono text-xs">
                          PID: {process.processIdentifier}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{process.centralProcessingUnitPercentage}%</p>
                        <p className="text-muted-foreground font-mono text-xs">
                          {process.memoryPercentage}%
                        </p>
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
