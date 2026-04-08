import { useEffect, useMemo, useRef, useState } from "react";
import {
  createMockSession,
  endMockStream,
  generateMockStreamUrlByPlatform,
  startMockStream,
} from "../../../service/livestream.service";
import { parseScheduleValue } from "../../../common/util/date-time.util";
import type {
  ManagementPlatform,
  MarketplaceShopProfile,
  ObsConfig,
  ObsSessionState,
  PlatformKey,
  RealtimeMetrics,
  SessionState,
  StreamHealth,
} from "../../../common/type/app.type";
import { getMarketplaceDemoAdapter } from "../../../service/marketplace/adapter/marketplace-demo.adapter";
import {
  connectObs,
  disconnectObs,
  getObsDefaultConfig,
  setObsProgramScene,
  startObsStream,
  stopObsStream,
  subscribeObsState,
} from "../../../service/obs.service";
import {
  obsConfigStorageKeyByPlatform,
  sessionStorageKeyByPlatform,
  toPlatformKey,
} from "../../../common/util/platform.util";

type UseSessionLifecycleHookArgs = {
  managementPlatform: ManagementPlatform;
  addLog: (
    action: string,
    detail: string,
    meta?: {
      platform?: ManagementPlatform;
      result?: "success" | "error" | "info";
      errorCode?: string;
      requestId?: string;
    }
  ) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  setAppError: (message: string) => void;
};

type PersistedSession = {
  sessionState: SessionState;
  sessionLifecycleState: SessionState;
  coverPreview: string;
  streamUrl: string;
  scheduleStart: string;
  scheduleEnd: string;
};

const cooldownRegistry = new Map<string, number>();

const createRequestId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const canRunWithCooldown = (actionKey: string, cooldownMs: number): boolean => {
  const now = Date.now();
  const prev = cooldownRegistry.get(actionKey) || 0;
  if (now - prev < cooldownMs) return false;
  cooldownRegistry.set(actionKey, now);
  return true;
};

const getDefaultObsState = (): ObsSessionState => ({
  connectionStatus: "disconnected",
  isStreaming: false,
  programSceneName: "",
  previewSceneName: "",
  lastError: "",
});

const getDefaultPersistedSession = (): PersistedSession => ({
  sessionState: "draft",
  sessionLifecycleState: "draft",
  coverPreview: "",
  streamUrl: "",
  scheduleStart: "",
  scheduleEnd: "",
});

const loadPersistedSession = (platformKey: PlatformKey): PersistedSession => {
  const storageKey = sessionStorageKeyByPlatform[platformKey];
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return getDefaultPersistedSession();

  try {
    return {
      ...getDefaultPersistedSession(),
      ...(JSON.parse(raw) as Partial<PersistedSession>),
    };
  } catch {
    return getDefaultPersistedSession();
  }
};

const loadPersistedObsConfig = (platformKey: PlatformKey): ObsConfig => {
  const fallback = getObsDefaultConfig();
  const raw = localStorage.getItem(obsConfigStorageKeyByPlatform[platformKey]);
  if (!raw) return fallback;
  try {
    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<ObsConfig>),
    };
  } catch {
    return fallback;
  }
};

