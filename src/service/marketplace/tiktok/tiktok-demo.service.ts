import type { MarketplaceShopProfile, RealtimeMetrics, StreamHealth } from "../../../common/type/app.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let tiktokMetricsState: RealtimeMetrics = {
  viewers: 980,
  ordersPerMinute: 3.1,
  conversionRate: 2.1,
  gmv: 4100000,
};

let tiktokHealthState: StreamHealth = {
  connectionStatus: "connected",
  bitrateKbps: 4200,
  latencyMs: 1180,
  droppedFrames: 3,
  lastSyncAt: new Date().toLocaleTimeString(),
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const randomDelta = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const smoothValue = (current: number, target: number, factor: number): number => {
  return current + (target - current) * factor;
};

export const getTiktokDemoShopProfile = async (): Promise<MarketplaceShopProfile> => {
  await delay(360 + Math.floor(Math.random() * 460));

  if (Math.random() < 0.06) {
    throw new Error("TikTok demo profile service timeout.");
  }

  return {
    shopName: "eCentric TikTok Creator Shop",
    description: "Demo profile - short-form traffic boosted livestream campaign.",
    shopLogo: "",
  };
};

export const getTiktokDemoMetrics = (): RealtimeMetrics => {
  const nextViewersRaw = clamp(tiktokMetricsState.viewers + randomDelta(-22, 28), 520, 1520);
  const nextOrdersRaw = clamp(tiktokMetricsState.ordersPerMinute + randomDelta(-2, 2) * 0.1, 1.4, 5.2);
  const nextConversionRaw = clamp(tiktokMetricsState.conversionRate + randomDelta(-2, 2) * 0.02, 1.0, 3.4);
  const nextGmvRaw = clamp(tiktokMetricsState.gmv + randomDelta(-95000, 125000), 2200000, 8600000);

  tiktokMetricsState = {
    viewers: Math.round(smoothValue(tiktokMetricsState.viewers, nextViewersRaw, 0.35)),
    ordersPerMinute: Number(smoothValue(tiktokMetricsState.ordersPerMinute, nextOrdersRaw, 0.4).toFixed(1)),
    conversionRate: Number(smoothValue(tiktokMetricsState.conversionRate, nextConversionRaw, 0.4).toFixed(2)),
    gmv: Math.round(smoothValue(tiktokMetricsState.gmv, nextGmvRaw, 0.3)),
  };

  return tiktokMetricsState;
};

export const getTiktokDemoStreamHealth = (): StreamHealth => {
  if (tiktokHealthState.connectionStatus === "connected" && Math.random() < 0.07) {
    tiktokHealthState.connectionStatus = "limited";
  } else if (tiktokHealthState.connectionStatus === "limited") {
    if (Math.random() < 0.08) {
      tiktokHealthState.connectionStatus = "disconnected";
    } else if (Math.random() < 0.24) {
      tiktokHealthState.connectionStatus = "connected";
    }
  } else if (tiktokHealthState.connectionStatus === "disconnected" && Math.random() < 0.35) {
    tiktokHealthState.connectionStatus = "limited";
  }

  const nextBitrateRaw = clamp(tiktokHealthState.bitrateKbps + randomDelta(-90, 110), 3200, 5400);
  const nextLatencyRaw = clamp(tiktokHealthState.latencyMs + randomDelta(-70, 85), 850, 2400);
  const nextDroppedRaw = clamp(tiktokHealthState.droppedFrames + randomDelta(0, 1), 0, 32);

  tiktokHealthState = {
    connectionStatus: tiktokHealthState.connectionStatus,
    bitrateKbps: Math.round(smoothValue(tiktokHealthState.bitrateKbps, nextBitrateRaw, 0.35)),
    latencyMs: Math.round(smoothValue(tiktokHealthState.latencyMs, nextLatencyRaw, 0.4)),
    droppedFrames: Math.round(smoothValue(tiktokHealthState.droppedFrames, nextDroppedRaw, 0.35)),
    lastSyncAt: new Date().toLocaleTimeString(),
  };

  return tiktokHealthState;
};

export const generateTiktokDemoStreamUrl = (): string => {
  return `rtmp://demo.tiktok-live.local/session/${Math.random().toString(36).slice(2, 10)}`;
};
