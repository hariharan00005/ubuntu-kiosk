/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/devices.ts
import { api } from './axios';
import {
  Device,
  DeviceDetail,
  mockDevices,
  mockDeviceDetails,
} from '../mockData';

const FALLBACK_DELAY_MS = 3000;

// ---------- helpers: never throw, jitter values ----------

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const jitter = (n: number, spread: number, min: number, max: number) =>
  clamp(n + (Math.random() - 0.5) * spread, min, max);

function tickDevice(base: Device): Device {
  const online = base.connectionStatus === 'online';
  return {
    ...base,
    centralProcessingUnitUsagePercentage: jitter(base.centralProcessingUnitUsagePercentage, 10, 5, 95),
    randomAccessMemoryUsagePercentage: jitter(base.randomAccessMemoryUsagePercentage, 8, 10, 90),
    diskUsagePercentage: jitter(base.diskUsagePercentage, 3, 5, 95),
    temperatureCelsius: jitter(base.temperatureCelsius, 4, 35, 80),
    lastSeenTimestampIso8601: online ? new Date().toISOString() : base.lastSeenTimestampIso8601,
  };
}

function tickDetail(base: DeviceDetail): DeviceDetail {
  const cpu = jitter(base.currentMetrics.centralProcessingUnitUsagePercentage, 8, 5, 95);
  const memPct = jitter(base.currentMetrics.memory.usedPercentage, 6, 10, 90);
  const totalMB = base.currentMetrics.memory.totalMegabytes;
  const usedMB = Math.round((totalMB * memPct) / 100);

  return {
    ...base,
    networkInformation: {
      ...base.networkInformation,
      // keep online state stable here; change it if you want to demo flaps:
      // online: Math.random() < 0.02 ? !base.networkInformation.online : base.networkInformation.online,
      online: base.networkInformation.online,
    },
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
      temperatureCelsius: jitter(base.currentMetrics.temperatureCelsius, 3.5, 35, 80),
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

// ---------- API with fallback that *always* resolves ----------

/**
 * listDevices
 * Tries backend first; if it errors or takes >3s, returns a jitttered clone of mockDevices.
 * Never throws.
 */
export async function listDevices(): Promise<Device[]> {
  try {
    const winner = await Promise.race([
      api.get<Device[]>('/devices'),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      // timeout -> lively mock
      return mockDevices.map(tickDevice);
    }

    // axios response (backend up)
    return (winner as { data: Device[] }).data;
  } catch {
    // network/axios failure -> lively mock
    return mockDevices.map(tickDevice);
  }
}

/**
 * getDevice
 * Tries backend first; if it errors or takes >3s, returns a jitttered clone of the
 * matching entry from mockDeviceDetails (or the first entry as a safe fallback).
 * Never throws.
 */
export async function getDevice(id: string): Promise<DeviceDetail> {
  try {
    const winner = await Promise.race([
      api.get<DeviceDetail>(`/devices/${id}`),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      const detail =
        mockDeviceDetails.find((d) => d.device.deviceIdentifier === id) ??
        mockDeviceDetails[0];
      return tickDetail(detail);
    }

    return (winner as { data: DeviceDetail }).data;
  } catch {
    const detail =
      mockDeviceDetails.find((d) => d.device.deviceIdentifier === id) ??
      mockDeviceDetails[0];
    return tickDetail(detail);
  }
}

/**
 * renameDevice
 * Tries backend; if it errors or takes >3s, returns a success so the UX is smooth for demos.
 * Never throws.
 */
export async function renameDevice(
  id: string,
  customDisplayName: string
): Promise<{ success: boolean }> {
  try {
    const winner = await Promise.race([
      api.patch(`/devices/${id}`, { customDisplayName }),
      delay(FALLBACK_DELAY_MS, 'timeout' as const),
    ]);

    if (winner === 'timeout') {
      return { success: true };
    }

    return (winner as { data: { success: boolean } }).data ?? { success: true };
  } catch {
    return { success: true };
  }
}
