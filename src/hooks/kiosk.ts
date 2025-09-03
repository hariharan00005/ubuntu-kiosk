/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/lib/api/queryKeys';
import { useToast } from '@/hooks/use-toast';
import {
  // status & inventory
  getNetworkStatus,
  getNetworkInterfaces,
  getWifiStatus,
  getMetrics,
  getCurrentMetrics,
  getSystemInformation,
  getHardwareInformation,
  getGeolocationInformation,
  getDebugConfig,
  // wifi & net ops
  wifiScan,
  wifiConnect,
  wifiToggle,
  wifiDisconnect,
  wifiForget,
  setStaticIp,
  setDns,
  type SetStaticIpPayload,
  type SetDnsPayload,
  type WifiNetwork,
  type OnlineStatus,
  type NetworkInterface,
  type WifiStatus,
  type MetricsResponse,
  type CurrentMetrics,
  type SystemInformation,
  type HardwareInformation,
  type GeolocationInformation,
} from '@/lib/api/network';

function errMsg(e: unknown, fallback: string) {
  if (!e) return fallback;
  if (typeof e === 'string') return e;
  const anyErr = e as any;
  return anyErr?.message || anyErr?.data?.message || fallback;
}

/** ONLINE STATUS (from /network/status with fallbacks) */
export function useOnlineQuery() {
  return useQuery<OnlineStatus>({
    queryKey: qk.netOnline,
    queryFn: getNetworkStatus,
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}

/** WIFI SCAN */
export function useWifiScanQuery(enabled = true) {
  return useQuery<WifiNetwork[]>({
    queryKey: qk.wifiList,
    queryFn: wifiScan,
    enabled,
    refetchInterval: enabled ? 10000 : false,
    placeholderData: (prev) => prev,
  });
}

/** WIFI STATUS (/network/wifi_status) */
export function useWifiStatusQuery() {
  return useQuery<WifiStatus>({
    queryKey: ['wifiStatus'],
    queryFn: getWifiStatus,
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}

/** NETWORK INTERFACES (/network/interfaces) */
export function useNetworkInterfacesQuery() {
  return useQuery<NetworkInterface[]>({
    queryKey: ['netInterfaces'],
    queryFn: getNetworkInterfaces,
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}

/** FULL METRICS (/metrics) */
export function useMetricsQuery() {
  return useQuery<MetricsResponse>({
    queryKey: ['metrics'],
    queryFn: getMetrics,
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}

/** Current metrics only (client-side pick) */
export function useCurrentMetricsQuery() {
  return useQuery<CurrentMetrics | null>({
    queryKey: ['metrics.current'],
    queryFn: getCurrentMetrics,
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });
}
export function useSystemInformationQuery() {
  return useQuery<SystemInformation | null>({
    queryKey: ['metrics.systemInformation'],
    queryFn: getSystemInformation,
    placeholderData: (prev) => prev,
  });
}
export function useHardwareInformationQuery() {
  return useQuery<HardwareInformation | null>({
    queryKey: ['metrics.hardwareInformation'],
    queryFn: getHardwareInformation,
    placeholderData: (prev) => prev,
  });
}
export function useGeolocationInformationQuery() {
  return useQuery<GeolocationInformation | null>({
    queryKey: ['metrics.geolocationInformation'],
    queryFn: getGeolocationInformation,
    placeholderData: (prev) => prev,
  });
}
export function useDebugConfigQuery() {
  return useQuery<any>({
    queryKey: ['debug.config'],
    queryFn: getDebugConfig,
    placeholderData: (prev) => prev,
  });
}

/** WIFI CONNECT */
export function useWifiConnect() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ssid, password }: { ssid: string; password: string }) =>
      wifiConnect(ssid, password),
    onSuccess: (res) => {
      if (res.ok) {
        toast({ title: 'Connected to Wi-Fi', description: 'Connection successful.' });
        qc.invalidateQueries({ queryKey: qk.netOnline });
        qc.invalidateQueries({ queryKey: qk.wifiList });
        qc.invalidateQueries({ queryKey: ['wifiStatus'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Wi-Fi connect failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Wi-Fi connect failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** WIFI TOGGLE (on/off) */
export function useWifiToggle() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (enable: boolean) => wifiToggle(enable),
    onSuccess: (res, enable) => {
      if (res.ok) {
        toast({
          title: `Wi-Fi ${enable ? 'enabled' : 'disabled'}`,
          description: enable ? 'Radio turned on.' : 'Radio turned off.',
        });
        qc.invalidateQueries({ queryKey: qk.netOnline });
        qc.invalidateQueries({ queryKey: qk.wifiList });
        qc.invalidateQueries({ queryKey: ['wifiStatus'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Wi-Fi toggle failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Wi-Fi toggle failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** WIFI DISCONNECT */
export function useWifiDisconnect() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => wifiDisconnect(),
    onSuccess: (res) => {
      if (res.ok) {
        toast({ title: 'Wi-Fi disconnected', description: 'Left the current network.' });
        qc.invalidateQueries({ queryKey: qk.netOnline });
        qc.invalidateQueries({ queryKey: qk.wifiList });
        qc.invalidateQueries({ queryKey: ['wifiStatus'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Wi-Fi disconnect failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Wi-Fi disconnect failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** WIFI FORGET */
export function useWifiForget() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ssid: string) => wifiForget(ssid),
    onSuccess: (res) => {
      if (res.ok) {
        toast({ title: 'Network forgotten', description: 'Credentials removed.' });
        qc.invalidateQueries({ queryKey: qk.wifiList });
      } else {
        toast({
          variant: 'destructive',
          title: 'Forget network failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Forget network failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** STATIC IP */
export function useSetStaticIp() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetStaticIpPayload) => setStaticIp(payload),
    onSuccess: (res) => {
      if (res.ok) {
        toast({ title: 'Static IP applied', description: 'Interface settings updated.' });
        qc.invalidateQueries({ queryKey: qk.netOnline });
        qc.invalidateQueries({ queryKey: ['netInterfaces'] });
      } else {
        toast({
          variant: 'destructive',
          title: 'Static IP failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'Static IP failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** DNS ONLY */
export function useSetDns() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetDnsPayload) => setDns(payload),
    onSuccess: (res) => {
      if (res.ok) {
        toast({ title: 'DNS updated', description: 'DNS servers applied.' });
        qc.invalidateQueries({ queryKey: qk.netOnline });
      } else {
        toast({
          variant: 'destructive',
          title: 'DNS update failed',
          description: res.message || 'Unknown error',
        });
      }
    },
    onError: (e) => {
      toast({
        variant: 'destructive',
        title: 'DNS update failed',
        description: errMsg(e, 'Unknown error'),
      });
    },
  });
}

/** Auto-refetch online status when browser goes offline/online */
export function useOnlineAutoRefetch() {
  // NOTE: use the same query instance as useOnlineQuery
  // (Don't call useOnlineQuery again here; just get refetch via QueryClient)
  const qc = useQueryClient();
  const refetch = () => qc.invalidateQueries({ queryKey: qk.netOnline });

  useEffect(() => {
    window.addEventListener('online', refetch);
    window.addEventListener('offline', refetch);
    return () => {
      window.removeEventListener('online', refetch);
      window.removeEventListener('offline', refetch);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
