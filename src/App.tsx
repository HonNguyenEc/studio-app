import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type {
  SessionState,
  ActiveTab,
  Product,
  DemoAccount,
  CommentItem,
  LogItem,
  ShopInfo,
} from "./types";
import { seedProducts, eCentricLogo, demoAccounts, initialComments } from "./mockData";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import OverviewTab from "./components/OverviewTab";
import ProductsTab from "./components/ProductsTab";
import CommentsTab from "./components/CommentsTab";
import AppShell from "./components/AppShell";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
const [loginForm, setLoginForm] = useState<{ email: string; password: string }>({
  email: demoAccounts[0].email,
  password: demoAccounts[0].password,
});
const [loginError, setLoginError] = useState<string>("");
const [currentUser, setCurrentUser] = useState<DemoAccount>(demoAccounts[0]);
const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
const [sessionState, setSessionState] = useState<SessionState>("draft");
const [sessionLifecycleState, setSessionLifecycleState] = useState<SessionState>("draft");
const [coverPreview, setCoverPreview] = useState<string>("");
const [streamUrl, setStreamUrl] = useState<string>("");
const [products, setProducts] = useState<Product[]>(seedProducts.slice(0, 5));
const [hiddenProducts, setHiddenProducts] = useState<Product[]>(seedProducts.slice(5));
const [shopInfo] = useState<ShopInfo>({
  name: "eCentric Demo Store",
  id: "VN_SHOP_2401",
  region: "Vietnam",
  mode: "Demo / Mock API",
});
const [selectedProducts, setSelectedProducts] = useState<number[]>([1, 2]);
const [allSelected, setAllSelected] = useState<boolean>(false);
const [appliedProductIds, setAppliedProductIds] = useState<number[]>([1, 2]);
const [visibleProductId, setVisibleProductId] = useState<number | null>(null);
const [comments, setComments] = useState<CommentItem[]>(initialComments);
const [draftComment, setDraftComment] = useState<string>("");
const [logs, setLogs] = useState<LogItem[]>([]);
const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
const [scheduleStart, setScheduleStart] = useState<string>("");
const [scheduleEnd, setScheduleEnd] = useState<string>("");

  const parseScheduleValue = (value: string): Date | null => {
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

  const addLog = (action: string, detail: string) => {
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

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const toggleProduct = (id: number) => {
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

  const showProduct = (id: number) => {
    setVisibleProductId(id);
    const product = products.find((p) => p.id === id);
    addLog("Product shown", `${product?.name || `#${id}`} is now visible in livestream.`);
  };

  const removeProduct = (id?: number) => {
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
      demoAccounts={demoAccounts}
      logoSrc={eCentricLogo}
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
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            shopInfo={shopInfo}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            currentUser={currentUser}
            onLogout={handleLogout}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            logoSrc={eCentricLogo}
          />
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
