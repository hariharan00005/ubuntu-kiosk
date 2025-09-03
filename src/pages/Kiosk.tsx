/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wifi,
  Globe,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Power,
  Link2Off,
  HardDrive,
  Activity,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Settings,
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

  /** ===== Wi-Fi (inline prompt) ===== */
  const [promptSsid, setPromptSsid] = useState<string | null>(null);
  const [promptPassword, setPromptPassword] = useState("");
  const [showPromptPassword, setShowPromptPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [lastConnectedSsid, setLastConnectedSsid] = useState<string | null>(
    null
  );

  /** ===== Ethernet form state (empty to avoid autofill) ===== */
  const [iface, setIface] = useState("");
  const [ipCidr, setIpCidr] = useState("");
  const [gateway, setGateway] = useState("");
  const [dns, setDns] = useState("");
  const [selectedEth, setSelectedEth] = useState<string>("");

  // Hooks
  const onlineQuery = useOnlineQuery();
  useOnlineAutoRefetch();
  const isOnline = false; // onlineQuery.data?.online ?? false;

  const wifiQuery = useWifiScanQuery(connectionStep === "wifi");
  const wifiList = useMemo(() => wifiQuery.data ?? [], [wifiQuery.data]);

  const wifiStatus = useWifiStatusQuery();

  /** ---------- SSID parsing & derived connection state ---------- */
  const extractSsid = (raw?: string | null) => {
    if (!raw) return null;
    // backend sends like "GENERAL.CONNECTION:SSID" or "GENERAL.CONNECTION:"
    const idx = raw.indexOf(":");
    const ssid = idx >= 0 ? raw.slice(idx + 1) : raw;
    const s = ssid.trim();
    return s.length ? s : null;
  };
  const parsedSsid = extractSsid((wifiStatus.data as any)?.ssid);
  // If API provides a definitive parsed value (including empty), use it.
  // Only fall back to lastConnectedSsid while fetching/undefined.
  const connectedSsid: string | null = useMemo(() => {
    if (parsedSsid !== null) return parsedSsid;
    if (wifiStatus.isFetching || typeof wifiStatus.data === "undefined") {
      return lastConnectedSsid;
    }
    return null;
  }, [parsedSsid, wifiStatus.isFetching, wifiStatus.data, lastConnectedSsid]);

  const wifiEnabled = Boolean(
    (wifiStatus.data as any)?.enabled ??
      (wifiStatus.data as any)?.wifi_enabled ??
      false
  );
  const wifiConnected = Boolean(connectedSsid);

  useEffect(() => {
    // keep a best-effort cache only when we truly have an SSID
    if (parsedSsid) setLastConnectedSsid(parsedSsid);
    if (parsedSsid === null && !wifiStatus.isFetching) {
      setLastConnectedSsid(null);
    }
  }, [parsedSsid, wifiStatus.isFetching]);

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

  // Hidden config hotkey
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

  /** ===== Helpers ===== */
  const signalPercent = (n: any): number => {
    if (typeof n === "number") {
      if (n < 0) {
        const v = Math.max(-90, Math.min(-30, n));
        return Math.round(((v + 90) / 60) * 100);
      }
      return Math.max(0, Math.min(100, n));
    }
    const num = Number.parseInt(String(n), 10);
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
  };
  const signalGradient = (pct: number) => {
    if (pct >= 80) return "from-green-500 to-green-600";
    if (pct >= 60) return "from-lime-500 to-lime-600";
    if (pct >= 35) return "from-amber-500 to-amber-600";
    return "from-red-500 to-orange-600";
  };
  const signalText = (pct: number) => {
    if (pct >= 80) return "text-green-700";
    if (pct >= 60) return "text-lime-700";
    if (pct >= 35) return "text-amber-700";
    return "text-red-700";
  };
  const isConnectedTo = (ssid?: string) => {
    const t = (ssid || "").trim();
    return !!t && connectedSsid === t;
  };

  /** ===== Ethernet visuals ===== */
  const speedToPct = (spd?: number | null) => {
    if (!spd || spd <= 0) return 0;
    if (spd >= 10000) return 100;
    if (spd >= 2500) return 88;
    if (spd >= 1000) return 75;
    if (spd >= 100) return 40;
    return 10;
  };
  const speedGradient = (spd?: number | null) => {
    if (!spd || spd <= 10) return "from-red-500 to-orange-600";
    if (spd <= 100) return "from-amber-500 to-amber-600";
    if (spd <= 1000) return "from-lime-500 to-lime-600";
    if (spd <= 2500) return "from-green-500 to-green-600";
    return "from-sky-500 to-indigo-600";
  };
  const speedBadge = (spd?: number | null) => {
    if (!spd || spd <= 10) return "bg-red-100 text-red-700";
    if (spd <= 100) return "bg-amber-100 text-amber-700";
    if (spd <= 1000) return "bg-lime-100 text-lime-700";
    if (spd <= 2500) return "bg-green-100 text-green-700";
    return "bg-sky-100 text-sky-700";
  };

  /** ===== ONLINE SUCCESS SCREEN ===== */
  if (isOnline && connectionStep === "status") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4 bg-white">
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
                  autoComplete="off"
                  data-1p-ignore
                  data-lpignore="true"
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
                  autoComplete="new-password"
                  data-1p-ignore
                  data-lpignore="true"
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

  // Lock page scroll on Wi-Fi/Ethernet; scroll inside the card only
  const containerClasses =
    connectionStep === "wifi" || connectionStep === "ethernet"
      ? "h-screen overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4"
      : "min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="max-w-4xl w-full">
        {connectionStep === "status" && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner */}
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

              {/* Quick metrics */}
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

        {/* =================== WI-FI =================== */}
        {connectionStep === "wifi" && (
          <Card className="glass-card mt-6">
            <CardHeader className="grid grid-cols-10 items-center">
              <CardTitle className="col-span-9 flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Wi-Fi Configuration
              </CardTitle>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConnectionStep("status")}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status */}
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="text-sm">
                  <div className="font-medium">Wi-Fi Status</div>
                  <div className="text-muted-foreground">
                    {wifiEnabled ? "Enabled" : "Disabled"}
                    {wifiEnabled && connectedSsid && (
                      <> • Connected to {connectedSsid}</>
                    )}
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
                    disabled={!wifiEnabled}
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
                    onClick={async () => {
                      setLastConnectedSsid(null); // optimistic clear
                      await disconnectWifi.mutateAsync();
                      wifiStatus.refetch();
                      wifiQuery.refetch();
                    }}
                    disabled={!wifiEnabled || disconnectWifi.isPending}
                    className="gap-2"
                  >
                    <Link2Off className="w-4 h-4" />
                    Disconnect
                  </Button>
                </div>
              </div>

              {/* Scan + List only if Wi-Fi is enabled */}
              {wifiEnabled ? (
                <>
                  {/* Scan status */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {wifiQuery.isLoading
                        ? "Scanning for networks..."
                        : `Found ${wifiList.length} networks`}
                    </div>
                  </div>

                  {/* List */}
                  <div className="rounded-md border divide-y">
                    {wifiList.length === 0 && (
                      <div className="p-4 text-sm text-muted-foreground">
                        No networks found. Try scanning again.
                      </div>
                    )}

                    {wifiList.map((w) => {
                      const ssid = w.ssid || "";
                      const pct =
                        typeof w.signal === "number"
                          ? w.signal
                          : signalPercent(w.signal ?? (w as any).rssi);
                      const connectedRow = isConnectedTo(ssid);
                      const prompting = promptSsid === ssid;

                      return (
                        <div
                          key={`${ssid}-${(w as any).channel ?? ""}`}
                          className="p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16">
                                <div className="h-2 rounded bg-slate-200">
                                  <div
                                    className={`h-2 rounded bg-gradient-to-r ${signalGradient(
                                      pct
                                    )}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div
                                  className={`text-[10px] text-center mt-1 ${signalText(
                                    pct
                                  )}`}
                                >
                                  {pct}%
                                </div>
                              </div>

                              <div className="min-w-0">
                                <div className="font-medium truncate max-w-[220px]">
                                  {ssid || "(hidden SSID)"}{" "}
                                  {connectedRow && (
                                    <Badge className="ml-2" variant="secondary">
                                      Connected
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {w.security || "Open"}{" "}
                                  {(w as any).channel
                                    ? `• Ch ${(w as any).channel}`
                                    : ""}{" "}
                                  {(w as any).frequency
                                    ? `• ${(w as any).frequency}MHz`
                                    : ""}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!connectedRow && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled={!wifiEnabled}
                                  onClick={() => {
                                    setPromptSsid(ssid);
                                    setPromptPassword("");
                                    setShowPromptPassword(false);
                                    setTimeout(
                                      () => passwordRef.current?.focus(),
                                      10
                                    );
                                  }}
                                >
                                  Connect
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  if (!ssid) return;
                                  const ok = window.confirm(
                                    `Forget "${ssid}"?`
                                  );
                                  if (!ok) return;
                                  await forgetWifi.mutateAsync(ssid);
                                  if (connectedSsid === ssid) {
                                    setLastConnectedSsid(null);
                                  }
                                  setPromptSsid(null);
                                  setPromptPassword("");
                                  wifiQuery.refetch();
                                  wifiStatus.refetch();
                                }}
                              >
                                Forget
                              </Button>
                            </div>
                          </div>

                          {/* Inline password prompt */}
                          {prompting && !connectedRow && (
                            <div className="mt-3 rounded-md border p-3 bg-muted/30">
                              <Label htmlFor={`pw-${ssid}`}>Password</Label>
                              <div className="relative mt-1">
                                <Input
                                  id={`pw-${ssid}`}
                                  ref={passwordRef}
                                  type={
                                    showPromptPassword ? "text" : "password"
                                  }
                                  placeholder="Enter Wi-Fi password"
                                  value={promptPassword}
                                  onChange={(e) =>
                                    setPromptPassword(e.target.value)
                                  }
                                  autoComplete="new-password"
                                  autoCorrect="off"
                                  autoCapitalize="none"
                                  className="pr-10"
                                  data-1p-ignore
                                  data-lpignore="true"
                                  data-form-type="other"
                                />
                                <button
                                  type="button"
                                  aria-label={
                                    showPromptPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                                  onClick={() =>
                                    setShowPromptPassword((s) => !s)
                                  }
                                >
                                  {showPromptPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              <div className="mt-3 flex gap-2">
                                <Button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    const res: any =
                                      await connectWifi.mutateAsync({
                                        ssid,
                                        password: promptPassword,
                                      });
                                    if (res?.ok) {
                                      setLastConnectedSsid(ssid);
                                      setPromptPassword("");
                                      setPromptSsid(null);
                                      wifiStatus.refetch();
                                      wifiQuery.refetch();
                                    }
                                  }}
                                  disabled={
                                    !promptPassword || connectWifi.isPending
                                  }
                                >
                                  {connectWifi.isPending
                                    ? "Connecting..."
                                    : "Connect"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    setPromptPassword("");
                                    setPromptSsid(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground border rounded-md bg-muted/30">
                  <Wifi className="mx-auto mb-2 w-6 h-6 opacity-70" />
                  Wi-Fi is currently{" "}
                  <span className="font-medium">disabled</span>. Enable it to
                  scan and connect to available networks.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* =================== ETHERNET (attractive UI) =================== */}
        {connectionStep === "ethernet" && (
          <Card className="glass-card mt-6">
            <CardHeader className="grid grid-cols-10 items-center">
              <CardTitle className="col-span-9 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Ethernet Configuration
              </CardTitle>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConnectionStep("status")}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status */}
              <div className="flex items-center justify-between rounded-md border p-3">
                {(() => {
                  const ethList =
                    netIfaces.data?.filter(
                      (i) => i.interfaceType === "ethernet"
                    ) ?? [];
                  const primary =
                    ethList.find((i) => i.operationalState === "up") ||
                    ethList[0];
                  const spd = primary?.["speedMbps" as any] as
                    | number
                    | undefined;
                  const pct = speedToPct(spd);
                  return (
                    <>
                      <div className="text-sm">
                        <div className="font-medium">Ethernet Status</div>
                        {primary ? (
                          <div className="text-muted-foreground">
                            {primary.interfaceName} •{" "}
                            {primary.operationalState === "up" ? (
                              <span className="text-green-700">Link Up</span>
                            ) : (
                              <span className="text-red-700">Link Down</span>
                            )}
                            {" • "}
                            <span className="font-mono">
                              {primary.internetProtocolAddressV4 || "-"}
                            </span>
                            {"  gw "}
                            <span className="font-mono">
                              {primary.defaultGateway || "-"}
                            </span>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            No ethernet interfaces detected
                          </div>
                        )}
                      </div>

                      <div className="min-w-[160px]">
                        <div className="h-2 rounded bg-slate-200">
                          <div
                            className={`h-2 rounded bg-gradient-to-r ${speedGradient(
                              spd
                            )}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-600">
                            Speed
                          </span>
                          <span
                            className={`text-[10px] px-2 py-[2px] rounded ${speedBadge(
                              spd
                            )}`}
                          >
                            {spd ? `${spd} Mbps` : "—"}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Interfaces list */}
              <div className="rounded-md border divide-y">
                <div className="px-3 py-2 text-sm text-slate-600 bg-white/40 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Select an interface to configure
                </div>

                {(
                  netIfaces.data?.filter(
                    (i) => i.interfaceType === "ethernet"
                  ) ?? []
                ).map((ni) => {
                  const spd = ni["speedMbps" as any] as number | undefined;
                  const pct = speedToPct(spd);
                  const isSelected = selectedEth === ni.interfaceName;

                  return (
                    <div key={ni.interfaceName} className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {ni.interfaceName}
                            </span>
                            <Badge variant="outline">{ni.interfaceType}</Badge>
                            <Badge
                              className={
                                ni.operationalState === "up"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {ni.operationalState || "unknown"}
                            </Badge>
                            {typeof spd === "number" && (
                              <Badge className={speedBadge(spd)}>
                                {spd} Mbps
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ip:{" "}
                            <span className="font-mono">
                              {ni.internetProtocolAddressV4 || "—"}
                            </span>{" "}
                            • gw:{" "}
                            <span className="font-mono">
                              {ni.defaultGateway || "—"}
                            </span>
                          </div>

                          {/* mini speed bar */}
                          <div className="w-48 mt-2">
                            <div className="h-1.5 rounded bg-slate-200">
                              <div
                                className={`h-1.5 rounded bg-gradient-to-r ${speedGradient(
                                  spd
                                )}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={isSelected ? "secondary" : "outline"}
                            onClick={() => {
                              setSelectedEth(ni.interfaceName);
                              setIface(ni.interfaceName);
                            }}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>

                      {/* Inline config panels for the selected interface */}
                      {selectedEth === ni.interfaceName && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Static IP panel (left) */}
                          <div className="rounded-md border p-3 bg-muted/20">
                            <div className="font-medium mb-2">Static IP</div>
                            <div className="grid gap-3">
                              <div>
                                <Label htmlFor={`ip-${ni.interfaceName}`}>
                                  IP/CIDR
                                </Label>
                                <Input
                                  id={`ip-${ni.interfaceName}`}
                                  placeholder="e.g. 192.168.3.50/24"
                                  value={ipCidr}
                                  onChange={(e) => setIpCidr(e.target.value)}
                                  autoComplete="off"
                                  data-1p-ignore
                                  data-lpignore="true"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`gw-${ni.interfaceName}`}>
                                  Gateway
                                </Label>
                                <Input
                                  id={`gw-${ni.interfaceName}`}
                                  placeholder="e.g. 192.168.3.1"
                                  value={gateway}
                                  onChange={(e) => setGateway(e.target.value)}
                                  autoComplete="off"
                                  data-1p-ignore
                                  data-lpignore="true"
                                />
                              </div>
                              <Button
                                disabled={
                                  applyStaticIp.isPending ||
                                  !iface.trim() ||
                                  !ipCidr.trim() ||
                                  !gateway.trim()
                                }
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
                                {applyStaticIp.isPending
                                  ? "Applying..."
                                  : `Apply Static IP (${
                                      iface || ni.interfaceName
                                    })`}
                              </Button>
                            </div>
                          </div>

                          {/* DNS panel (right) */}
                          <div className="rounded-md border p-3 bg-muted/20">
                            <div className="font-medium mb-2">DNS Only</div>
                            <div className="grid gap-3">
                              <div>
                                <Label htmlFor={`dns-${ni.interfaceName}`}>
                                  DNS servers (comma-separated)
                                </Label>
                                <Input
                                  id={`dns-${ni.interfaceName}`}
                                  placeholder="e.g. 1.1.1.1,8.8.8.8"
                                  value={dns}
                                  onChange={(e) => setDns(e.target.value)}
                                  autoComplete="off"
                                  data-1p-ignore
                                  data-lpignore="true"
                                />
                              </div>
                              <Button
                                variant="secondary"
                                disabled={
                                  applyDns.isPending ||
                                  !iface.trim() ||
                                  !dns
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean).length
                                }
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
                                {applyDns.isPending
                                  ? "Applying..."
                                  : `Set DNS Only (${
                                      iface || ni.interfaceName
                                    })`}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info callout */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-1">Tip</h4>
                <p className="text-sm text-blue-700">
                  To keep DHCP, don’t apply a Static IP. You can still set only
                  DNS on any selected interface.
                </p>
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
                  autoComplete="off"
                  data-1p-ignore
                  data-lpignore="true"
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
                  autoComplete="new-password"
                  data-1p-ignore
                  data-lpignore="true"
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
          {sysInfo.data?.hostName && (
            <p className="text-black/40 text-xs mt-1">
              {sysInfo.data.hostName} • {sysInfo.data.operatingSystem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
