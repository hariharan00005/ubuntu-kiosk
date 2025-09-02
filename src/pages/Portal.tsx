import { useMemo, useState } from "react";
import { Monitor, MapPin, Activity, AlertCircle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDevicesQuery } from "@/hooks/devices";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfile from "@/components/UserProfile";

function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-full max-w-md">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute left-3 top-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20 rounded" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="flex justify-between text-sm pt-2 border-t">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const Portal = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: devices = [], isLoading, isError } = useDevicesQuery();

  const filteredDevices = useMemo(
    () =>
      devices.filter(
        (device) =>
          device.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.locationLabel.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [devices, searchTerm]
  );

  const onlineCount = devices.filter((d) => d.connectionStatus === "online").length;
  const offlineCount = devices.filter((d) => d.connectionStatus === "offline").length;

  if (isLoading) return <PortalSkeleton />;
  if (isError) return <div className="p-6 text-red-600">Failed to load devices.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Management Portal</h1>
            <p className="text-muted-foreground">Monitor and manage Ubuntu remote agents</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button onClick={() => navigate("/")}>Back to Home</Button> */}
            <UserProfile />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                  <p className="text-3xl font-bold">{devices.length}</p>
                </div>
                <Monitor className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online</p>
                  <p className="text-3xl font-bold text-status-success">{onlineCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-status-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offline</p>
                  <p className="text-3xl font-bold text-status-error">{offlineCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-status-error" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg CPU</p>
                  <p className="text-3xl font-bold">
                    {devices.length
                      ? Math.round(
                          devices.reduce(
                            (acc, d) => acc + d.centralProcessingUnitUsagePercentage,
                            0
                          ) / devices.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices by hostname or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card
              key={device.deviceIdentifier}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate(`/device/${device.deviceIdentifier}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.hostName}</CardTitle>
                  <div
                    className={`status-indicator ${
                      device.connectionStatus === "online" ? "status-online" : "status-offline"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {device.locationLabel}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status</span>
                    <Badge variant={device.connectionStatus === "online" ? "default" : "destructive"}>
                      {device.connectionStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-mono">
                        {Math.round(device.centralProcessingUnitUsagePercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.centralProcessingUnitUsagePercentage > 80
                            ? "bg-status-error"
                            : device.centralProcessingUnitUsagePercentage > 60
                            ? "bg-status-warning"
                            : "bg-status-success"
                        }`}
                        style={{ width: `${device.centralProcessingUnitUsagePercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>RAM Usage</span>
                      <span className="font-mono">
                        {Math.round(device.randomAccessMemoryUsagePercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.randomAccessMemoryUsagePercentage > 80
                            ? "bg-status-error"
                            : device.randomAccessMemoryUsagePercentage > 60
                            ? "bg-status-warning"
                            : "bg-primary"
                        }`}
                        style={{ width: `${device.randomAccessMemoryUsagePercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Last Seen</span>
                    <span className="text-muted-foreground">
                      {new Date(device.lastSeenTimestampIso8601).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portal;
