/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wifi,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Monitor,
  RefreshCw,
  Power,
  Link2Off,
  Eraser,
  HardDrive,
  Activity,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  useOnlineQuery,
  useWifiScanQuery,
  useWifiConnect,
  useSetStaticIp,
  useSetDns,
  useOnlineAutoRefetch,
  useWifiToggle,
  useWifiDisconnect,
  useWifiForget,
  useNetworkInterfacesQuery,
  useWifiStatusQuery,
  useCurrentMetricsQuery,
  useSystemInformationQuery,
  useGeolocationInformationQuery,
} from "@/hooks/kiosk";

type Step = "status" | "wifi" | "ethernet";

const Kiosk = () => {
  const navigate = useNavigate();

  const [showConfig, setShowConfig] = useState(false);
  const [configCredentials, setConfigCredentials] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");

  const [connectionStep, setConnectionStep] = useState<Step>("status");

  // Wi-Fi form
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [forgetSsid, setForgetSsid] = useState("");

  // Ethernet form
  const [iface, setIface] = useState("enp4s0");
  const [ipCidr, setIpCidr] = useState("192.168.3.50/24");
  const [gateway, setGateway] = useState("192.168.3.1");
  const [dns, setDns] = useState("1.1.1.1,8.8.8.8");

  // Hooks
  const onlineQuery = useOnlineQuery();
  useOnlineAutoRefetch();
  const isOnline = false; //onlineQuery.data?.online ?? false;

  const wifiQuery = useWifiScanQuery(connectionStep === "wifi");
  const wifiList = useMemo(() => wifiQuery.data ?? [], [wifiQuery.data]);

  const wifiStatus = useWifiStatusQuery();
  const netIfaces = useNetworkInterfacesQuery();
  const currentMetrics = useCurrentMetricsQuery();
  const sysInfo = useSystemInformationQuery();
  const geoInfo = useGeolocationInformationQuery();

  const connectWifi = useWifiConnect();
  const applyStaticIp = useSetStaticIp();
  const applyDns = useSetDns();
  const toggleWifi = useWifiToggle();
  const disconnectWifi = useWifiDisconnect();
  const forgetWifi = useWifiForget();

  // Hotkey for hidden config
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setShowConfig(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleConfigAuth = () => {
    if (
      configCredentials.username === "nublify" &&
      configCredentials.password === "nublify"
    ) {
      setAuthError("");
      setShowConfig(false);
      setConfigCredentials({ username: "", password: "" });
    } else {
      setAuthError("Invalid credentials");
    }
  };

  const handleLandingPageRedirect = () => navigate("/");

  const signalPercent = (n: any): number => {
    if (typeof n === "number") {
      if (n < 0) {
        const v = Math.max(-90, Math.min(-30, n));
        return Math.round(((v + 90) / 60) * 100);
      }
      return Math.max(0, Math.min(100, n));
    }
    return 0;
  };

  // ---- ONLINE SUCCESS SCREEN ----
  if (isOnline && connectionStep === "status") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="kiosk-overlay rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse-glow mb-6">
            <CheckCircle className="w-20 h-20 mx-auto text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">
            Connection Established
          </h1>
          <p className="text-black/80 mb-8">
            Your device is connected to the internet. Redirecting to your
            landing page...
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleLandingPageRedirect}
              className="w-full bg-white text-blue-600 hover:bg-white/90"
            >
              Continue to Landing Page
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full text-black border-white hover:bg-white hover:text-blue-600"
            >
              Back to Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => onlineQuery.refetch()}
              className="w-full text-black hover:bg-white/10 gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  onlineQuery.isFetching ? "animate-spin" : ""
                }`}
              />
              Re-check Connectivity
            </Button>
          </div>
        </div>

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
                  onChange={(e) =>
                    setConfigCredentials((p) => ({
                      ...p,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={configCredentials.password}
                  onChange={(e) =>
                    setConfigCredentials((p) => ({
                      ...p,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <Button onClick={handleConfigAuth} className="w-full">
                Access Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---- MAIN ASSISTANT UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="w-12 h-12 text-black" />
            <h1 className="text-3xl font-bold text-black">
              Connection Assistant
            </h1>
          </div>
          <p className="text-black/70">
            Help configure your network connection
          </p>
        </div>

        {connectionStep === "status" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Online/Offline banner */}
              <div
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isOnline
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`status-indicator ${
                      isOnline ? "status-online" : "status-offline"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-medium ${
                        isOnline ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {isOnline
                        ? "Internet Available"
                        : "No Internet Connection"}
                    </p>
                    <p
                      className={`text-sm ${
                        isOnline ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {isOnline
                        ? "Reachability OK"
                        : "Unable to reach remote services"}
                    </p>
                  </div>
                </div>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>

              {/* Quick metrics strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
                  <Activity className="w-5 h-5 text-black/80" />
                  <div className="text-black">
                    <div className="text-xs text-black/60">CPU</div>
                    <div className="text-sm font-semibold">
                      {currentMetrics.data
                        ?.centralProcessingUnitUsagePercentage ?? "--"}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
                  <HardDrive className="w-5 h-5 text-black/80" />
                  <div className="text-black">
                    <div className="text-xs text-black/60">Memory</div>
                    <div className="text-sm font-semibold">
                      {currentMetrics.data?.memory?.usedPercentage ?? "--"}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
                  <MapPin className="w-5 h-5 text-black/80" />
                  <div className="text-black">
                    <div className="text-xs text-black/60">Public IP</div>
                    <div className="text-sm font-semibold truncate max-w-[180px]">
                      {geoInfo.data?.internetProtocolAddressPublic ?? "--"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interfaces snapshot */}
              <div className="rounded-md border border-white/10 overflow-hidden">
                <div className="px-3 py-2 bg-white/5 text-black/80 text-sm">
                  Active Interfaces
                </div>
                <div className="divide-y divide-white/10">
                  {netIfaces.data?.length ? (
                    netIfaces.data.map((ni) => (
                      <div
                        key={ni.interfaceName}
                        className="px-3 py-2 text-black/90 text-sm flex flex-wrap items-center gap-x-6 gap-y-1"
                      >
                        <span className="font-semibold">
                          {ni.interfaceName}
                        </span>
                        <span className="text-black/60">
                          {ni.interfaceType ?? "unknown"}
                        </span>
                        <span className="text-black/70">
                          <span className="font-medium">state:</span>{" "}
                          {ni.operationalState ?? "?"}
                        </span>
                        <span className="text-black/70">
                          <span className="font-medium">ip:</span>{" "}
                          <span className="font-mono">
                            {ni.internetProtocolAddressV4 ?? "-"}
                          </span>
                        </span>
                        <span className="text-black/70">
                          <span className="font-medium">gw:</span>{" "}
                          <span className="font-mono">
                            {ni.defaultGateway ?? "-"}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-black/60 text-sm">
                      No interfaces data
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => onlineQuery.refetch()}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      onlineQuery.isFetching ? "animate-spin" : ""
                    }`}
                  />
                  Re-check
                </Button>
                <Button
                  onClick={() => setConnectionStep("wifi")}
                  className="gap-2"
                >
                  <Wifi className="w-4 h-4" />
                  Configure Wi-Fi
                </Button>
                <Button
                  onClick={() => setConnectionStep("ethernet")}
                  variant="outline"
                  className="gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Configure Ethernet
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-muted-foreground"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionStep === "wifi" && (
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Wi-Fi Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wi-Fi status row */}
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="text-sm">
                  <div className="font-medium">Wi-Fi Status</div>
                  <div className="text-muted-foreground">
                    {wifiStatus.data?.enabled ? "Enabled" : "Disabled"}
                    {wifiStatus.data?.connected && wifiStatus.data?.ssid
                      ? ` • Connected to ${wifiStatus.data?.ssid}`
                      : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleWifi.mutate(true)}
                    disabled={toggleWifi.isPending}
                    className="gap-2"
                  >
                    <Power className="w-4 h-4" /> Enable
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWifi.mutate(false)}
                    disabled={toggleWifi.isPending}
                    className="gap-2"
                  >
                    <Power className="w-4 h-4" /> Disable
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => wifiQuery.refetch()}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        wifiQuery.isFetching ? "animate-spin" : ""
                      }`}
                    />
                    Scan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => disconnectWifi.mutate()}
                    disabled={disconnectWifi.isPending}
                    className="gap-2"
                  >
                    <Link2Off className="w-4 h-4" />
                    Disconnect
                  </Button>
                </div>
              </div>

              {/* Scan status */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {wifiQuery.isLoading
                    ? "Scanning for networks..."
                    : `Found ${wifiList.length} networks`}
                </div>
              </div>

              {/* Networks List */}
              <div className="max-h-64 overflow-auto rounded-md border">
                <div className="divide-y">
                  {wifiList.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">
                      No networks found. Try scanning again.
                    </div>
                  )}
                  {wifiList.map((w) => {
                    const pct =
                      typeof w.signal === "number"
                        ? w.signal
                        : typeof w.rssi === "number"
                        ? signalPercent(w.rssi)
                        : 0;
                    return (
                      <div
                        key={`${w.bssid ?? w.ssid}-${w.channel ?? ""}`}
                        className="p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14">
                            <div className="h-2 rounded bg-slate-200">
                              <div
                                className="h-2 rounded bg-slate-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-muted-foreground text-center mt-1">
                              {pct}%
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate max-w-[220px]">
                              {w.ssid || "(hidden SSID)"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {w.security || "Open"}{" "}
                              {w.channel ? `• Ch ${w.channel}` : ""}{" "}
                              {w.frequency ? `• ${w.frequency}MHz` : ""}{" "}
                              {w.connected ? " • Connected" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setWifiSSID(w.ssid || "");
                              setTimeout(
                                () => passwordRef.current?.focus(),
                                10
                              );
                            }}
                          >
                            Use
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connect Form */}
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
                    ref={passwordRef}
                    placeholder="Enter Wi-Fi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      connectWifi.mutate({
                        ssid: wifiSSID,
                        password: wifiPassword,
                      })
                    }
                    disabled={
                      !wifiSSID || !wifiPassword || connectWifi.isPending
                    }
                    className="flex-1"
                  >
                    {connectWifi.isPending ? "Connecting..." : "Connect"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConnectionStep("status")}
                  >
                    Back
                  </Button>
                </div>
              </div>

              {/* Forget Form */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label htmlFor="forget-ssid">Forget Network (SSID)</Label>
                    <Input
                      id="forget-ssid"
                      placeholder="SSID to forget"
                      value={forgetSsid}
                      onChange={(e) => setForgetSsid(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    disabled={!forgetSsid || forgetWifi.isPending}
                    onClick={() => forgetWifi.mutate(forgetSsid)}
                    className="gap-2"
                  >
                    <Eraser className="w-4 h-4" />
                    Forget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionStep === "ethernet" && (
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Ethernet Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">
                  Automatic (DHCP) vs Static
                </h4>
                <p className="text-sm text-blue-600">
                  Leave fields empty to keep DHCP. Fill below to apply a static
                  configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iface">Interface</Label>
                  <Input
                    id="iface"
                    placeholder="enp4s0"
                    value={iface}
                    onChange={(e) => setIface(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ip">IP/CIDR</Label>
                  <Input
                    id="ip"
                    placeholder="192.168.3.50/24"
                    value={ipCidr}
                    onChange={(e) => setIpCidr(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gateway">Gateway</Label>
                  <Input
                    id="gateway"
                    placeholder="192.168.3.1"
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dns">DNS (comma-separated)</Label>
                  <Input
                    id="dns"
                    placeholder="1.1.1.1,8.8.8.8"
                    value={dns}
                    onChange={(e) => setDns(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  disabled={applyStaticIp.isPending}
                  onClick={() =>
                    applyStaticIp.mutate({
                      device: iface.trim(),
                      ipCidr: ipCidr.trim(),
                      gateway: gateway.trim(),
                      dns: dns
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                >
                  {applyStaticIp.isPending ? "Applying..." : "Apply Static IP"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConnectionStep("status")}
                >
                  Back
                </Button>
              </div>

              <div className="pt-2 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iface2">Interface</Label>
                    <Input
                      id="iface2"
                      placeholder="enp4s0"
                      value={iface}
                      onChange={(e) => setIface(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dns2">DNS Servers (comma-separated)</Label>
                    <Input
                      id="dns2"
                      placeholder="9.9.9.9,1.1.1.1"
                      value={dns}
                      onChange={(e) => setDns(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    disabled={applyDns.isPending}
                    onClick={() =>
                      applyDns.mutate({
                        device: iface.trim(),
                        dns: dns
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  >
                    {applyDns.isPending ? "Applying..." : "Set DNS Only"}
                  </Button>
                </div>
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
                  onChange={(e) =>
                    setConfigCredentials((p) => ({
                      ...p,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={configCredentials.password}
                  onChange={(e) =>
                    setConfigCredentials((p) => ({
                      ...p,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <Button onClick={handleConfigAuth} className="w-full">
                Access Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-center mt-6">
          <p className="text-black/50 text-sm">
            Press Ctrl+Alt+E to access configuration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