export const useSessionLifecycleHook = ({
  managementPlatform,
  addLog,
  showToast,
  setAppError,
}: UseSessionLifecycleHookArgs) => {
  const platformKey = toPlatformKey(managementPlatform);
  const platformRef = useRef<PlatformKey>(platformKey);

  const [sessionState, setSessionState] = useState<SessionState>("draft");
  const [sessionLifecycleState, setSessionLifecycleState] = useState<SessionState>("draft");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [scheduleStart, setScheduleStart] = useState<string>("");
  const [scheduleEnd, setScheduleEnd] = useState<string>("");

  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState<boolean>(false);
  const [isStartingStream, setIsStartingStream] = useState<boolean>(false);
  const [isEndingStream, setIsEndingStream] = useState<boolean>(false);
  const [isConnectingObs, setIsConnectingObs] = useState<boolean>(false);
  const [isSwitchingScene, setIsSwitchingScene] = useState<boolean>(false);

  const [obsConfig, setObsConfig] = useState<ObsConfig>(loadPersistedObsConfig(platformKey));
  const [obsSessionState, setObsSessionState] = useState<ObsSessionState>(getDefaultObsState());
  const [obsSceneDraft, setObsSceneDraft] = useState<string>("");
  const sessionSnapshotRef = useRef<PersistedSession>(getDefaultPersistedSession());
  const obsConfigRef = useRef<ObsConfig>(obsConfig);

  const [marketplaceShopProfile, setMarketplaceShopProfile] = useState<MarketplaceShopProfile | null>(null);
  const [isLoadingMarketplaceShopProfile, setIsLoadingMarketplaceShopProfile] = useState<boolean>(false);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>({
    viewers: 0,
    ordersPerMinute: 0,
    conversionRate: 0,
    gmv: 0,
  });
  const [streamHealth, setStreamHealth] = useState<StreamHealth>({
    connectionStatus: "connected",
    bitrateKbps: 0,
    latencyMs: 0,
    droppedFrames: 0,
    lastSyncAt: "--:--:--",
  });

  useEffect(() => {
    sessionSnapshotRef.current = {
      sessionState,
      sessionLifecycleState,
      coverPreview,
      streamUrl,
      scheduleStart,
      scheduleEnd,
    };
    obsConfigRef.current = obsConfig;
  }, [sessionState, sessionLifecycleState, coverPreview, streamUrl, scheduleStart, scheduleEnd, obsConfig]);

  useEffect(() => {
    const previousKey = platformRef.current;
    if (previousKey !== platformKey) {
      sessionStorage.setItem(sessionStorageKeyByPlatform[previousKey], JSON.stringify(sessionSnapshotRef.current));
      localStorage.setItem(obsConfigStorageKeyByPlatform[previousKey], JSON.stringify(obsConfigRef.current));
    }

    const loadedSession = loadPersistedSession(platformKey);
    setSessionState(loadedSession.sessionState);
    setSessionLifecycleState(loadedSession.sessionLifecycleState);
    setCoverPreview(loadedSession.coverPreview);
    setStreamUrl(loadedSession.streamUrl);
    setScheduleStart(loadedSession.scheduleStart);
    setScheduleEnd(loadedSession.scheduleEnd);
    setObsConfig(loadPersistedObsConfig(platformKey));
    setObsSessionState(getDefaultObsState());
    setObsSceneDraft("");

    platformRef.current = platformKey;
  }, [platformKey]);

  useEffect(() => {
    const unsubscribe = subscribeObsState(platformKey, setObsSessionState);
    return () => unsubscribe();
  }, [platformKey]);

  useEffect(() => {
    const snapshot: PersistedSession = {
      sessionState,
      sessionLifecycleState,
      coverPreview,
      streamUrl,
      scheduleStart,
      scheduleEnd,
    };
    sessionStorage.setItem(sessionStorageKeyByPlatform[platformKey], JSON.stringify(snapshot));
  }, [platformKey, sessionState, sessionLifecycleState, coverPreview, streamUrl, scheduleStart, scheduleEnd]);

  useEffect(() => {
    localStorage.setItem(obsConfigStorageKeyByPlatform[platformKey], JSON.stringify(obsConfig));
  }, [platformKey, obsConfig]);

  useEffect(() => {
    const adapter = getMarketplaceDemoAdapter(managementPlatform);

    let isDisposed = false;

    const loadProfile = async () => {
      setIsLoadingMarketplaceShopProfile(true);
      try {
        const profile = await adapter.getShopProfile();
        if (isDisposed) return;
        setMarketplaceShopProfile(profile);
      } catch {
        if (isDisposed) return;
        setMarketplaceShopProfile(null);
        addLog(`${managementPlatform} profile`, `Failed to load ${managementPlatform} profile from demo adapter.`, {
          platform: managementPlatform,
          result: "error",
          errorCode: "PROFILE_LOAD_FAILED",
        });
      } finally {
        if (!isDisposed) {
          setIsLoadingMarketplaceShopProfile(false);
        }
      }
    };

    void loadProfile();

    setRealtimeMetrics(adapter.getRealtimeMetrics());
    setStreamHealth(adapter.getStreamHealth());

    const interval = setInterval(() => {
      if (isDisposed) return;
      setRealtimeMetrics(adapter.getRealtimeMetrics());
      setStreamHealth(adapter.getStreamHealth());
    }, 6500);

    return () => {
      isDisposed = true;
      clearInterval(interval);
    };
  }, [managementPlatform, addLog]);

  const isScheduleRangeInvalid = useMemo(() => {
    const start = parseScheduleValue(scheduleStart);
    const end = parseScheduleValue(scheduleEnd);
    if (!start || !end) return false;
    return end <= start;
  }, [scheduleStart, scheduleEnd]);

  useEffect(() => {
    const start = parseScheduleValue(scheduleStart);
    const end = parseScheduleValue(scheduleEnd);
    if (!start && !end) return;

    const timer = setInterval(() => {
      const now = new Date();

      if (sessionState === "scheduled" && start && now >= start) {
        setSessionState("live");
        setSessionLifecycleState("live");
        addLog("Stream auto-started", `Session automatically moved to LIVE at ${now.toLocaleTimeString()}.`, {
          platform: managementPlatform,
          result: "info",
        });
        return;
      }

      if (sessionState === "live" && end && now >= end) {
        setSessionState("ended");
        setSessionLifecycleState("ended");
        addLog("Stream auto-ended", `Session automatically moved to ENDED at ${now.toLocaleTimeString()}.`, {
          platform: managementPlatform,
          result: "info",
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState, scheduleStart, scheduleEnd, addLog, managementPlatform]);

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    addLog("Cover uploaded", `Loaded local file: ${file.name}`, {
      platform: managementPlatform,
      result: "success",
    });
  };

  const onCreateSession = async () => {
    setAppError("");

    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.", {
        platform: managementPlatform,
        result: "error",
        errorCode: "INVALID_SCHEDULE_RANGE",
      });
      setAppError("End time must be later than Start time.");
      return;
    }

    setIsCreatingSession(true);

    try {
      const result = await createMockSession(scheduleStart, scheduleEnd, sessionLifecycleState);
      setSessionState(result.nextState);
      setSessionLifecycleState(result.nextState);
      setStreamUrl("");
      addLog(result.actionLabel, result.detail, {
        platform: managementPlatform,
        result: "success",
      });
      showToast(result.actionLabel, "success");
    } catch {
      setAppError("Failed to create session.");
      showToast("Failed to create session.", "error");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const onGenerateUrl = async () => {
    setAppError("");
    setIsGeneratingUrl(true);

    try {
      const url = await generateMockStreamUrlByPlatform(managementPlatform);
      setStreamUrl(url);
      addLog("Stream URL generated", url, {
        platform: managementPlatform,
        result: "success",
      });
      showToast("Stream URL generated.", "success");
    } catch {
      setAppError("Failed to generate stream URL.");
      showToast("Failed to generate stream URL.", "error");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const onCopyStreamUrl = async () => {
    if (!streamUrl) return;
    try {
      await navigator.clipboard.writeText(streamUrl);
      addLog("Stream URL copied", "Copied stream URL to clipboard.", {
        platform: managementPlatform,
        result: "success",
      });
      showToast("Stream URL copied.", "success");
    } catch {
      addLog("Copy failed", "Clipboard permission is unavailable in this environment.", {
        platform: managementPlatform,
        result: "error",
        errorCode: "CLIPBOARD_UNAVAILABLE",
      });
      setAppError("Failed to copy stream URL.");
      showToast("Copy failed.", "error");
    }
  };

  const onConnectObs = async () => {
    setAppError("");
    const requestId = createRequestId();
    setIsConnectingObs(true);

    try {
      const nextObsState = await connectObs(platformKey, obsConfig);
      setObsSceneDraft(nextObsState.programSceneName || "");
      addLog("OBS connected", `${managementPlatform} OBS connection established at ${obsConfig.url}.`, {
        platform: managementPlatform,
        result: "success",
        requestId,
      });
      showToast("OBS connected.", "success");
    } catch {
      setAppError("Failed to connect OBS WebSocket.");
      addLog("OBS connect failed", `Unable to connect ${managementPlatform} OBS endpoint ${obsConfig.url}.`, {
        platform: managementPlatform,
        result: "error",
        errorCode: "OBS_CONNECT_FAILED",
        requestId,
      });
      showToast("OBS connect failed.", "error");
    } finally {
      setIsConnectingObs(false);
    }
  };

  const onDisconnectObs = async () => {
    setAppError("");
    const requestId = createRequestId();

    try {
      await disconnectObs(platformKey);
      addLog("OBS disconnected", `${managementPlatform} OBS connection closed.`, {
        platform: managementPlatform,
        result: "info",
        requestId,
      });
      showToast("OBS disconnected.", "info");
    } catch {
      setAppError("Failed to disconnect OBS.");
      addLog("OBS disconnect failed", `Unable to disconnect ${managementPlatform} OBS connection safely.`, {
        platform: managementPlatform,
        result: "error",
        errorCode: "OBS_DISCONNECT_FAILED",
        requestId,
      });
    }
  };

  const onSwitchObsScene = async () => {
    setAppError("");
    const targetSceneName = obsSceneDraft.trim();
    if (!obsConfig.url || !targetSceneName) {
      setAppError("Please provide a valid OBS scene name.");
      return;
    }

    const requestId = createRequestId();
    setIsSwitchingScene(true);
    try {
      await setObsProgramScene(platformKey, targetSceneName);
      setObsSceneDraft(targetSceneName);
      addLog("OBS scene switched", `Program scene switched to ${targetSceneName}.`, {
        platform: managementPlatform,
        result: "success",
        requestId,
      });
      showToast("OBS scene switched.", "success");
    } catch {
      setAppError("Failed to switch OBS scene.");
      addLog("OBS switch scene failed", `Unable to set scene ${targetSceneName}.`, {
        platform: managementPlatform,
        result: "error",
        errorCode: "OBS_SWITCH_SCENE_FAILED",
        requestId,
      });
    } finally {
      setIsSwitchingScene(false);
    }
  };

  const onObsSceneNameChange = (sceneName: string) => {
    setObsSceneDraft(sceneName);
  };

  const onObsConfigChange = (patch: Partial<ObsConfig>) => {
    setObsConfig((prev) => ({ ...prev, ...patch }));
  };

  const onStartStream = async () => {
    setAppError("");

    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.", {
        platform: managementPlatform,
        result: "error",
        errorCode: "INVALID_SCHEDULE_RANGE",
      });
      setAppError("End time must be later than Start time.");
      return;
    }

    if (!canRunWithCooldown(`${platformKey}-start-stream`, 1200)) {
      setAppError("Please wait a moment before starting stream again.");
      addLog("Start stream cooldown", "Start Stream action is cooling down to prevent race conditions.", {
        platform: managementPlatform,
        result: "info",
      });
      return;
    }

    setIsStartingStream(true);
    const requestId = createRequestId();

    try {
      const result = await startMockStream(scheduleStart);
      if (result.blocked) {
        addLog("Start blocked", result.detail, {
          platform: managementPlatform,
          result: "error",
          errorCode: "START_BLOCKED_BY_SCHEDULE",
          requestId,
        });
        setAppError(result.detail);
        return;
      }

      if (result.nextState) {
        setSessionState(result.nextState);
        setSessionLifecycleState(result.nextState);
      }

      if (obsSessionState.connectionStatus === "connected" && !obsSessionState.isStreaming) {
        await startObsStream(platformKey);
      }

      addLog("Stream started", result.detail, {
        platform: managementPlatform,
        result: "success",
        requestId,
      });
      showToast("Stream started.", "success");
    } catch {
      setAppError("Failed to start stream.");
      addLog("Stream start failed", "Failed to start stream lifecycle action.", {
        platform: managementPlatform,
        result: "error",
        errorCode: "STREAM_START_FAILED",
        requestId,
      });
    } finally {
      setIsStartingStream(false);
    }
  };

  const onEndStream = async () => {
    setAppError("");

    if (!canRunWithCooldown(`${platformKey}-end-stream`, 1200)) {
      setAppError("Please wait a moment before ending stream again.");
      addLog("End stream cooldown", "End Stream action is cooling down to prevent race conditions.", {
        platform: managementPlatform,
        result: "info",
      });
      return;
    }

    const confirmed = window.confirm(`Confirm ending ${managementPlatform} live session?`);
    if (!confirmed) return;

    setIsEndingStream(true);
    const requestId = createRequestId();

    try {
      const result = await endMockStream();
      setSessionState(result.nextState);
      setSessionLifecycleState(result.nextState);

      if (obsSessionState.connectionStatus === "connected" && obsSessionState.isStreaming) {
        await stopObsStream(platformKey);
      }

      addLog("Stream ended", result.detail, {
        platform: managementPlatform,
        result: "success",
        requestId,
      });
      showToast("Stream ended.", "success");
    } catch {
      setAppError("Failed to end stream.");
      addLog("Stream end failed", "Failed to complete end stream action.", {
        platform: managementPlatform,
        result: "error",
        errorCode: "STREAM_END_FAILED",
        requestId,
      });
    } finally {
      setIsEndingStream(false);
    }
  };

  return {
    sessionState,
    coverPreview,
    streamUrl,
    scheduleStart,
    scheduleEnd,
    setScheduleStart,
    setScheduleEnd,
    isScheduleRangeInvalid,
    isCreatingSession,
    isGeneratingUrl,
    isStartingStream,
    isEndingStream,
    isConnectingObs,
    isSwitchingScene,
    obsConfig,
    obsSessionState,
    obsSceneDraft,
    marketplaceShopProfile,
    isLoadingMarketplaceShopProfile,
    realtimeMetrics,
    streamHealth,
    onCoverChange,
    onCreateSession,
    onGenerateUrl,
    onCopyStreamUrl,
    onStartStream,
    onEndStream,
    onObsConfigChange,
    onConnectObs,
    onDisconnectObs,
    onSwitchObsScene,
    onObsSceneNameChange,
  };
};
