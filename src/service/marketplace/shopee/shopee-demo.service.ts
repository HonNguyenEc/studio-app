import type { MarketplaceShopProfile, RealtimeMetrics, StreamHealth } from "../../../common/type/app.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let shopeeMetricsState: RealtimeMetrics = {
  viewers: 620,
  ordersPerMinute: 3.4,
  conversionRate: 2.9,
  gmv: 3200000,
};

let shopeeHealthState: StreamHealth = {
  connectionStatus: "connected",
  bitrateKbps: 4700,
  latencyMs: 1280,
  droppedFrames: 2,
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

export const getShopeeDemoShopProfile = async (): Promise<MarketplaceShopProfile> => {
  await delay(420 + Math.floor(Math.random() * 520));

  if (Math.random() < 0.08) {
    throw new Error("Shopee demo profile is temporarily unavailable.");
  }

  return {
    shopName: "eCentric Shopee Flagship",
    description: "Demo profile - campaign oriented catalog for livestream conversion review.",
    shopLogo: "",
  };
};

export const getShopeeDemoMetrics = (): RealtimeMetrics => {
  const nextViewersRaw = clamp(shopeeMetricsState.viewers + randomDelta(-14, 18), 380, 980);
  const nextOrdersRaw = clamp(shopeeMetricsState.ordersPerMinute + randomDelta(-1, 2) * 0.1, 2.1, 5.6);
  const nextConversionRaw = clamp(shopeeMetricsState.conversionRate + randomDelta(-2, 2) * 0.03, 1.6, 4.5);
  const nextGmvRaw = clamp(shopeeMetricsState.gmv + randomDelta(-60000, 85000), 1500000, 6800000);

  shopeeMetricsState = {
    viewers: Math.round(smoothValue(shopeeMetricsState.viewers, nextViewersRaw, 0.35)),
    ordersPerMinute: Number(smoothValue(shopeeMetricsState.ordersPerMinute, nextOrdersRaw, 0.4).toFixed(1)),
    conversionRate: Number(smoothValue(shopeeMetricsState.conversionRate, nextConversionRaw, 0.4).toFixed(2)),
    gmv: Math.round(smoothValue(shopeeMetricsState.gmv, nextGmvRaw, 0.3)),
  };

  return shopeeMetricsState;
};

export const getShopeeDemoStreamHealth = (): StreamHealth => {
  // Keep status stable most of the time to avoid noisy/flapping UI.
  if (shopeeHealthState.connectionStatus === "connected" && Math.random() < 0.05) {
    shopeeHealthState.connectionStatus = "limited";
  } else if (shopeeHealthState.connectionStatus === "limited" && Math.random() < 0.2) {
    shopeeHealthState.connectionStatus = "connected";
  }

  const nextBitrateRaw = clamp(shopeeHealthState.bitrateKbps + randomDelta(-70, 90), 3900, 5600);
  const nextLatencyRaw = clamp(shopeeHealthState.latencyMs + randomDelta(-45, 60), 900, 2200);
  const nextDroppedRaw = clamp(shopeeHealthState.droppedFrames + randomDelta(0, 1), 0, 24);

  shopeeHealthState = {
    connectionStatus: shopeeHealthState.connectionStatus,
    bitrateKbps: Math.round(smoothValue(shopeeHealthState.bitrateKbps, nextBitrateRaw, 0.35)),
    latencyMs: Math.round(smoothValue(shopeeHealthState.latencyMs, nextLatencyRaw, 0.4)),
    droppedFrames: Math.round(smoothValue(shopeeHealthState.droppedFrames, nextDroppedRaw, 0.35)),
    lastSyncAt: new Date().toLocaleTimeString(),
  };

  return shopeeHealthState;
};

export const generateShopeeDemoStreamUrl = (): string => {
  return `rtmp://demo.shopee-live.local/session/${Math.random().toString(36).slice(2, 10)}`;
};
