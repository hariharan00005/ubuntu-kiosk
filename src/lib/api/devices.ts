/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/devices.ts
import { api } from './axios';
import {
  Device,
  DeviceDetail,
  mockDevices,
  mockDeviceDetails,
} from '../mockData';

/**
 * If you deploy behind ngrok or any gateway, set:
 * VITE_API_BASE_URL=https://xxxx.ngrok-free.app
 * (No trailing slash needed; we trim it anyway.)
 */
const BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';
const url = (p: string) => `${BASE}${p}`;

const FALLBACK_DELAY_MS = 3000;

// ---------- helpers: jitter values for demo "live" feel (never throw) ----------
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const jitter = (n: number, spread: number, min: number, max: number) =>
  clamp(n + (Math.random() - 0.5) * spread, min, max);

function tickDevice(base: Device): Device {
  const online = base.connectionStatus === 'online';
  return {
    ...base,
    centralProcessingUnitUsagePercentage: jitter(
      base.centralProcessingUnitUsagePercentage,
      10,
      5,
      95
    ),
    randomAccessMemoryUsagePercentage: jitter(
      base.randomAccessMemoryUsagePercentage,
      8,
      10,
      90
    ),
    diskUsagePercentage: jitter(base.diskUsagePercentage, 3, 5, 95),
    temperatureCelsius: jitter(base.temperatureCelsius, 4, 35, 80),
    lastSeenTimestampIso8601: online
      ? new Date().toISOString()
      : base.lastSeenTimestampIso8601,
  };
}

function tickDetail(base: DeviceDetail): DeviceDetail {
  const cpu = jitter(
    base.currentMetrics.centralProcessingUnitUsagePercentage,
    8,
    5,
    95
  );
  const memPct = jitter(base.currentMetrics.memory.usedPercentage, 6, 10, 90);
  const totalMB = base.currentMetrics.memory.totalMegabytes;
  const usedMB = Math.round((totalMB * memPct) / 100);

  return {
    ...base,
    currentMetrics: {
      ...base.currentMetrics,
      timestampIso8601: new Date().toISOString(),
      centralProcessingUnitUsagePercentage: cpu,
      systemLoadAverage: base.currentMetrics.systemLoadAverage.map((n) =>
        Number(jitter(n, 0.1, 0, 32).toFixed(2))
      ) as [number, number, number],
      memory: {
        totalMegabytes: totalMB,
        usedMegabytes: usedMB,
        usedPercentage: memPct,
      },
      diskUsage: base.currentMetrics.diskUsage.map((d) => ({
        ...d,
        usedPercentage: jitter(d.usedPercentage, 3, 1, 95),
      })),
      temperatureCelsius: jitter(
        base.currentMetrics.temperatureCelsius,
        3.5,
        35,
        80
      ),
      topProcesses: base.currentMetrics.topProcesses.map((p) => ({
        ...p,
        centralProcessingUnitPercentage: clamp(
          p.centralProcessingUnitPercentage + (Math.random() - 0.5) * 5,
          0,
          100
        ),
        memoryPercentage: clamp(
          p.memoryPercentage + (Math.random() - 0.5) * 3,
          0,
          100
        ),
      })),
    },
  };
}

function delay<T>(ms: number, value?: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value as T), ms));
}

const authHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- API with fallback that *always* resolves ----------

/**
 * listDevices
 * Hits GET /specs/ (authorized). If it errors or takes >3s, returns a jittered clone of mockDevices.
 * Never throws.
 */
export async function listDevices(): Promise<Device[]> {
  try {
    const winner = await Promise.race([
      api.get<Device[]>(url('/specs/'), { headers: authHeader() }),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      // timeout -> lively mock
      return mockDevices.map(tickDevice);
    }

    // axios response (backend up)
    const data = (winner as { data?: Device[] }).data;
    return Array.isArray(data) && data.length ? data : mockDevices.map(tickDevice);
  } catch {
    // network/axios failure -> lively mock
    return mockDevices.map(tickDevice);
  }
}

/**
 * getDevice
 * Hits GET /specs/:id (authorized). If it errors or takes >3s, returns a jittered clone of the
 * matching entry from mockDeviceDetails (or the first entry as a safe fallback).
 * Never throws.
 */
export async function getDevice(id: string): Promise<DeviceDetail> {
  try {
    const winner = await Promise.race([
      api.get<DeviceDetail>(url(`/specs/${id}`), { headers: authHeader() }),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      const detail =
        mockDeviceDetails.find((d) => d.device.deviceIdentifier === id) ??
        mockDeviceDetails[0];
      return tickDetail(detail);
    }

    const data = (winner as { data?: DeviceDetail }).data;
    if (data) return data;

    const detail =
      mockDeviceDetails.find((d) => d.device.deviceIdentifier === id) ??
      mockDeviceDetails[0];
    return tickDetail(detail);
  } catch {
    const detail =
      mockDeviceDetails.find((d) => d.device.deviceIdentifier === id) ??
      mockDeviceDetails[0];
    return tickDetail(detail);
  }
}

/**
 * renameDevice
 * Hits PATCH /specs/:id (authorized). If it errors or takes >3s, returns { success: true } so the UX is smooth for demos.
 * Never throws.
 */
export async function renameDevice(
  id: string,
  customDisplayName: string
): Promise<{ success: boolean }> {
  try {
    const winner = await Promise.race([
      api.patch(url(`/specs/${id}`), { customDisplayName }, { headers: authHeader() }),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      return { success: true };
    }

    const data = (winner as { data?: { success?: boolean } }).data;
    return { success: data?.success ?? true };
  } catch {
    return { success: true };
  }
}
