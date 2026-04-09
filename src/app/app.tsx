import { useState } from "react";
import AppShell from "../components/AppShell";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { AuthRoute } from "../common/route/auth.route";
import { IndexRoute } from "../common/route/index.route";
import { useFeedbackHook } from "../common/hook/use-feedback.hook";
import { useAuthHook } from "../modules/auth-page/hook/use-auth.hook";
import { useSessionLifecycleHook } from "../modules/studio-page/hook/use-session-lifecycle.hook";
import { useProductManagerHook } from "../modules/product-page/hook/use-product-manager.hook";
import { useCommentManagerHook } from "../modules/comment-page/hook/use-comment-manager.hook";
import {
  demoAccounts,
  eCentricLogo,
  initialCommentsByPlatform,
  seedProducts,
} from "../common/constant/mock-data.constant";
import { shopInfoByPlatform } from "../common/constant/shop-info.constant";
import { managementPlatformOptions } from "../common/constant/management-platform.constant";
import type { ActiveTab, ManagementPlatform } from "../common/type/app.type";
import {
  buildCommentRouteProps,
  buildProductRouteProps,
  buildReportRouteProps,
  buildStudioRouteProps,
} from "./util/build-route-props.util";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [managementPlatform, setManagementPlatform] = useState<ManagementPlatform>("Shopee");
  const shopInfo = shopInfoByPlatform[managementPlatform];

  const { appError, setAppError, toast, logs, addLog, showToast } = useFeedbackHook();

  const auth = useAuthHook({
    demoAccounts,
    showToast,
    setAppError,
  });

  const product = useProductManagerHook({
    seedProducts,
    addLog,
    showToast,
    setAppError,
  });

  const session = useSessionLifecycleHook({
    managementPlatform,
    addLog,
    showToast,
    setAppError,
  });

  const comment = useCommentManagerHook({
    initialComments: initialCommentsByPlatform[managementPlatform],
    managementPlatform,
    currentUserEmail: auth.currentUser.email,
    addLog,
    showToast,
    setAppError,
  });

  const handleLogout = () => {
    auth.handleLogout();
    setActiveTab("overview");
  };

  const studioProps = buildStudioRouteProps({
    darkMode,
    session,
    product,
    logs,
    shopInfo,
    currentUser: auth.currentUser,
    managementPlatform,
  });

  const productProps = buildProductRouteProps({
    darkMode,
    product,
  });

  const commentProps = buildCommentRouteProps({
    darkMode,
    comment,
    currentUser: auth.currentUser,
    managementPlatform,
  });

  const reportProps = buildReportRouteProps(darkMode);

  if (!auth.isAuthenticated) {
    return (
      <AuthRoute
        isLoggingIn={auth.isLoggingIn}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        loginForm={auth.loginForm}
        setLoginForm={auth.setLoginForm}
        onLogin={auth.handleLogin}
        loginError={auth.loginError}
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
            managementPlatform={managementPlatform}
            managementPlatformOptions={managementPlatformOptions}
            setManagementPlatform={setManagementPlatform}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            currentUser={auth.currentUser}
            onLogout={handleLogout}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            logoSrc={eCentricLogo}
          />
          <main className="space-y-6">
            {toast ? (
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

            <IndexRoute
              activeTab={activeTab}
              studioProps={studioProps}
              productProps={productProps}
              commentProps={commentProps}
              reportProps={reportProps}
            />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
