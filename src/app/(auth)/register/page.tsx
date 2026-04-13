"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { registerSchema } from "@/lib/schemas";
import type { z } from "zod";
import { Eye, EyeOff, CheckCircle2, ArrowRight, Check } from "lucide-react";

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form | "general", string>>;

export default function RegisterPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<Form>({
    fullName: "", username: "", email: "",
    password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fe: Errors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    try {
      const res = await register({
        fullName: result.data.fullName,
        username: result.data.username,
        email: result.data.email,
        password: result.data.password,
      }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Registration failed. Please try again.";
      setErrors({ general: msg });
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    return [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  })();

  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const inputCls = (key: keyof Form) =>
      `w-full h-[46px] px-4 rounded-[14px] border text-sm outline-none transition-all bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
          errors[key] ? "border-red-400 bg-red-50 dark:bg-red-950" : "border-slate-200 dark:border-slate-700 focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/10"
      }`;

  const features = [
    "Unlimited projects & tasks",
    "Up to 15 team members",
    "Real-time collaboration",
    "Advanced analytics",
    "Priority support",
  ];

  return (
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
             style={{ background: "linear-gradient(129deg, #59168b 0%, #312c85 50%, #6e11b0 100%)" }}>
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
              <div className="inline-flex items-center gap-2 bg-[rgba(97,95,255,0.3)] rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#05df72] opacity-50" />
                <span className="text-[#c6d2ff] text-sm font-medium">Free 14-day trial · No credit card required</span>
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight">Start your</h1>
              <h1 className="text-5xl font-bold text-[#dab2ff] leading-tight">free trial today</h1>
            </div>

            {/* Features Card */}
            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 space-y-4">
              <p className="text-white text-sm font-semibold tracking-wider uppercase">Everything included</p>
              <div className="space-y-3">
                {features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(5,223,114,0.2)] border border-[rgba(5,223,114,0.5)] flex items-center justify-center shrink-0">
                        <Check size={12} className="text-[#05df72]" />
                      </div>
                      <span className="text-[#f3e8ff] text-sm">{f}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-indigo-500", "bg-pink-500", "bg-amber-500", "bg-green-500"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#59168b]`} />
              ))}
            </div>
            <p className="text-sm">
              <span className="text-white font-semibold">2,400+</span>
              <span className="text-[#e9d4ff]"> teams started this month</span>
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
              <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span className="text-slate-950 dark:text-white text-xl font-bold">Doify</span>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-[30px] font-bold text-slate-950 dark:text-white leading-9">Create account</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">Set up your team workspace in minutes</p>
            </div>

            {errors.general && (
                <div className="mb-4 p-3.5 rounded-[14px] bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Full name</label>
                  <input placeholder="John Smith" value={form.fullName}
                         onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                         className={inputCls("fullName")} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Username</label>
                  <input placeholder="johnsmith" value={form.username}
                         onChange={(e) => setForm({ ...form, username: e.target.value })}
                         className={inputCls("username")} />
                  {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Work email</label>
                <input type="email" placeholder="you@company.com" value={form.email}
                       onChange={(e) => setForm({ ...form, email: e.target.value })}
                       className={inputCls("email")} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="Min. 8 characters"
                         value={form.password}
                         onChange={(e) => setForm({ ...form, password: e.target.value })}
                         className={`${inputCls("password")} pr-12`} />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[0,1,2,3].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : "bg-black/5"}`}/>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Strength: <span className="font-medium">{strengthLabel}</span></p>
                    </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Confirm password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                         value={form.confirmPassword}
                         onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                         className={`${inputCls("confirmPassword")} pr-12`} />
                  <button type="button" onClick={() => setConfirm((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <input type="checkbox" id="terms" required
                       className="w-4 h-4 mt-0.5 rounded border-slate-200 dark:border-slate-700 accent-[#4f39f6] cursor-pointer"/>
                <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none leading-snug font-medium">
                  I agree to the{" "}
                  <Link href="#" className="text-[#4f39f6] hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#4f39f6] hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" disabled={isLoading}
                      className="w-full h-12 rounded-[14px] bg-[#4f39f6] text-white text-base font-semibold hover:bg-[#4530e0] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0px_10px_15px_0px_#c6d2ff,0px_4px_6px_0px_#c6d2ff] dark:shadow-[0px_10px_15px_0px_rgba(79,57,246,0.5),0px_4px_6px_0px_rgba(79,57,246,0.3)]">
                {isLoading
                    ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>
                    : <>Create free account <ArrowRight size={16} /></>
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4f39f6] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
  );
}