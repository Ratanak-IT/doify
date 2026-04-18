"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/lib/features/auth/authApi";
import { forgotPasswordSchema } from "@/lib/schemas";
import { CheckCircle2, ArrowRight, ArrowLeft, Mail, Shield, Clock, Check } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === "dark";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Invalid email"); return; }
    try {
      await forgotPassword({ email: result.data.email }).unwrap();
      setSent(true);
    } catch (err: unknown) {
      setError((err as { data?: { message?: string } })?.data?.message ?? "Failed to send reset email.");
    }
  };

  const fieldCls = `w-full h-[46px] px-4 rounded-[14px] border text-sm outline-none transition-all
    ${dark ? "bg-slate-800 text-white placeholder:text-slate-500 border-slate-700 focus:border-[#4f39f6]" : "bg-white text-slate-900 placeholder:text-slate-500 border-slate-200 focus:border-[#4f39f6]"}
    focus:ring-2 focus:ring-[#4f39f6]/10 ${error ? "border-red-400" : ""}`;

  return (
    <div className={`min-h-screen flex transition-colors ${dark ? "bg-slate-900" : "bg-slate-50"}`}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[58%] flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(131deg, #312c85 0%, #59168b 50%, #372aac 100%)" }}>
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 rounded-[14px] bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <span className="text-white text-2xl font-bold">Doify</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">Account</h1>
            <h1 className="text-5xl font-bold text-[#a3b3ff] leading-tight">recovery.</h1>
            <p className="text-[#c6d2ff] text-lg mt-4 max-w-md">No worries — we&apos;ll help you get back into your workspace in no time.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Mail size={20} />, title: "Check your inbox", desc: "We'll send a secure reset link to your email" },
              { icon: <Shield size={20} />, title: "Secure process", desc: "Reset links expire after 24 hours for security" },
              { icon: <Clock size={20} />, title: "Quick recovery", desc: "Get back to your workspace in under a minute" },
            ].map((f) => (
              <div key={f.title} className="mt-3 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                <div className="w-10 h-10 rounded-[14px] bg-[rgba(97,95,255,0.5)] flex items-center justify-center text-white shrink-0">{f.icon}</div>
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

      {/* Right panel */}
      <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 py-10 transition-colors ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
            <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <span className={`text-xl font-bold ${dark ? "text-white" : "text-slate-950"}`}>Doify</span>
          </div>

          {sent ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[rgba(5,223,114,0.1)] border border-[rgba(5,223,114,0.3)] flex items-center justify-center mx-auto">
                <Check size={28} className="text-[#05df72]" />
              </div>
              <div>
                <h2 className={`text-[30px] font-bold mb-2 ${dark ? "text-white" : "text-slate-950"}`}>Check your email</h2>
                <p className={`text-base ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  We sent a password reset link to{" "}
                  <span className={`font-semibold ${dark ? "text-white" : "text-slate-950"}`}>{email}</span>.
                  Check your inbox and follow the instructions.
                </p>
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#4f39f6] hover:underline font-semibold mt-2">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-8">
                <h2 className={`text-[30px] font-bold leading-9 ${dark ? "text-white" : "text-slate-950"}`}>Reset password</h2>
                <p className={`text-base ${dark ? "text-slate-400" : "text-slate-500"}`}>Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              {error && (
                <div className={`mb-5 p-3.5 rounded-[14px] border text-sm ${dark ? "bg-red-950/50 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-white" : "text-slate-950"}`}>Email address</label>
                  <input type="email" placeholder="you@company.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={fieldCls} />
                </div>
                <button type="submit" disabled={isLoading}
                  className="mt-3 w-full h-12 rounded-[14px] bg-[#4f39f6] text-white text-base font-semibold hover:bg-[#4530e0] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(79,57,246,0.4)]">
                  {isLoading
                    ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>
                    : <>Send reset link <ArrowRight size={16} /></>
                  }
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#4f39f6] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}