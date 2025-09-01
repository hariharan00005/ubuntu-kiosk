
import { useState, useEffect } from "react";
import { Monitor, MapPin, Activity, AlertCircle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { mockDevices } from "@/lib/mockData";

const Portal = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = devices.filter(device =>
    device.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices =>
        prevDevices.map(device => ({
          ...device,
          cpu_usage: Math.max(5, Math.min(95, device.cpu_usage + (Math.random() - 0.5) * 10)),
          ram_usage: Math.max(10, Math.min(90, device.ram_usage + (Math.random() - 0.5) * 8)),
          temperature: Math.max(35, Math.min(80, device.temperature + (Math.random() - 0.5) * 4)),
          last_seen: device.status === 'online' ? 'Just now' : device.last_seen
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Management Portal</h1>
            <p className="text-muted-foreground">Monitor and manage Ubuntu remote agents</p>
          </div>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
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
                  <p className="text-3xl font-bold">{Math.round(devices.reduce((acc, d) => acc + d.cpu_usage, 0) / devices.length)}%</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
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
              key={device.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate(`/device/${device.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.hostname}</CardTitle>
                  <div className={`status-indicator ${device.status === 'online' ? 'status-online' : 'status-offline'}`} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {device.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status</span>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-mono">{Math.round(device.cpu_usage)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.cpu_usage > 80 ? 'bg-status-error' :
                          device.cpu_usage > 60 ? 'bg-status-warning' : 'bg-status-success'
                        }`}
                        style={{ width: `${device.cpu_usage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>RAM Usage</span>
                      <span className="font-mono">{Math.round(device.ram_usage)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          device.ram_usage > 80 ? 'bg-status-error' :
                          device.ram_usage > 60 ? 'bg-status-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${device.ram_usage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Last Seen</span>
                    <span className="text-muted-foreground">{device.last_seen}</span>
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
