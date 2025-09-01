
import { useState, useEffect } from "react";
import { Wifi, Globe, Settings, AlertTriangle, CheckCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Kiosk = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showConfig, setShowConfig] = useState(false);
  const [configCredentials, setConfigCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [connectionStep, setConnectionStep] = useState('status');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  // Simulate network connectivity checks
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connectivity changes
      if (Math.random() > 0.9) {
        setIsOnline(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard shortcut for config
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'e') {
        e.preventDefault();
        setShowConfig(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfigAuth = () => {
    if (configCredentials.username === 'nublify' && configCredentials.password === 'nublify') {
      setAuthError('');
      alert('Configuration access granted! Portal endpoint configuration would open here.');
      setShowConfig(false);
      setConfigCredentials({ username: '', password: '' });
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const handleLandingPageRedirect = () => {
    // Simulate redirect to configured landing page
    alert('Redirecting to configured landing page...');
  };

  if (isOnline && connectionStep === 'status') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="kiosk-overlay rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse-glow mb-6">
            <CheckCircle className="w-20 h-20 mx-auto text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Connection Established</h1>
          <p className="text-white/80 mb-8">Your device is connected to the internet. Redirecting to your landing page...</p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleLandingPageRedirect}
              className="w-full bg-white text-blue-600 hover:bg-white/90"
            >
              Continue to Landing Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full text-white border-white hover:bg-white hover:text-blue-600"
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Hidden config dialog */}
        <Dialog open={showConfig} onOpenChange={setShowConfig}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Portal Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={configCredentials.username}
                  onChange={(e) => setConfigCredentials(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={configCredentials.password}
                  onChange={(e) => setConfigCredentials(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              {authError && (
                <p className="text-sm text-red-500">{authError}</p>
              )}
              <Button onClick={handleConfigAuth} className="w-full">
                Access Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">Connection Assistant</h1>
          </div>
          <p className="text-white/70">Help configure your network connection</p>
        </div>

        {connectionStep === 'status' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="status-indicator status-offline" />
                  <div>
                    <p className="font-medium text-red-800">No Internet Connection</p>
                    <p className="text-sm text-red-600">Unable to reach remote services</p>
                  </div>
                </div>
                <Badge variant="destructive">Offline</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setConnectionStep('wifi')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Wifi className="w-6 h-6" />
                  Configure Wi-Fi
                </Button>
                <Button 
                  onClick={() => setConnectionStep('ethernet')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Globe className="w-6 h-6" />
                  Configure Ethernet
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-muted-foreground"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionStep === 'wifi' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Wi-Fi Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ssid">Network Name (SSID)</Label>
                  <Input
                    id="ssid"
                    placeholder="Enter Wi-Fi network name"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    placeholder="Enter Wi-Fi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    alert(`Attempting to connect to ${wifiSSID}...`);
                    setIsOnline(true);
                    setConnectionStep('status');
                  }}
                  disabled={!wifiSSID || !wifiPassword}
                  className="flex-1"
                >
                  Connect
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setConnectionStep('status')}
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionStep === 'ethernet' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Ethernet Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Automatic Configuration (DHCP)</h4>
                  <p className="text-sm text-blue-600">Let the router assign IP settings automatically</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ip">IP Address</Label>
                    <Input id="ip" placeholder="192.168.1.100" />
                  </div>
                  <div>
                    <Label htmlFor="subnet">Subnet Mask</Label>
                    <Input id="subnet" placeholder="255.255.255.0" />
                  </div>
                  <div>
                    <Label htmlFor="gateway">Gateway</Label>
                    <Input id="gateway" placeholder="192.168.1.1" />
                  </div>
                  <div>
                    <Label htmlFor="dns">DNS Server</Label>
                    <Input id="dns" placeholder="8.8.8.8" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    alert('Configuring ethernet connection...');
                    setIsOnline(true);
                    setConnectionStep('status');
                  }}
                  className="flex-1"
                >
                  Apply Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setConnectionStep('status')}
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden config dialog */}
        <Dialog open={showConfig} onOpenChange={setShowConfig}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Portal Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={configCredentials.username}
                  onChange={(e) => setConfigCredentials(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={configCredentials.password}
                  onChange={(e) => setConfigCredentials(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              {authError && (
                <p className="text-sm text-red-500">{authError}</p>
              )}
              <Button onClick={handleConfigAuth} className="w-full">
                Access Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hint for configuration access */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">Press Ctrl+Alt+E to access configuration</p>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
