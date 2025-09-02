// src/lib/queryKeys.ts
export const qk = {
  devices: ['devices'] as const,
  device: (id: string) => ['device', id] as const,
};
