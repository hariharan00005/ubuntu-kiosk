/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export type WifiNetwork = {
  ssid: string;
  bssid?: string;
  signal?: number;   // 0–100 (preferred)
  rssi?: number;     // negative dBm (fallback)
  frequency?: number;
  channel?: number;
  security?: string; // WPA2/WPA3/Open
  connected?: boolean;
  [k: string]: any;
};

export type OnlineStatus = {
  online: boolean;
  connectivity?: "none" | "limited" | "portal" | "full" | string;
  activeAdapters?: Array<{ device: string; type?: string; [k: string]: any }>;
  [k: string]: any;
};

export type SetStaticIpPayload = {
  device: string;    // e.g., "enp4s0" or "wlan0"
  ipCidr: string;    // e.g., "192.168.3.50/24"
  gateway: string;   // e.g., "192.168.3.1"
  dns?: string[];    // optional
};

export type SetDnsPayload = {
  device: string;
  dns: string[];
};

/** ----- Metrics Types (loose/forward-compatible) ----- */
export type SystemInformation = {
  hostName?: string;
  operatingSystem?: string;
  kernelVersion?: string;
  uptimeSeconds?: number;
  [k: string]: any;
};

export type HardwareInformation = Record<string, any>;

export type CurrentMetrics = {
  centralProcessingUnitUsagePercentage?: number;
  memory?: {
    usedPercentage?: number;
    totalMB?: number;
    usedMB?: number;
  };
  systemLoadAverage?: number | number[];
  diskUsage?: Array<{
    mountPoint?: string;
    usedPercentage?: number;
    totalGigabytes?: number;
  }>;
  topProcesses?: Array<{
    processIdentifier?: number;
    commandName?: string;
    centralProcessingUnitPercentage?: number;
    memoryMB?: number;
  }>;
  [k: string]: any;
};

export type GeolocationInformation = {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
  internetProtocolAddressPublic?: string;
  [k: string]: any;
};

export type MetricsResponse = {
  systemInformation?: SystemInformation;
  hardwareInformation?: HardwareInformation;
  currentMetrics?: CurrentMetrics;
  geolocationInformation?: GeolocationInformation;
  networkInformation?: { online?: boolean; [k: string]: any };
  [k: string]: any;
};

export type NetworkInterface = {
  interfaceName: string;
  interfaceType?: string;           // e.g., ethernet/wifi/loopback
  operationalState?: string;        // "up" | "down" | etc
  internetProtocolAddressV4?: string | null;
  defaultGateway?: string | null;
  macAddress?: string;
  mtu?: number;
  [k: string]: any;
};

export type NetworkInterfacesResponse = {
  interfaces: NetworkInterface[];
};

export type WifiStatus = {
  enabled: boolean;
  connected?: boolean;
  ssid?: string | null;
  [k: string]: any;
};

const BASE =
  import.meta.env.VITE_NETWORK_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

const networkApi = axios.create({
  baseURL: BASE,
  withCredentials: false,
});

networkApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = config.headers["Content-Type"] ?? "application/json";
  return config;
});

// ---- helpers
const ok = (v: any = {}) => ({ ok: true, ...v });
const fail = (message = "Unexpected error") => ({ ok: false, message });

const pickWifiList = (data: any): WifiNetwork[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as WifiNetwork[];
  if (Array.isArray(data.networks)) return data.networks as WifiNetwork[];
  return [];
};

/** =========================
 *  READ: Metrics + Network
 * ========================= */

// 1) Get Complete System Metrics
export async function getMetrics(): Promise<MetricsResponse> {
  const { data } = await networkApi.get("/metrics");
  return data as MetricsResponse;
}

// 2) Get System Information Only (client-side pick)
export async function getSystemInformation(): Promise<SystemInformation | null> {
  const m = await getMetrics();
  return m.systemInformation ?? null;
}

// 3) Get Hardware Information
export async function getHardwareInformation(): Promise<HardwareInformation | null> {
  const m = await getMetrics();
  return (m.hardwareInformation ?? null) as HardwareInformation | null;
}

// 4) Get Current Metrics (CPU, Memory, Disk)
export async function getCurrentMetrics(): Promise<CurrentMetrics | null> {
  const m = await getMetrics();
  return m.currentMetrics ?? null;
}

// 5) Get Geolocation Information
export async function getGeolocationInformation(): Promise<GeolocationInformation | null> {
  const m = await getMetrics();
  return m.geolocationInformation ?? null;
}

// 6) Debug Configuration
export async function getDebugConfig(): Promise<any> {
  const { data } = await networkApi.get("/debug/config");
  return data;
}

// 7) Get Network Status Summary
export async function getNetworkStatus(): Promise<OnlineStatus> {
  try {
    const { data } = await networkApi.get("/network/status");
    // expect at least { online: boolean }
    if (typeof data?.online === "boolean") return data as OnlineStatus;
  } catch {}
  // Fallback via /metrics.networkInformation.online
  try {
    const m = await getMetrics();
    if (typeof m?.networkInformation?.online === "boolean") {
      return { online: !!m.networkInformation.online, connectivity: "full" };
    }
  } catch {}
  // last resort
  return { online: navigator.onLine, connectivity: navigator.onLine ? "full" : "none" };
}

// 8) Get Detailed Network Interfaces
export async function getNetworkInterfaces(): Promise<NetworkInterface[]> {
  const { data } = await networkApi.get("/network/interfaces");
  if (Array.isArray(data)) return data as NetworkInterface[];
  if (Array.isArray(data?.interfaces)) return data.interfaces as NetworkInterface[];
  return [];
}

// 9) Get WiFi Status
export async function getWifiStatus(): Promise<WifiStatus> {
  const { data } = await networkApi.get("/network/wifi_status");
  return (data ?? { enabled: false }) as WifiStatus;
}

// 10) Scan for WiFi Networks
export async function wifiScan(): Promise<WifiNetwork[]> {
  try {
    const { data } = await networkApi.get("/network/wifi_scan");
    return pickWifiList(data);
  } catch {
    return [];
  }
}

/** =========================
 *  WRITE: Wi-Fi & IP config
 * ========================= */

// 11) Toggle WiFi On/Off
export async function wifiToggle(enable: boolean): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/wifi_toggle", { enable });
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to toggle Wi-Fi";
    return fail(msg);
  }
}

// 12) Disconnect from WiFi
export async function wifiDisconnect(): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/wifi_disconnect", {});
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to disconnect Wi-Fi";
    return fail(msg);
  }
}

// 13) Forget WiFi Network
export async function wifiForget(ssid: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/wifi_forget", { ssid });
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to forget network";
    return fail(msg);
  }
}

// 14) Connect to WiFi
export async function wifiConnect(ssid: string, password: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/wifi_connect", { ssid, password });
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to connect Wi-Fi";
    return fail(msg);
  }
}

// 15) Set Static IP
export async function setStaticIp(payload: SetStaticIpPayload): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/set_static_ip", payload);
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to set static IP";
    return fail(msg);
  }
}

// 16) Set DNS Servers
export async function setDns(payload: SetDnsPayload): Promise<{ ok: boolean; message?: string }> {
  try {
    const { data } = await networkApi.post("/network/set_dns", payload);
    return typeof data?.ok === "boolean" ? data : ok();
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Failed to set DNS";
    return fail(msg);
  }
}
