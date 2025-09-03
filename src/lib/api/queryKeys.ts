// src/lib/queryKeys.ts
// export const qk = {
//   devices: ['devices'] as const,
//   device: (id: string) => ['device', id] as const,
// };


export const qk = {
  // Devices (existing)
  devices: ["devices"] as const,
  device: (id: string) => ["device", id] as const,

  // Kiosk / Network
  netOnline: ["kiosk", "netOnline"] as const,
  wifiList: ["kiosk", "wifiList"] as const,
};
