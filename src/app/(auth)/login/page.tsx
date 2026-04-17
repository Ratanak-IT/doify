"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { loginSchema } from "@/lib/schemas";
import { Eye, EyeOff, Zap, Users, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";

type Form = z.infer<typeof loginSchema>;

/* ── Icons ── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#1877F2]" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200 dark:bg-[#1e2d45]" />
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or continue with email</span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-[#1e2d45]" />
    </div>
  );
}

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm]     = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "general", string>>>({});
  const [showPwd, setShow]  = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | "facebook" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    try {
      const res = await login(result.data).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Invalid email or password.";
      setErrors({ general: msg });
    }
  };

  const handleSocial = async (provider: "google" | "github" | "facebook") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? `Failed to sign in with ${provider}.`;
      setErrors({ general: msg });
      setSocialLoading(null);
    }
  };

  const fieldCls = (hasErr: boolean) =>
    `w-full h-[46px] px-4 rounded-xl border text-sm outline-none transition-all
     bg-slate-50 dark:bg-[#0f1a2e] text-slate-900 dark:text-white
     placeholder:text-slate-400 dark:placeholder:text-slate-600
     ${hasErr
       ? "border-red-400 dark:border-red-700"
       : "border-slate-200 dark:border-[#1e2d45] focus:border-[#4f39f6] dark:focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/15"
     }`;

  const socialBtnCls =
    "flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0f1a2e] text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#162035] transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const isBusy = isLoading || !!socialLoading;

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[58%] flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(131deg, #312c85 0%, #59168b 50%, #372aac 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 rounded-[14px] bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <span className="text-white text-2xl font-bold">Doify</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">Manage tasks</h1>
            <h1 className="text-5xl font-bold text-[#a3b3ff] leading-tight">smarter.</h1>
            <p className="text-[#c6d2ff] text-lg mt-4 max-w-md">
              The all-in-one platform for teams to plan, track, and deliver outstanding work.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Zap size={20} />, title: "Lightning Fast", desc: "Manage tasks with speed and precision" },
              { icon: <Users size={20} />, title: "Team Collaboration", desc: "Work seamlessly with your entire team" },
              { icon: <BarChart3 size={20} />, title: "Smart Analytics", desc: "Insights to keep projects on track" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                <div className="w-10 h-10 rounded-[14px] bg-[rgba(97,95,255,0.5)] flex items-center justify-center text-white shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-[#c6d2ff] text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {[{ val: "10K+", label: "Teams" }, { val: "50K+", label: "Tasks Daily" }, { val: "99.9%", label: "Uptime" }].map((s) => (
            <div key={s.label}>
              <p className="text-white text-2xl font-bold">{s.val}</p>
              <p className="text-[#a3b3ff] text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#080f1a] px-6 py-10 transition-colors">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden group">
          <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] group-hover:bg-[#4530e0] flex items-center justify-center transition-colors">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <span className="text-slate-900 dark:text-white text-xl font-bold">Doify</span>
        </Link>

        <div className="w-full max-w-[400px]">

          <div className="mb-7">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to continue to your workspace</p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            {(["google", "github", "facebook"] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => handleSocial(provider)}
                disabled={isBusy}
                className={socialBtnCls}
                aria-label={`Sign in with ${provider}`}
              >
                {socialLoading === provider ? <Spinner /> : (
                  provider === "google" ? <GoogleIcon /> :
                  provider === "github" ? <GithubIcon /> :
                  <FacebookIcon />
                )}
                <span className="capitalize">{provider}</span>
              </button>
            ))}
          </div>

          <Divider />

          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldCls(!!errors.email)}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#4f39f6] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${fieldCls(!!errors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full h-12 rounded-xl bg-[#4f39f6] hover:bg-[#4530e0] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(79,57,246,0.4)]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#4f39f6] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}