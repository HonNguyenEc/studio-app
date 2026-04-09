import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  Package,
  Play,
  Radio,
  RefreshCw,
  ShieldCheck,
  Tv,
  Upload,
  Wifi,
} from "lucide-react";
import Card from "./Card";
import StatusPill from "./StatusPill";
import type {
  DemoAccount,
  LogItem,
  ManagementPlatform,
  MarketplaceShopProfile,
  ObsConfig,
  ObsSessionState,
  Product,
  RealtimeMetrics,
  SessionState,
  ShopInfo,
  StreamHealth,
} from "../common/type/app.type";

type OverviewTabProps = {
  isCreatingSession: boolean;
  isGeneratingUrl: boolean;
  isStartingStream: boolean;
  isEndingStream: boolean;
  isConnectingObs: boolean;
  isSwitchingScene: boolean;
  coverPreview: string;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sessionState: SessionState;
  onCreateSession: () => void;
  onStartStream: () => void;
  onEndStream: () => void;
  onConnectObs: () => void;
  onDisconnectObs: () => void;
  onSwitchObsScene: () => void;
  onGenerateUrl: () => void;
  onCopyStreamUrl: () => void;
  onObsConfigChange: (patch: Partial<ObsConfig>) => void;
  onObsSceneNameChange: (sceneName: string) => void;
  streamUrl: string;
  obsConfig: ObsConfig;
  obsSessionState: ObsSessionState;
  obsSceneDraft: string;
  selectedProducts: Product[];
  visibleProductId: number | null;
  logs: LogItem[];
  shopInfo: ShopInfo;
  darkMode: boolean;
  scheduleStart: string;
  scheduleEnd: string;
  setScheduleStart: React.Dispatch<React.SetStateAction<string>>;
  setScheduleEnd: React.Dispatch<React.SetStateAction<string>>;
  currentUser: DemoAccount;
  isScheduleRangeInvalid: boolean;
  marketplaceShopProfile: MarketplaceShopProfile | null;
  isLoadingMarketplaceShopProfile: boolean;
  realtimeMetrics: RealtimeMetrics;
  streamHealth: StreamHealth;
  managementPlatform: ManagementPlatform;
};

