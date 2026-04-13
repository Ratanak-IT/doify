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

type Form = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm]     = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "general", string>>>({});
  const [showPwd, setShow]  = useState(false);

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

  return (
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-12"
             style={{ background: "linear-gradient(131deg, #312c85 0%, #59168b 50%, #372aac 100%)" }}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold">Doify</span>
          </div>

          {/* Hero */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">Manage tasks</h1>
              <h1 className="text-5xl font-bold text-[#a3b3ff] leading-tight">smarter.</h1>
              <p className="text-[#c6d2ff] text-lg mt-4 max-w-md">
                The all-in-one platform for teams to plan, track, and deliver outstanding work.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
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

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { val: "10K+", label: "Teams" },
              { val: "50K+", label: "Tasks Daily" },
              { val: "99.9%", label: "Uptime" },
            ].map((s) => (
                <div key={s.label}>
                  <p className="text-white text-2xl font-bold">{s.val}</p>
                  <p className="text-[#a3b3ff] text-sm">{s.label}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-10 sm:py-12">
          <div className="w-full max-w-[400px]">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
              <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span className="text-slate-950 dark:text-white text-xl font-bold">Doify</span>
            </div>

            <div className="space-y-2 mb-8">
              <h2 className="text-[30px] font-bold text-slate-950 dark:text-white leading-9">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">Sign in to continue to your workspace</p>
            </div>

            {errors.general && (
                <div className="mb-5 p-3.5 rounded-[14px] bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Email address</label>
                <input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full h-[46px] px-4 rounded-[14px] border text-sm outline-none transition-all bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.email ? "border-red-400 bg-red-50 dark:bg-red-950" : "border-slate-200 dark:border-slate-700 focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/10"
                    }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-950 dark:text-white">Password</label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#4f39f6] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                      type={showPwd ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full h-[46px] px-4 pr-12 rounded-[14px] border text-sm outline-none transition-all bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.password ? "border-red-400 bg-red-50 dark:bg-red-950" : "border-slate-200 dark:border-slate-700 focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/10"
                      }`}
                  />
                  <button type="button" onClick={() => setShow((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-[14px] bg-[#4f39f6] text-white text-base font-semibold hover:bg-[#4530e0] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0px_10px_15px_0px_#c6d2ff,0px_4px_6px_0px_#c6d2ff] dark:shadow-[0px_10px_15px_0px_rgba(79,57,246,0.5),0px_4px_6px_0px_rgba(79,57,246,0.3)]"
              >
                {isLoading
                    ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
                    : <>Sign in <ArrowRight size={16} /></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#4f39f6] font-semibold hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>
  );
}