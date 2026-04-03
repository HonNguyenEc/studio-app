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
import Toast from "./components/Toast";

export default function App() {
  // UI state
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  
  // Loading and error state
  const [appError, setAppError] = useState<string>("");
  const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error" | "info";
} | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState<boolean>(false);
  const [isStartingStream, setIsStartingStream] = useState<boolean>(false);
  const [isEndingStream, setIsEndingStream] = useState<boolean>(false);

  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [isApplyingSet, setIsApplyingSet] = useState<boolean>(false);

  const [isRefreshingComments, setIsRefreshingComments] = useState<boolean>(false);
  const [isSendingComment, setIsSendingComment] = useState<boolean>(false);

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
      getMockIncomingComment()
        .then((comment) => {
          setComments((prev) => [...prev, comment]);
        })
        .catch(() => {
          setAppError("Failed to auto-refresh comments.");
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

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

    // Auth handlers
  const handleLogin = async () => {
    setAppError("");
    setLoginError("");
    setIsLoggingIn(true);

    try {
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
      showToast("Login successful.", "success");
    } catch (error) {
      setAppError("Login failed. Please try again.");
      showToast("Login failed.", "error");
    } finally {
      setIsLoggingIn(false);
    }
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
  
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
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
    setAppError("");

    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      setAppError("End time must be later than Start time.");
      return;
    }

    setIsCreatingSession(true);

    try {
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
      showToast(result.actionLabel, "success");
    } catch (error) {
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
      const url = await generateMockStreamUrl();
      setStreamUrl(url);
      addLog("Stream URL generated", url);
      showToast("Stream URL generated.", "success");
    } catch (error) {
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
      addLog("Stream URL copied", "Copied stream URL to clipboard.");
      showToast("Stream URL copied.", "success");
    } catch (error) {
      addLog("Copy failed", "Clipboard permission is unavailable in this environment.");
      setAppError("Failed to copy stream URL.");
      showToast("Copy failed.", "error");
    }
  };

  const onStartStream = async () => {
    setAppError("");

    if (isScheduleRangeInvalid) {
      addLog("Invalid schedule", "End time must be later than Start time.");
      setAppError("End time must be later than Start time.");
      return;
    }

    setIsStartingStream(true);

    try {
      const result = await startMockStream(scheduleStart);

      if (result.blocked) {
        addLog("Start blocked", result.detail);
        setAppError(result.detail);
        return;
      }

      if (result.nextState) {
        setSessionState(result.nextState);
        setSessionLifecycleState(result.nextState);
      }

      addLog("Stream started", result.detail);
      showToast("Stream started.", "success");
    } catch (error) {
      setAppError("Failed to start stream.");
    } finally {
      setIsStartingStream(false);
    }
  };

  const onEndStream = async () => {
    setAppError("");
    setIsEndingStream(true);

    try {
      const result = await endMockStream();
      setSessionState(result.nextState);
      setSessionLifecycleState(result.nextState);
      addLog("Stream ended", result.detail);
      showToast("Stream ended.", "success");
    } catch (error) {
      setAppError("Failed to end stream.");
    } finally {
      setIsEndingStream(false);
    }
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
    setAppError("");
    setIsAddingProduct(true);

    try {
      const next = await addMockProduct(hiddenProducts);

      if (!next) {
        addLog("Add product skipped", "No more hidden mock products to add.");
        setAppError("No more hidden mock products to add.");
        return;
      }

      setProducts((prev) => {
        const updated = [...prev, next];
        setAllSelected(selectedProducts.length === updated.length && updated.length > 0);
        return updated;
      });

      setHiddenProducts((prev) => prev.slice(1));
      addLog("Product added", `${next.name} added to demo product list.`);
      showToast(`${next.name} added.`, "success");
    } catch (error) {
      setAppError("Failed to add product.");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const applySet = async () => {
    setAppError("");
    setIsApplyingSet(true);

    try {
      const applied = await applyProductSet(selectedProducts);
      setAppliedProductIds(applied);
      addLog("Product set applied", `${applied.length} product(s) added to current demo set.`);
      showToast("Product set applied.", "success");
    } catch (error) {
      setAppError("Failed to apply product set.");
    } finally {
      setIsApplyingSet(false);
    }
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

    setAppError("");
    setIsSendingComment(true);

    try {
      const comment = await createManualComment(
        currentUser?.email?.split("@")[0] || "studio_operator",
        draftComment.trim()
      );

      setComments((prev) => [...prev, comment]);
      addLog("Comment sent", draftComment.trim());
      showToast("Comment sent.", "success");
      setDraftComment("");
    } catch (error) {
      setAppError("Failed to send comment.");
    } finally {
      setIsSendingComment(false);
    }
  };

  const refreshComments = async () => {
    setAppError("");
    setIsRefreshingComments(true);

    try {
      const comment = await getMockIncomingComment();
      setComments((prev) => [...prev, comment]);
      addLog("Comments refreshed", "Pulled 1 mock comment from demo source.");
      showToast("Comments refreshed.", "info");
    } catch (error) {
      setAppError("Failed to refresh comments.");
    } finally {
      setIsRefreshingComments(false);
    }
  };

  // Derived data
  const selectedProductObjects = useMemo(
    () => products.filter((p) => selectedProducts.includes(p.id)),
    [products, selectedProducts]
  );

    if (!isAuthenticated) {
    return (
      <LoginScreen
        isLoggingIn={isLoggingIn}
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
          > {toast ? (
              <div className="fixed right-4 top-4 z-50 w-[320px]">
                <Toast message={toast.message} type={toast.type} />
              </div>
            ) : null}
            {appError ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  darkMode
                    ? "border-red-400/20 bg-red-400/10 text-red-200"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {appError}
              </div>
            ) : null}
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
                isCreatingSession={isCreatingSession}
                isGeneratingUrl={isGeneratingUrl}
                isStartingStream={isStartingStream}
                isEndingStream={isEndingStream}
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
                isAddingProduct={isAddingProduct}
                isApplyingSet={isApplyingSet}
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
                isRefreshingComments={isRefreshingComments}
                isSendingComment={isSendingComment}
              />
            )}
          </motion.main>
        </div>
      </div>
    </AppShell>
  );
}
