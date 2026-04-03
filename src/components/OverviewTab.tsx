import React from "react";
import { Upload, Play, Copy, Clock3, Package, Eye, Radio, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Card from "./Card";
import StatusPill from "./StatusPill";
import type { SessionState, Product, LogItem, ShopInfo, DemoAccount } from "../types";

type OverviewTabProps = {
  coverPreview: string;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sessionState: SessionState;
  onCreateSession: () => void;
  onStartStream: () => void;
  onEndStream: () => void;
  onGenerateUrl: () => void;
  onCopyStreamUrl: () => void;
  streamUrl: string;
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
};

export default function OverviewTab({
  coverPreview,
  onCoverChange,
  sessionState,
  onCreateSession,
  onStartStream,
  onEndStream,
  onGenerateUrl,
  onCopyStreamUrl,
  streamUrl,
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
}: OverviewTabProps) {
  const getDatePart = (value: string) => (value && value.includes("T") ? value.split("T")[0] : "");
  const getTimePart = (value: string) => (value && value.includes("T") ? value.split("T")[1]?.slice(0, 5) || "" : "");

  const updateDateTime = (
    currentValue: string,
    part: "date" | "time",
    nextValue: string
  ) => {
    const currentDate = getDatePart(currentValue);
    const currentTime = getTimePart(currentValue);
    const date = part === "date" ? nextValue : currentDate;
    const time = part === "time" ? nextValue : currentTime;
    if (!date && !time) return "";
    return `${date || ""}T${time || "00:00"}`;
  };

  return (
    <div className="self-start space-y-6">
      <Card darkMode={darkMode}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${darkMode ? "border border-[#EF7CAF]/20 bg-[#EF7CAF]/10 text-pink-200" : "border border-[#EF7CAF]/20 bg-[#EF7CAF]/10 text-[#b43c7d]"}`}>
              <Radio className="h-3.5 w-3.5" /> Livestream Demo Console
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Livestream Management</h2>
            <p className={`mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>Pre-integration prototype for Shopee review and testing.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl border px-4 py-3 text-right ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
              <div className={`text-[11px] uppercase tracking-[0.2em] ${darkMode ? "text-white/40" : "text-slate-400"}`}>Active Shop</div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{shopInfo.name}</div>
            </div>
            <StatusPill state={sessionState} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className={`rounded-3xl border p-5 ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/70"}`}>
            <div className={`mb-4 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Session Controls</div>
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
            <div className="mb-4 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${darkMode ? "text-white/40" : "text-slate-400"}`}>Session Info</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className={`text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>Session ID</div>
                    <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>LS-DEMO-2401</div>
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>Operator</div>
                    <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>studio_operator</div>
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>Approval</div>
                    <div className="mt-1 text-sm font-semibold text-amber-500">Pending Livestream Scope</div>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-[#2C3DA6]/20 bg-[#2C3DA6]/10" : "border-[#2C3DA6]/10 bg-[#2C3DA6]/5"}`}>
                <div className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${darkMode ? "text-indigo-200/70" : "text-[#2C3DA6]/70"}`}>API Status</div>
                <div className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Core app ready · Waiting for official Shopee approval</div>
              </div>
            </div>

            <div className="mb-5 grid gap-4 lg:grid-cols-2">
              <div>
                <div className={`mb-2 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Cover Image</div>
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${darkMode ? "border-white/10 bg-slate-900/40 text-white/80" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Choose File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
                  <span className={`truncate ${darkMode ? "text-white/50" : "text-slate-500"}`}>Upload local image for demo</span>
                </label>
              </div>

              <div>
                <div className={`mb-2 flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <Clock3 className="h-5 w-5 text-[#EF7CAF]" /> Schedule
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className={`text-xs font-medium ${darkMode ? "text-white/55" : "text-slate-500"}`}>Start</div>
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
                    <div className={`text-xs font-medium ${darkMode ? "text-white/55" : "text-slate-500"}`}>End</div>
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

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <button className={`rounded-2xl border px-4 py-4 text-base font-semibold shadow-lg cursor-not-allowed ${darkMode ? "border-white/10 bg-slate-800/55 text-white/40" : "border-slate-200 bg-slate-100 text-slate-400"}`}>
                Upload Cover
              </button>
              <button
                onClick={onCreateSession}
                disabled={!coverPreview || !(sessionState === "draft" || sessionState === "ended")}
                className={`rounded-2xl px-4 py-4 text-base font-semibold text-white shadow-lg transition ${
                  !coverPreview || !(sessionState === "draft" || sessionState === "ended")
                    ? darkMode
                      ? "cursor-not-allowed bg-green-900/35 text-white/40"
                      : "cursor-not-allowed bg-green-200 text-white/70"
                    : "bg-green-600/90 hover:bg-green-600"
                }`}
              >
                {sessionState === "ended" ? "Create New Session" : "Create Session"}
              </button>
              <button
                onClick={onGenerateUrl}
                disabled={sessionState === "draft"}
                className={`rounded-2xl px-4 py-4 text-base font-semibold text-white shadow-lg transition ${
                  sessionState === "draft"
                    ? darkMode
                      ? "cursor-not-allowed bg-purple-900/35 text-white/40"
                      : "cursor-not-allowed bg-purple-200 text-white/70"
                    : "bg-[#2C3DA6]/90 hover:bg-[#2C3DA6]"
                }`}
              >
                Stream URL
              </button>
              <button
                onClick={onStartStream}
                disabled={!(sessionState === "created" || sessionState === "scheduled")}
                className={`rounded-2xl px-4 py-4 text-base font-semibold text-white shadow-lg transition ${
                  !(sessionState === "created" || sessionState === "scheduled")
                    ? darkMode
                      ? "cursor-not-allowed bg-amber-900/35 text-white/40"
                      : "cursor-not-allowed bg-amber-200 text-white/70"
                    : "bg-[#EF7CAF]/90 hover:bg-[#EF7CAF]"
                }`}
              >
                Start Stream
              </button>
              <button
                onClick={onEndStream}
                disabled={sessionState !== "live"}
                className={`rounded-2xl px-4 py-4 text-base font-semibold text-white shadow-lg transition ${
                  sessionState !== "live"
                    ? darkMode
                      ? "cursor-not-allowed bg-red-900/35 text-white/40"
                      : "cursor-not-allowed bg-red-200 text-white/70"
                    : "bg-red-600/90 hover:bg-red-600"
                }`}
              >
                End Stream
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
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      streamUrl
                        ? darkMode
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : darkMode
                          ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30"
                          : "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-300"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy</span>
                  </button>
                </div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 text-sm uppercase tracking-wide ${darkMode ? "text-white/50" : "text-slate-500"}`}>Current State</div>
                <div className={`text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{sessionState.toUpperCase()}</div>
                {sessionState === "scheduled" && scheduleStart ? (
                  <div className={`mt-2 text-xs ${darkMode ? "text-white/55" : "text-slate-500"}`}>Start at: {scheduleStart}</div>
                ) : null}
                {isScheduleRangeInvalid ? (
                  <div className="mt-2 text-xs font-semibold text-red-400">End time must be later than Start time.</div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <Package className="h-4 w-4" /> Selected Products
                </div>
                <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{selectedProducts.length}</div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <Eye className="h-4 w-4" /> Showing Product
                </div>
                <div className={`text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{visibleProductId ? `#${visibleProductId}` : "None"}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card darkMode={darkMode}>
        <div className={`mb-4 flex items-center gap-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> Demo Script
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Login with demo account",
            "Upload a cover image",
            "Create session and generate stream URL",
            "Select products and show one product",
            "Start stream",
            "Open Comments tab and show auto-refresh",
            "Send a mock operator comment",
            "End stream and review logs",
          ].map((step, index) => (
            <div key={step} className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/45" : "border-slate-200 bg-slate-50"}`}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#EF7CAF]">Step {index + 1}</div>
              <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>{step}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card darkMode={darkMode}>
        <div className={`mb-4 flex items-center gap-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          <AlertCircle className="h-5 w-5 text-amber-400" /> Demo Notes
        </div>
        <ul className={`space-y-2 text-sm ${darkMode ? "text-white/70" : "text-slate-600"}`}>
          <li>• This prototype uses <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>mock data</span> and is ready for real API mapping later.</li>
          <li>• The current buttons simulate <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>session lifecycle</span> for review/testing.</li>
          <li>• Start/End schedule is added for demo planning and can later map to real session config.</li>
          <li>• If a future start time is set, the session goes to <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>SCHEDULED</span> and will not switch to LIVE immediately.</li>
          <li>• Current logged-in account: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{currentUser?.name}</span> ({currentUser?.role}).</li>
        </ul>
      </Card>

      <Card darkMode={darkMode}>
        <div className={`mb-4 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>System Logs</div>
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
                  </div>
                  <div className={`mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>{log.detail}</div>
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

function ProductsTab({ darkMode, products, selectedProducts, toggleProduct, applySet, visibleProductId, showProduct, removeProduct, addProduct, appliedProductIds, allSelected, handleSelectAllProducts }) {
  return (
    <Card darkMode={darkMode}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Product Management</div>
          <div className={`mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>Select products, apply the set, and choose what will be shown during livestream.</div>
          <div className={`mt-2 text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>
            Applied set: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{appliedProductIds.length} product(s)</span>
          </div>
          <div className={`mt-2 text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>
            Status legend: <span className="font-semibold text-green-500">SELECTED</span> · <span className="font-semibold text-sky-500">APPLIED</span> · <span className="font-semibold text-pink-500">VISIBLE</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSelectAllProducts}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition ${darkMode ? "bg-white/10 text-white hover:bg-white/15" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          {allSelected ? "Clear All" : "Select All"}
        </button>
        <div className={`text-sm ${darkMode ? "text-white/55" : "text-slate-500"}`}>
          {selectedProducts.length} / {products.length} selected
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button onClick={addProduct} className="rounded-2xl bg-[#2C3DA6] px-4 py-4 text-lg font-semibold text-white shadow-lg">
          <span className="inline-flex items-center gap-2"><Plus className="h-5 w-5" /> Add Products</span>
        </button>
        <button onClick={applySet} className="rounded-2xl bg-green-600 px-4 py-4 text-lg font-semibold text-white shadow-lg">Apply Set</button>
        <button onClick={() => selectedProducts[0] && showProduct(selectedProducts[0])} className="rounded-2xl bg-[#EF7CAF] px-4 py-4 text-lg font-semibold text-white shadow-lg">Show Product</button>
        <button
          onClick={() => removeProduct()}
          disabled={!visibleProductId && selectedProducts.length === 0}
          className={`rounded-2xl px-4 py-4 text-lg font-semibold text-white shadow-lg transition ${
            !visibleProductId && selectedProducts.length === 0
              ? "cursor-not-allowed bg-red-300/70"
              : "bg-red-600"
          }`}
        >
          <span className="inline-flex items-center gap-2"><Trash2 className="h-5 w-5" /> Remove Product</span>
        </button>
      </div>

      <div className={`overflow-hidden rounded-3xl border ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white"}`}>
        <table className={`min-w-full text-left ${darkMode ? "text-white" : "text-slate-900"}`}>
          <thead className={`border-b text-lg ${darkMode ? "border-white/10 text-white/90" : "border-slate-200 text-slate-700"}`}>
            <tr>
              <th className="px-6 py-5">Select</th>
              <th className="px-6 py-5">Image</th>
              <th className="px-6 py-5">Name</th>
              <th className="px-6 py-5">Price</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const selected = selectedProducts.includes(p.id);
              const applied = appliedProductIds.includes(p.id);
              const visible = visibleProductId === p.id;
              return (
                <tr key={p.id} className={darkMode ? "border-b border-white/10 last:border-none" : "border-b border-slate-200 last:border-none"}>
                  <td className="px-6 py-5">
                    <input type="checkbox" checked={selected} onChange={() => toggleProduct(p.id)} className="h-5 w-5 rounded" />
                  </td>
                  <td className="px-6 py-5"><ProductThumb darkMode={darkMode} /></td>
                  <td className="px-6 py-5 text-xl font-medium">{p.name}</td>
                  <td className="px-6 py-5 text-xl">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-5 text-xl">{p.stock}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {visible ? (
                        <span className="rounded-full bg-[#EF7CAF] px-3 py-1 text-xs font-semibold text-white">VISIBLE</span>
                      ) : null}
                      {applied ? (
                        <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white">APPLIED</span>
                      ) : null}
                      {selected ? (
                        <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">SELECTED</span>
                      ) : null}
                      {!visible && !applied && !selected ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${darkMode ? "bg-slate-600" : "bg-slate-400"}`}>IDLE</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => showProduct(p.id)} className={`rounded-xl border px-4 py-2 text-sm font-medium ${darkMode ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                      Show
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CommentsTab({ darkMode, comments, draftComment, setDraftComment, sendComment, refreshComments, autoRefresh, setAutoRefresh, currentUser }) {
  return (
    <Card darkMode={darkMode}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Comments</div>
          <div className={`mt-1 text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}>Real-time comments can be connected after official API approval.</div>
          <div className={`mt-2 text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>Posting as: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{currentUser?.name}</span></div>
        </div>

        <label className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${darkMode ? "border-white/10 bg-slate-900/40 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="h-4 w-4 rounded" />
          Auto refresh every 5s
        </label>
      </div>

      <div className={`rounded-3xl border p-6 ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white"}`}>
        <label className={`mb-3 block text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Post Comment</label>
        <textarea
          value={draftComment}
          onChange={(e) => setDraftComment(e.target.value)}
          placeholder="Type a comment..."
          className={`min-h-[140px] w-full rounded-2xl border p-4 text-lg outline-none ${darkMode ? "border-white/10 bg-slate-900/40 text-white placeholder:text-white/40" : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400"}`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={sendComment} className="rounded-2xl bg-[#2C3DA6] px-6 py-4 text-lg font-semibold text-white shadow-lg">Send Comment</button>
          <button onClick={refreshComments} className="rounded-2xl bg-[#EF7CAF] px-6 py-4 text-lg font-semibold text-white shadow-lg">
            <span className="inline-flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Refresh Comments</span>
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {comments.length === 0 ? (
            <div className={`text-lg ${darkMode ? "text-white/50" : "text-slate-500"}`}>No comments yet.</div>
          ) : (
            comments.slice().reverse().map((c) => (
              <div key={c.id} className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className={`text-sm ${darkMode ? "text-white/60" : "text-slate-500"}`}>@{c.user}</div>
                  <div className={`text-xs ${darkMode ? "text-white/40" : "text-slate-400"}`}>{c.time}</div>
                </div>
                <div className={`mt-2 text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>{c.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}