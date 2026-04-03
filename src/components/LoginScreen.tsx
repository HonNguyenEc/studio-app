import { LogIn, MoonStar, ShieldCheck, Sun } from "lucide-react";
import type { DemoAccount, LoginForm } from "../types";

type LoginScreenProps = {
  isLoggingIn: boolean;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  loginForm: LoginForm;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginForm>>;
  onLogin: () => void;
  loginError: string;
  demoAccounts: DemoAccount[];
  logoSrc: string;
};

export default function LoginScreen({
  isLoggingIn,
  darkMode,
  setDarkMode,
  loginForm,
  setLoginForm,
  onLogin,
  loginError,
  demoAccounts,
  logoSrc,
}: LoginScreenProps) {
  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-[radial-gradient(circle_at_top,_#121826,_#06080d_50%)] text-white"
          : "min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#eef2ff_55%)] text-slate-900"
      }
    >
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[28px] border p-8 shadow-2xl ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/85"}`}>
            <div className="mb-8 flex items-center gap-4">
              <img src={logoSrc} alt="eCentric logo" className="h-16 w-16 rounded-3xl bg-white p-1.5 shadow-sm" />
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

                <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className={`rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-lg ${
                    isLoggingIn ? "cursor-not-allowed bg-[#2C3DA6]/60" : "bg-[#2C3DA6] hover:opacity-95"
                }`}
                >
                {isLoggingIn ? "Logging in..." : "Login to Demo Portal"}
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
    </div>
  );
}