export default function OverviewTab({
  isCreatingSession,
  isGeneratingUrl,
  isStartingStream,
  isEndingStream,
  isConnectingObs,
  isSwitchingScene,
  coverPreview,
  onCoverChange,
  sessionState,
  onCreateSession,
  onStartStream,
  onEndStream,
  onConnectObs,
  onDisconnectObs,
  onSwitchObsScene,
  onGenerateUrl,
  onCopyStreamUrl,
  onObsConfigChange,
  onObsSceneNameChange,
  streamUrl,
  obsConfig,
  obsSessionState,
  obsSceneDraft,
  selectedProducts,
  visibleProductId,
  logs,
  shopInfo,
  darkMode,
  scheduleStart,
  scheduleEnd,
  setScheduleStart,
  setScheduleEnd,
  currentUser,
  isScheduleRangeInvalid,
  marketplaceShopProfile,
  isLoadingMarketplaceShopProfile,
  realtimeMetrics,
  streamHealth,
  managementPlatform,
}: OverviewTabProps) {
  const getDatePart = (value: string) => (value && value.includes("T") ? value.split("T")[0] : "");
  const getTimePart = (value: string) => (value && value.includes("T") ? value.split("T")[1]?.slice(0, 5) || "" : "");

  const updateDateTime = (currentValue: string, part: "date" | "time", nextValue: string) => {
    const currentDate = getDatePart(currentValue);
    const currentTime = getTimePart(currentValue);
    const date = part === "date" ? nextValue : currentDate;
    const time = part === "time" ? nextValue : currentTime;
    if (!date && !time) return "";
    return `${date || ""}T${time || "00:00"}`;
  };

  const connectionTone =
    streamHealth.connectionStatus === "connected"
      ? "text-emerald-400"
      : streamHealth.connectionStatus === "limited"
        ? "text-amber-400"
        : "text-red-400";

  const obsConnectionTone =
    obsSessionState.connectionStatus === "connected"
      ? "text-emerald-400"
      : obsSessionState.connectionStatus === "connecting" || obsSessionState.connectionStatus === "reconnecting"
        ? "text-amber-400"
        : obsSessionState.connectionStatus === "error"
          ? "text-red-400"
          : darkMode
            ? "text-white/70"
            : "text-slate-600";

  return (
    <div className="self-start space-y-6">
      <Card darkMode={darkMode}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? "border border-white/10 bg-white/5 text-white" : "border border-slate-200 bg-slate-100 text-slate-700"}`}>
              <Radio className="h-3.5 w-3.5" /> {managementPlatform} Demo Console
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Livestream Management</h2>
            <p className={`mt-1 text-sm ${darkMode ? "text-white/55" : "text-slate-500"}`}>
              Demo only · No real marketplace credential or customer data.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl border px-4 py-3 text-right ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
              <div className={`text-[11px] uppercase tracking-[0.2em] ${darkMode ? "text-white/40" : "text-slate-400"}`}>{managementPlatform} Profile</div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                {isLoadingMarketplaceShopProfile ? "Loading..." : marketplaceShopProfile?.shopName || "Unavailable"}
              </div>
            </div>
            <div className={`rounded-2xl border px-4 py-3 text-right ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
              <div className={`text-[11px] uppercase tracking-[0.2em] ${darkMode ? "text-white/40" : "text-slate-400"}`}>Active Shop</div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{shopInfo.name}</div>
            </div>
            <StatusPill state={sessionState} />
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric title="Viewers" value={realtimeMetrics.viewers.toLocaleString()} darkMode={darkMode} />
          <Metric title="Orders / Min" value={realtimeMetrics.ordersPerMinute.toString()} darkMode={darkMode} />
          <Metric title="Conversion" value={`${realtimeMetrics.conversionRate}%`} darkMode={darkMode} />
          <Metric title="GMV (VND)" value={realtimeMetrics.gmv.toLocaleString()} darkMode={darkMode} />
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/45" : "border-slate-200 bg-slate-50"}`}>
            <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
              <Wifi className="h-4 w-4" /> Stream Health
            </div>
            <div className={`text-sm font-semibold ${connectionTone}`}>{streamHealth.connectionStatus.toUpperCase()}</div>
            <div className={`mt-2 text-xs ${darkMode ? "text-white/60" : "text-slate-500"}`}>
              Bitrate: {streamHealth.bitrateKbps} kbps · Latency: {streamHealth.latencyMs} ms · Dropped frames: {streamHealth.droppedFrames}
            </div>
            <div className={`mt-1 text-xs ${darkMode ? "text-white/45" : "text-slate-400"}`}>Last sync: {streamHealth.lastSyncAt}</div>
          </div>

          <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/45" : "border-slate-200 bg-slate-50"}`}>
            <div className={`mb-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Demo Notice</div>
            <ul className={`space-y-1 text-xs ${darkMode ? "text-white/65" : "text-slate-600"}`}>
              <li>• Platform-specific behavior is simulated for review.</li>
              <li>• No token refresh / no external API call in this demo flow.</li>
              <li>• Data changes automatically to mimic production operations.</li>
            </ul>
          </div>
        </div>

        <div className={`mb-6 rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
          <div className={`mb-3 flex items-center justify-between gap-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <Tv className="h-4 w-4" /> OBS WebSocket Controls ({managementPlatform})
            </div>
            <div className={`text-xs font-semibold ${obsConnectionTone}`}>{obsSessionState.connectionStatus.toUpperCase()}</div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <input
              type="text"
              value={obsConfig.url}
              onChange={(e) => onObsConfigChange({ url: e.target.value })}
              placeholder="ws://127.0.0.1:4455"
              className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-white text-slate-800"}`}
            />
            <input
              type="password"
              value={obsConfig.password}
              onChange={(e) => onObsConfigChange({ password: e.target.value })}
              placeholder="OBS password"
              className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-white text-slate-800"}`}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button
              onClick={onConnectObs}
              disabled={isConnectingObs || obsSessionState.connectionStatus === "connected"}
              className="rounded-2xl bg-emerald-600/90 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-900/30"
            >
              {isConnectingObs ? "Connecting..." : "Connect OBS"}
            </button>
            <button
              onClick={onDisconnectObs}
              disabled={obsSessionState.connectionStatus === "disconnected"}
              className="rounded-2xl bg-slate-600/90 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-800/40"
            >
              Disconnect
            </button>
            <button
              onClick={onStartStream}
              disabled={isStartingStream || !(sessionState === "created" || sessionState === "scheduled")}
              className="rounded-2xl bg-[#EF7CAF]/90 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#EF7CAF]/40"
            >
              Start Live
            </button>
            <button
              onClick={onEndStream}
              disabled={isEndingStream || sessionState !== "live"}
              className="rounded-2xl bg-red-600/90 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-red-900/30"
            >
              End Live
            </button>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <select
              value={obsSceneDraft}
              onChange={(e) => onObsSceneNameChange(e.target.value)}
              disabled={obsSessionState.connectionStatus !== "connected"}
              className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-white text-slate-800"}`}
            >
              <option value="">
                {obsSessionState.connectionStatus !== "connected"
                  ? "Connect OBS to load scene list"
                  : obsSessionState.availableScenes.length === 0
                    ? "No scene found from OBS"
                    : "Select program scene"}
              </option>
              {obsSessionState.availableScenes.map((sceneName) => (
                <option key={sceneName} value={sceneName}>
                  {sceneName}
                </option>
              ))}
            </select>
            <button
              onClick={onSwitchObsScene}
              disabled={isSwitchingScene || obsSessionState.connectionStatus !== "connected"}
              className="rounded-2xl bg-[#2C3DA6]/90 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#2C3DA6]/40"
            >
              {isSwitchingScene ? "Switching..." : "Switch Scene"}
            </button>
          </div>

          <div className={`mt-3 flex items-center gap-2 text-xs ${darkMode ? "text-white/60" : "text-slate-600"}`}>
            <RefreshCw className="h-3.5 w-3.5" />
            OBS streaming: <span className={`font-semibold ${obsSessionState.isStreaming ? "text-emerald-400" : "text-slate-400"}`}>{obsSessionState.isStreaming ? "ON" : "OFF"}</span>
            {obsSessionState.lastError ? <span className="text-red-400">• {obsSessionState.lastError}</span> : null}
          </div>

          <div className={`mt-3 grid gap-2 text-xs ${darkMode ? "text-white/60" : "text-slate-600"}`}>
            <div>
              Program (On Air): <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{obsSessionState.programSceneName || "--"}</span>
            </div>
            <div>
              Preview: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{obsSessionState.previewSceneName || "--"}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className={`rounded-3xl border p-5 ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/70"}`}>
            <div className={`mb-4 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Session Controls</div>
            {obsSessionState.connectionStatus === "connected" ? (
              <div className={`mb-3 rounded-2xl border px-3 py-2 text-xs ${darkMode ? "border-white/10 bg-slate-900/40 text-white/75" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                OBS Program Scene: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{obsSessionState.programSceneName || "--"}</span>
              </div>
            ) : null}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#EF7CAF] to-[#2C3DA6] shadow-2xl">
              {coverPreview ? (
                <img src={coverPreview} alt="cover" className="h-[520px] w-full object-cover" />
              ) : (
                <div className="flex h-[520px] items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/30">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`rounded-3xl border p-5 ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/70"}`}>
            <div className="mb-5 grid gap-4 lg:grid-cols-2">
              <div>
                <div className={`mb-2 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Cover Image</div>
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${darkMode ? "border-white/10 bg-slate-900/40 text-white/80" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Choose File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
                </label>
              </div>

              <div>
                <div className={`mb-2 flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <Clock3 className="h-5 w-5 text-[#EF7CAF]" /> Schedule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={getDatePart(scheduleStart)}
                      onChange={(e) => setScheduleStart(updateDateTime(scheduleStart, "date", e.target.value))}
                      className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none [color-scheme:${darkMode ? "dark" : "light"}] ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`}
                    />
                    <input
                      type="time"
                      value={getTimePart(scheduleStart)}
                      onChange={(e) => setScheduleStart(updateDateTime(scheduleStart, "time", e.target.value))}
                      className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none [color-scheme:${darkMode ? "dark" : "light"}] ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={getDatePart(scheduleEnd)}
                      onChange={(e) => setScheduleEnd(updateDateTime(scheduleEnd, "date", e.target.value))}
                      className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none [color-scheme:${darkMode ? "dark" : "light"}] ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`}
                    />
                    <input
                      type="time"
                      value={getTimePart(scheduleEnd)}
                      onChange={(e) => setScheduleEnd(updateDateTime(scheduleEnd, "time", e.target.value))}
                      className={`w-full rounded-2xl border px-3 py-3 text-sm outline-none [color-scheme:${darkMode ? "dark" : "light"}] ${darkMode ? "border-white/10 bg-slate-900/70 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                onClick={onCreateSession}
                disabled={isCreatingSession || !coverPreview || !(sessionState === "draft" || sessionState === "ended")}
                className="rounded-2xl bg-green-600/90 px-4 py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-green-900/30"
              >
                {isCreatingSession ? "Creating..." : sessionState === "ended" ? "Create New Session" : "Create Session"}
              </button>
              <button
                onClick={onGenerateUrl}
                disabled={isGeneratingUrl || sessionState === "draft"}
                className="rounded-2xl bg-[#2C3DA6]/90 px-4 py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-[#2C3DA6]/40"
              >
                {isGeneratingUrl ? "Generating..." : "Stream URL"}
              </button>
              <button
                onClick={onStartStream}
                disabled={isStartingStream || !(sessionState === "created" || sessionState === "scheduled")}
                className="rounded-2xl bg-[#EF7CAF]/90 px-4 py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-[#EF7CAF]/40"
              >
                {isStartingStream ? "Starting..." : "Start Stream"}
              </button>
              <button
                onClick={onEndStream}
                disabled={isEndingStream || sessionState !== "live"}
                className="rounded-2xl bg-red-600/90 px-4 py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-red-900/30"
              >
                {isEndingStream ? "Ending..." : "End Stream"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 text-sm uppercase tracking-wide ${darkMode ? "text-white/50" : "text-slate-500"}`}>Stream URL</div>
                <div className="flex items-start gap-3">
                  <div className={`min-w-0 flex-1 break-all text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>{streamUrl || "Not generated yet"}</div>
                  <button
                    onClick={onCopyStreamUrl}
                    disabled={!streamUrl}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${darkMode ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                  >
                    <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy</span>
                  </button>
                </div>
              </div>

              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 text-sm uppercase tracking-wide ${darkMode ? "text-white/50" : "text-slate-500"}`}>Current State</div>
                <div className={`text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{sessionState.toUpperCase()}</div>
                {isScheduleRangeInvalid ? <div className="mt-2 text-xs font-semibold text-red-400">End time must be later than Start time.</div> : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Metric title="Selected Products" value={selectedProducts.length.toString()} darkMode={darkMode} icon={<Package className="h-4 w-4" />} />
              <Metric title="Showing Product" value={visibleProductId ? `#${visibleProductId}` : "None"} darkMode={darkMode} icon={<Eye className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </Card>

      <Card darkMode={darkMode}>
        <div className={`mb-4 flex items-center gap-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> Demo Notes
        </div>
        <ul className={`space-y-2 text-sm ${darkMode ? "text-white/70" : "text-slate-600"}`}>
          <li>• Current account: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{currentUser?.name}</span> ({currentUser?.role}).</li>
          <li>• {managementPlatform} behavior (comments cadence, stream URL, metrics) is platform-specific demo logic.</li>
          <li>• No real customer/shop data is used in this environment.</li>
        </ul>
      </Card>

      <Card darkMode={darkMode}>
        <div className={`mb-4 flex items-center gap-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          <AlertCircle className="h-5 w-5 text-amber-400" /> System Logs
        </div>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className={darkMode ? "text-white/50" : "text-slate-500"}>No actions yet.</div>
          ) : (
            logs.slice().reverse().map((log) => (
              <div key={log.id} className={`flex items-start justify-between gap-4 rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div>
                  <div className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="font-medium">{log.action}</span>
                    {log.platform ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${darkMode ? "bg-white/10 text-white/80" : "bg-slate-200 text-slate-700"}`}>
                        {log.platform}
                      </span>
                    ) : null}
                    {log.result ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${log.result === "error" ? "bg-red-500/15 text-red-400" : log.result === "success" ? "bg-emerald-500/15 text-emerald-400" : darkMode ? "bg-white/10 text-white/80" : "bg-slate-200 text-slate-700"}`}>
                        {log.result}
                      </span>
                    ) : null}
                  </div>
                  <div className={`mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>{log.detail}</div>
                  {(log.errorCode || log.requestId) ? (
                    <div className={`mt-1 text-[11px] ${darkMode ? "text-white/40" : "text-slate-400"}`}>
                      {log.errorCode ? `error=${log.errorCode}` : ""}{log.errorCode && log.requestId ? " · " : ""}{log.requestId ? `req=${log.requestId}` : ""}
                    </div>
                  ) : null}
                </div>
                <div className={`text-xs ${darkMode ? "text-white/40" : "text-slate-400"}`}>{log.time}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

type MetricProps = {
  title: string;
  value: string;
  darkMode: boolean;
  icon?: React.ReactNode;
};

function Metric({ title, value, darkMode, icon }: MetricProps) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/45" : "border-slate-200 bg-slate-50"}`}>
      <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{icon}{title}</div>
      <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}
