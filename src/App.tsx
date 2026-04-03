import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Upload,
  Play,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MoonStar,
  Sun,
  Store,
  BadgeCheck,
  Copy,
  Radio,
  Clock3,
  LogIn,
  User,
  ShieldCheck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const seedProducts = [
  { id: 1, name: "T-Shirt", price: 19.99, stock: 50 },
  { id: 2, name: "Headphones", price: 59.99, stock: 20 },
  { id: 3, name: "Sunglasses", price: 29.99, stock: 100 },
  { id: 4, name: "Bottle", price: 12.5, stock: 78 },
  { id: 5, name: "Backpack", price: 34.99, stock: 15 },
  { id: 6, name: "Desk Lamp", price: 24.5, stock: 32 },
  { id: 7, name: "Water Bottle", price: 14.9, stock: 60 },
  { id: 8, name: "Sneakers", price: 79.0, stock: 18 },
];

const eCentricLogo = `data:image/svg+xml;utf8,
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="24" fill="white"/>
  <g transform="translate(48,34)">
    <circle cx="0" cy="0" r="20" fill="none" stroke="%23F4C430" stroke-width="10" stroke-linecap="round" stroke-dasharray="96 40" transform="rotate(18)"/>
    <line x1="0" y1="0" x2="13" y2="0" stroke="%23F4C430" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;

const demoAccounts = [
  {
    id: 1,
    role: "Admin",
    email: "admin@ecentric.demo",
    password: "123456",
    name: "Bia Admin",
    shopName: "eCentric Demo Store",
  },
  {
    id: 2,
    role: "Operator",
    email: "operator@ecentric.demo",
    password: "123456",
    name: "Livestream Operator",
    shopName: "eCentric Demo Store",
  },
];

const initialComments = [
  { id: 1, user: "demo_user_01", text: "Shop ơi còn size M không?", time: "10:12" },
  { id: 2, user: "demo_user_02", text: "Cho xin link sản phẩm này với", time: "10:13" },
];

function ProductThumb({ darkMode }) {
  return (
    <div
      className={`h-14 w-14 rounded-xl shadow-inner ${
        darkMode
          ? "bg-gradient-to-br from-cyan-300 to-blue-500"
          : "bg-gradient-to-br from-[#2C3DA6]/30 to-[#EF7CAF]/50"
      }`}
    />
  );
}

function AppShell({ darkMode, children }) {
  return (
    <div
      className={darkMode
        ? "min-h-screen bg-[radial-gradient(circle_at_top,_#121826,_#06080d_50%)] text-white"
        : "min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#eef2ff_55%)] text-slate-900"}
    >
      {children}
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, shopInfo, darkMode, setDarkMode, currentUser, onLogout, isSidebarCollapsed, setIsSidebarCollapsed }) {
  const items = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: Package },
    { key: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <aside
      className={`relative self-start w-full rounded-3xl border p-3 shadow-2xl backdrop-blur transition-all duration-300 ${
        isSidebarCollapsed ? "md:w-24" : "md:w-72"
      } ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"}`}
    >
      <div className={`mb-6 px-2 pt-2 ${isSidebarCollapsed ? "flex flex-col items-center gap-3" : "flex items-center justify-between"}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
          <img src={eCentricLogo} alt="eCentric logo" className="h-12 w-12 rounded-2xl bg-white object-contain p-1 shadow-sm" />
          {!isSidebarCollapsed ? (
            <div>
              <div className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#2C3DA6]"}`}>
                eCentric Studio
              </div>
              <div className={`text-xs ${darkMode ? "text-white/50" : "text-slate-500"}`}>Demo Mode · Mock API</div>
            </div>
          ) : null}
        </div>

        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`rounded-2xl border p-2 ${
                darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-[#2C3DA6]"
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className={`rounded-2xl border p-2 ${
                darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-[#2C3DA6]"
              }`}
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`rounded-2xl border p-2 ${
                darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-[#2C3DA6]"
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className={`rounded-2xl border p-2 ${
                darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-[#2C3DA6]"
              }`}
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {!isSidebarCollapsed ? (
        <>
          <div className={`mb-4 rounded-3xl border p-4 ${darkMode ? "border-[#2C3DA6]/30 bg-gradient-to-br from-[#2C3DA6]/20 to-[#EF7CAF]/10" : "border-[#2C3DA6]/15 bg-gradient-to-br from-[#2C3DA6]/8 to-[#EF7CAF]/10"}`}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className={`flex items-center gap-2 pt-1 text-sm font-semibold ${darkMode ? "text-indigo-200" : "text-[#2C3DA6]"}`}>
                <BadgeCheck className="h-4 w-4" /> Demo Environment
              </div>
              <span className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-center text-xs font-semibold leading-tight ${darkMode ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border border-emerald-500/15 bg-emerald-500/10 text-emerald-700"}`}>
                Ready for Review
              </span>
            </div>

            <div className={`rounded-2xl border p-3 ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/80"}`}>
              <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                <Store className={`h-4 w-4 ${darkMode ? "text-[#EF7CAF]" : "text-[#2C3DA6]"}`} /> {shopInfo.name}
              </div>
              <div className={`space-y-1 text-xs ${darkMode ? "text-white/55" : "text-slate-500"}`}>
                <div>Shop ID: <span className={darkMode ? "text-white/80" : "text-slate-700"}>{shopInfo.id}</span></div>
                <div>Region: <span className={darkMode ? "text-white/80" : "text-slate-700"}>{shopInfo.region}</span></div>
                <div>Mode: <span className={darkMode ? "text-white/80" : "text-slate-700"}>{shopInfo.mode}</span></div>
              </div>
            </div>
          </div>

          <div className={`mb-4 rounded-3xl border p-4 ${darkMode ? "border-white/10 bg-slate-900/35" : "border-slate-200 bg-slate-50"}`}>
            <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
              <User className="h-4 w-4 text-[#EF7CAF]" /> Logged in Account
            </div>
            <div className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{currentUser?.name}</div>
            <div className={`mt-1 text-xs ${darkMode ? "text-white/55" : "text-slate-500"}`}>{currentUser?.email}</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${darkMode ? "bg-[#EF7CAF]/15 text-pink-200" : "bg-[#EF7CAF]/12 text-[#b43c7d]"}`}>
                {currentUser?.role}
              </span>
              <button
                onClick={onLogout}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${darkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"}`}
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </>
      ) : null}

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex w-full items-center rounded-2xl transition ${
                isSidebarCollapsed ? "justify-center px-0 py-4" : "gap-3 px-4 py-4 text-left"
              } ${
                active
                  ? "bg-[#2C3DA6] text-white shadow-lg"
                  : darkMode
                    ? "bg-slate-700/70 text-white/90 hover:bg-slate-600/80"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              {!isSidebarCollapsed ? <span className="text-lg font-medium">{item.label}</span> : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function StatusPill({ state }) {
  const map = {
    draft: "bg-slate-600 text-white",
    created: "bg-green-600 text-white",
    scheduled: "bg-sky-600 text-white",
    live: "bg-amber-500 text-white",
    ended: "bg-red-600 text-white",
  };
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${map[state]}`}>{state.toUpperCase()}</span>;
}

function Card({ darkMode, children, className = "" }) {
  return (
    <section className={`rounded-3xl border p-6 shadow-2xl backdrop-blur ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"} ${className}`}>
      {children}
    </section>
  );
}

function OverviewTab({
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
}) {
  const getDatePart = (value) => (value && value.includes("T") ? value.split("T")[0] : "");
  const getTimePart = (value) => (value && value.includes("T") ? value.split("T")[1]?.slice(0, 5) || "" : "");
  const updateDateTime = (currentValue, part, nextValue) => {
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

function LoginScreen({ darkMode, setDarkMode, loginForm, setLoginForm, onLogin, loginError }) {
  return (
    <AppShell darkMode={darkMode}>
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[28px] border p-8 shadow-2xl ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/85"}`}>
            <div className="mb-8 flex items-center gap-4">
              <img src={eCentricLogo} alt="eCentric logo" className="h-16 w-16 rounded-3xl bg-white p-1.5 shadow-sm" />
              <div>
                <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-[#2C3DA6]"}`}>eCentric Studio</div>
                <div className={`${darkMode ? "text-white/55" : "text-slate-500"}`}>Shopee Livestream Demo Portal</div>
              </div>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`ml-auto rounded-2xl border p-2 ${darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-[#2C3DA6]"}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              </button>
            </div>

            <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${darkMode ? "border border-[#EF7CAF]/20 bg-[#EF7CAF]/10 text-pink-200" : "border border-[#EF7CAF]/20 bg-[#EF7CAF]/10 text-[#b43c7d]"}`}>
              <LogIn className="h-3.5 w-3.5" /> Demo Login
            </div>

            <h1 className={`text-4xl font-bold leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Login to manage the livestream demo environment</h1>
            <p className={`mt-3 text-base ${darkMode ? "text-white/60" : "text-slate-500"}`}>Use one of the demo accounts below to enter the system and show account-based management flow.</p>

            <div className="mt-8 grid gap-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Email</label>
                <input
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@ecentric.demo"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${darkMode ? "border-white/10 bg-slate-900/40 text-white placeholder:text-white/35" : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400"}`}
                />
              </div>
              <div>
                <label className={`mb-2 block text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="123456"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${darkMode ? "border-white/10 bg-slate-900/40 text-white placeholder:text-white/35" : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400"}`}
                />
              </div>

              {loginError ? (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${darkMode ? "border-red-400/15 bg-red-400/10 text-red-200" : "border-red-200 bg-red-50 text-red-600"}`}>
                  {loginError}
                </div>
              ) : null}

              <button onClick={onLogin} className="rounded-2xl bg-[#2C3DA6] px-5 py-4 text-base font-semibold text-white shadow-lg hover:opacity-95">
                Login to Demo Portal
              </button>
            </div>
          </div>

          <div className={`rounded-[28px] border p-8 shadow-2xl ${darkMode ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/85"}`}>
            <div className={`mb-4 flex items-center gap-2 text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Demo Accounts
            </div>
            <div className="space-y-4">
              {demoAccounts.map((acc) => (
                <div key={acc.id} className={`rounded-3xl border p-5 ${darkMode ? "border-white/10 bg-slate-900/45" : "border-slate-200 bg-slate-50"}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{acc.name}</div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${darkMode ? "bg-[#EF7CAF]/15 text-pink-200" : "bg-[#EF7CAF]/12 text-[#b43c7d]"}`}>{acc.role}</span>
                  </div>
                  <div className={`space-y-1 text-sm ${darkMode ? "text-white/60" : "text-slate-500"}`}>
                    <div>Email: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{acc.email}</span></div>
                    <div>Password: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{acc.password}</span></div>
                    <div>Shop: <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{acc.shopName}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: demoAccounts[0].email, password: demoAccounts[0].password });
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState(demoAccounts[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [sessionState, setSessionState] = useState("draft");
  const [sessionLifecycleState, setSessionLifecycleState] = useState("draft");
  const [coverPreview, setCoverPreview] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [products, setProducts] = useState(seedProducts.slice(0, 5));
  const [hiddenProducts, setHiddenProducts] = useState(seedProducts.slice(5));
  const [shopInfo] = useState({
    name: "eCentric Demo Store",
    id: "VN_SHOP_2401",
    region: "Vietnam",
    mode: "Demo / Mock API",
  });
  const [selectedProducts, setSelectedProducts] = useState([1, 2]);
  const [allSelected, setAllSelected] = useState(false);
  const [appliedProductIds, setAppliedProductIds] = useState([1, 2]);
  const [visibleProductId, setVisibleProductId] = useState(null);
  const [comments, setComments] = useState(initialComments);
  const [draftComment, setDraftComment] = useState("");
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");

  const parseScheduleValue = (value) => {
    if (!value) return null;
    const dt = new Date(value);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const isScheduleRangeInvalid = (() => {
    const start = parseScheduleValue(scheduleStart);
    const end = parseScheduleValue(scheduleEnd);
    if (!start || !end) return false;
    return end <= start;
  })();

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const mock = [
        "Còn voucher không shop?",
        "Cho xin mã giảm giá với ạ",
        "Mẫu này có màu đen không?",
        "Có freeship không ạ?",
      ];
      const text = mock[Math.floor(Math.random() * mock.length)];
      setComments((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          user: `viewer_${Math.floor(Math.random() * 100)}`,
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    const start = parseScheduleValue(scheduleStart);
    const end = parseScheduleValue(scheduleEnd);
    if (!start && !end) return;

    const timer = setInterval(() => {
      const now = new Date();

      if (sessionState === "scheduled" && start && now >= start) {
        setSessionState("live");
        setSessionLifecycleState("live");
        addLog("Stream auto-started", `Session automatically moved to LIVE at ${now.toLocaleTimeString()}.`);
        return;
      }

      if (sessionState === "live" && end && now >= end) {
        setSessionState("ended");
        setSessionLifecycleState("ended");
        addLog("Stream auto-ended", `Session automatically moved to ENDED at ${now.toLocaleTimeString()}.`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState, scheduleStart, scheduleEnd]);

  const handleLogin = () => {
    const matched = demoAccounts.find(
      (acc) => acc.email === loginForm.email.trim() && acc.password === loginForm.password
    );

    if (!matched) {
      setLoginError("Invalid demo account. Please use one of the accounts listed on the right.");
      return;
    }

    setCurrentUser(matched);
    setIsAuthenticated(true);
    setLoginError("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("overview");
  };

  const addLog = (action, detail) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        action,
        detail,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const onCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    addLog("Cover uploaded", `Loaded local file: ${file.name}`);
  };

  const onCreateSession = () => {
    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      return;
    }

    const now = new Date();
    const start = parseScheduleValue(scheduleStart);
    const hasFutureSchedule = start && start > now;
    const nextState = hasFutureSchedule ? "scheduled" : "created";
    setSessionState(nextState);
    setSessionLifecycleState(nextState);
    setVisibleProductId(null);
    setStreamUrl("");
    addLog(
      sessionLifecycleState === "ended" ? "New session created" : "Session created",
      `Mock session created successfully.${scheduleStart ? ` Scheduled start: ${scheduleStart}.` : ""}${scheduleEnd ? ` Scheduled end: ${scheduleEnd}.` : ""}`
    );
  };

  const onGenerateUrl = () => {
    const url = `rtmp://demo.shopee-live.local/session/${Math.random().toString(36).slice(2, 10)}`;
    setStreamUrl(url);
    addLog("Stream URL generated", url);
  };

  const onCopyStreamUrl = async () => {
    if (!streamUrl) return;
    try {
      await navigator.clipboard.writeText(streamUrl);
      addLog("Stream URL copied", "Copied stream URL to clipboard.");
    } catch (error) {
      addLog("Copy failed", "Clipboard permission is unavailable in this environment.");
    }
  };

  const onStartStream = () => {
    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      return;
    }

    const now = new Date();
    const start = parseScheduleValue(scheduleStart);
    if (start && start > now) {
      addLog("Start blocked", `Stream is scheduled for ${scheduleStart}. Demo session stays in SCHEDULED state until that time.`);
      return;
    }

    setSessionState("live");
    setSessionLifecycleState("live");
    addLog("Stream started", "Session moved to LIVE state.");
  };

  const onEndStream = () => {
    setSessionState("ended");
    setSessionLifecycleState("ended");
    addLog("Stream ended", "Session moved to ENDED state.");
  };

  const toggleProduct = (id) => {
    setSelectedProducts((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setAllSelected(next.length === products.length && products.length > 0);
      return next;
    });
  };

  const handleSelectAllProducts = () => {
    if (allSelected) {
      setSelectedProducts([]);
      setAllSelected(false);
      addLog("Selection cleared", "All products were unselected.");
      return;
    }

    const allIds = products.map((p) => p.id);
    setSelectedProducts(allIds);
    setAllSelected(true);
    addLog("All products selected", `${allIds.length} product(s) selected.`);
  };

  const addProduct = () => {
    if (hiddenProducts.length === 0) {
      addLog("Add product skipped", "No more hidden mock products to add.");
      return;
    }

    const next = hiddenProducts[0];
    setProducts((prev) => {
      const updated = [...prev, next];
      setAllSelected(selectedProducts.length === updated.length && updated.length > 0);
      return updated;
    });
    setHiddenProducts((prev) => prev.slice(1));
    addLog("Product added", `${next.name} added to demo product list.`);
  };

  const applySet = () => {
    setAppliedProductIds(selectedProducts);
    addLog("Product set applied", `${selectedProducts.length} product(s) added to current demo set.`);
  };

  const showProduct = (id) => {
    setVisibleProductId(id);
    const product = products.find((p) => p.id === id);
    addLog("Product shown", `${product?.name || `#${id}`} is now visible in livestream.`);
  };

  const removeProduct = (id) => {
    const targetId = id || visibleProductId || selectedProducts[0];
    if (!targetId) return;

    setVisibleProductId((prev) => (prev === targetId ? null : prev));
    setSelectedProducts((prev) => {
      const next = prev.filter((x) => x !== targetId);
      setAllSelected(next.length === products.length && products.length > 0);
      return next;
    });
    setAppliedProductIds((prev) => prev.filter((x) => x !== targetId));

    const product = products.find((p) => p.id === targetId);
    addLog("Product removed", `${product?.name || `#${targetId}`} removed from current demo selection.`);
  };

  const sendComment = () => {
    if (!draftComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: currentUser?.email?.split("@")[0] || "studio_operator",
        text: draftComment.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    addLog("Comment sent", draftComment.trim());
    setDraftComment("");
  };

  const refreshComments = () => {
    const mock = [
      "Còn voucher không shop?",
      "Cho xin mã giảm giá với ạ",
      "Mẫu này có màu đen không?",
    ];
    const text = mock[Math.floor(Math.random() * mock.length)];
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: `viewer_${Math.floor(Math.random() * 100)}`,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    addLog("Comments refreshed", "Pulled 1 mock comment from demo source.");
  };

  const selectedProductObjects = useMemo(
    () => products.filter((p) => selectedProducts.includes(p.id)),
    [products, selectedProducts]
  );

  if (!isAuthenticated) {
    return (
      <LoginScreen
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        onLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  return (
    <AppShell darkMode={darkMode}>
      <div className="p-4 md:p-6">
        <div
          className={`mx-auto grid max-w-[1700px] items-start gap-6 ${
            isSidebarCollapsed
              ? "md:grid-cols-[96px_minmax(0,1fr)]"
              : "md:grid-cols-[280px_minmax(0,1fr)]"
          }`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} shopInfo={shopInfo} darkMode={darkMode} setDarkMode={setDarkMode} currentUser={currentUser} onLogout={handleLogout} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />

          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="space-y-6"
          >
            {activeTab === "overview" && (
              <OverviewTab
                coverPreview={coverPreview}
                onCoverChange={onCoverChange}
                sessionState={sessionState}
                onCreateSession={onCreateSession}
                onStartStream={onStartStream}
                onEndStream={onEndStream}
                onGenerateUrl={onGenerateUrl}
                streamUrl={streamUrl}
                selectedProducts={selectedProductObjects}
                visibleProductId={visibleProductId}
                logs={logs}
                shopInfo={shopInfo}
                onCopyStreamUrl={onCopyStreamUrl}
                darkMode={darkMode}
                scheduleStart={scheduleStart}
                scheduleEnd={scheduleEnd}
                setScheduleStart={setScheduleStart}
                setScheduleEnd={setScheduleEnd}
                currentUser={currentUser}
                isScheduleRangeInvalid={isScheduleRangeInvalid}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                darkMode={darkMode}
                products={products}
                selectedProducts={selectedProducts}
                toggleProduct={toggleProduct}
                applySet={applySet}
                visibleProductId={visibleProductId}
                showProduct={showProduct}
                removeProduct={removeProduct}
                addProduct={addProduct}
                appliedProductIds={appliedProductIds}
                allSelected={allSelected}
                handleSelectAllProducts={handleSelectAllProducts}
              />
            )}

            {activeTab === "comments" && (
              <CommentsTab
                darkMode={darkMode}
                comments={comments}
                draftComment={draftComment}
                setDraftComment={setDraftComment}
                sendComment={sendComment}
                refreshComments={refreshComments}
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
                currentUser={currentUser}
              />
            )}
          </motion.main>
        </div>
      </div>
    </AppShell>
  );
}
