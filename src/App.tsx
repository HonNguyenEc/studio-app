import { loginWithDemoAccount } from "./services/authService";
import {
  createMockSession,
  generateMockStreamUrl,
  startMockStream,
  endMockStream,
} from "./services/livestreamService";
import {
  selectAllProducts,
  addMockProduct,
  applyProductSet,
} from "./services/productService";
import {
  createManualComment,
  getMockIncomingComment,
} from "./services/commentService";
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
  // UI state
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<{ email: string; password: string }>({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [loginError, setLoginError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<DemoAccount>(demoAccounts[0]);

  // Session state
  const [sessionState, setSessionState] = useState<SessionState>("draft");
  const [sessionLifecycleState, setSessionLifecycleState] = useState<SessionState>("draft");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [scheduleStart, setScheduleStart] = useState<string>("");
  const [scheduleEnd, setScheduleEnd] = useState<string>("");

  // Product state
  const [products, setProducts] = useState<Product[]>(seedProducts.slice(0, 5));
  const [hiddenProducts, setHiddenProducts] = useState<Product[]>(seedProducts.slice(5));
  const [selectedProducts, setSelectedProducts] = useState<number[]>([1, 2]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [appliedProductIds, setAppliedProductIds] = useState<number[]>([1, 2]);
  const [visibleProductId, setVisibleProductId] = useState<number | null>(null);

  // Comment and log state
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [draftComment, setDraftComment] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [logs, setLogs] = useState<LogItem[]>([]);

  // Static shop info
  const [shopInfo] = useState<ShopInfo>({
    name: "eCentric Demo Store",
    id: "VN_SHOP_2401",
    region: "Vietnam",
    mode: "Demo / Mock API",
  });

  // Schedule helpers
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

  // Auto-generate mock comments
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      getMockIncomingComment().then((comment) => {
        setComments((prev) => [...prev, comment]);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Session timer: auto-start and auto-end by schedule
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

    // Auth handlers
  const handleLogin = async () => {
  const matched = await loginWithDemoAccount(
    demoAccounts,
    loginForm.email,
    loginForm.password
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

  // Shared helpers
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

  // Session handlers
  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    addLog("Cover uploaded", `Loaded local file: ${file.name}`);
  };

  const onCreateSession = async () => {
  if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      return;
    }

    const result = await createMockSession(
      scheduleStart,
      scheduleEnd,
      sessionLifecycleState
    );

    setSessionState(result.nextState);
    setSessionLifecycleState(result.nextState);
    setVisibleProductId(null);
    setStreamUrl("");
    addLog(result.actionLabel, result.detail);
  };

  const onGenerateUrl = async () => {
    const url = await generateMockStreamUrl();
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

    const onStartStream = async () => {
    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      return;
    }

    const result = await startMockStream(scheduleStart);

    if (result.blocked) {
      addLog("Start blocked", result.detail);
      return;
    }

    if (result.nextState) {
      setSessionState(result.nextState);
      setSessionLifecycleState(result.nextState);
    }

    addLog("Stream started", result.detail);
  };

  const onEndStream = async () => {
    const result = await endMockStream();
    setSessionState(result.nextState);
    setSessionLifecycleState(result.nextState);
    addLog("Stream ended", result.detail);
  };

  // Product handlers
  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setAllSelected(next.length === products.length && products.length > 0);
      return next;
    });
  };

  const handleSelectAllProducts = async () => {
    if (allSelected) {
      setSelectedProducts([]);
      setAllSelected(false);
      addLog("Selection cleared", "All products were unselected.");
      return;
    }

    const allIds = await selectAllProducts(products);
    setSelectedProducts(allIds);
    setAllSelected(true);
    addLog("All products selected", `${allIds.length} product(s) selected.`);
  };

  const addProduct = async () => {
    const next = await addMockProduct(hiddenProducts);

    if (!next) {
      addLog("Add product skipped", "No more hidden mock products to add.");
      return;
    }

    setProducts((prev) => {
      const updated = [...prev, next];
      setAllSelected(selectedProducts.length === updated.length && updated.length > 0);
      return updated;
    });

    setHiddenProducts((prev) => prev.slice(1));
    addLog("Product added", `${next.name} added to demo product list.`);
  };

  const applySet = async () => {
    const applied = await applyProductSet(selectedProducts);
    setAppliedProductIds(applied);
    addLog("Product set applied", `${applied.length} product(s) added to current demo set.`);
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

  // Comment handlers
  const sendComment = async () => {
    if (!draftComment.trim()) return;

    const comment = await createManualComment(
      currentUser?.email?.split("@")[0] || "studio_operator",
      draftComment.trim()
    );

    setComments((prev) => [...prev, comment]);
    addLog("Comment sent", draftComment.trim());
    setDraftComment("");
  };

  const refreshComments = async () => {
    const comment = await getMockIncomingComment();
    setComments((prev) => [...prev, comment]);
    addLog("Comments refreshed", "Pulled 1 mock comment from demo source.");
  };

  // Derived data
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
