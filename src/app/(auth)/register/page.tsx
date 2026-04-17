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
import { authClient } from "@/lib/auth-client"; // your Better Auth client

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form | "gender" | "general", string>>;

/* ── Social button icons ── */
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

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200 dark:bg-[#1e2d45]" />
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or sign up with email</span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-[#1e2d45]" />
    </div>
  );
}

export default function RegisterPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<Form & { gender: string }>({
    fullName: "", username: "", email: "",
    password: "", confirmPassword: "", gender: "",
  });
  const [errors, setErrors]       = useState<Errors>({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

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
        ...(form.gender && { gender: form.gender }),
      }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Registration failed. Please try again.";
      setErrors({ general: msg });
    }
  };

  const handleSocial = async (provider: "google" | "github" | "facebook") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
    } catch {
      setSocialLoading(null);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    return [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  })();
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const fieldCls = (hasErr: boolean) =>
    `w-full h-[46px] px-4 rounded-xl border text-sm outline-none transition-all
     bg-slate-50 dark:bg-[#0f1a2e] text-slate-900 dark:text-white
     placeholder:text-slate-400 dark:placeholder:text-slate-600
     ${hasErr
       ? "border-red-400 dark:border-red-700"
       : "border-slate-200 dark:border-[#1e2d45] focus:border-[#4f39f6] dark:focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/15"
     }`;

  const socialBtnCls = "flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0f1a2e] text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#162035] transition-all disabled:opacity-50";

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
      {children}
    </label>
  );

  const features = [
    "Unlimited projects & tasks",
    "Up to 15 team members",
    "Real-time collaboration",
    "Advanced analytics",
    "Priority support",
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(129deg, #59168b 0%, #312c85 50%, #6e11b0 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 rounded-[14px] bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <span className="text-white text-2xl font-bold">Doify</span>
        </Link>

        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[rgba(97,95,255,0.3)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#05df72]" />
              <span className="text-[#c6d2ff] text-sm font-medium">Free 14-day trial · No credit card required</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">Start your</h1>
            <h1 className="text-5xl font-bold text-[#dab2ff] leading-tight">free trial today</h1>
          </div>
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

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#080f1a] px-6 py-10 transition-colors overflow-y-auto">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden group">
          <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] group-hover:bg-[#4530e0] flex items-center justify-center transition-colors">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <span className="text-slate-900 dark:text-white text-xl font-bold">Doify</span>
        </Link>

        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Set up your team workspace in minutes</p>
          </div>

          {/* ── Social buttons ── */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSocial("google")}
              disabled={!!socialLoading}
              className={socialBtnCls}
              aria-label="Sign up with Google"
            >
              {socialLoading === "google"
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <GoogleIcon />}
              <span>Google</span>
            </button>

            <button
              onClick={() => handleSocial("github")}
              disabled={!!socialLoading}
              className={socialBtnCls}
              aria-label="Sign up with GitHub"
            >
              {socialLoading === "github"
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <GithubIcon />}
              <span>GitHub</span>
            </button>

            <button
              onClick={() => handleSocial("facebook")}
              disabled={!!socialLoading}
              className={socialBtnCls}
              aria-label="Sign up with Facebook"
            >
              {socialLoading === "facebook"
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <FacebookIcon />}
              <span>Facebook</span>
            </button>
          </div>

          <Divider />

          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full name & Username */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full name</Label>
                <input placeholder="John Smith" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={fieldCls(!!errors.fullName)} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label>Username</Label>
                <input placeholder="johnsmith" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={fieldCls(!!errors.username)} />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>Work email</Label>
              <input type="email" placeholder="you@company.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldCls(!!errors.email)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Gender */}
            <div>
              <Label>
                Gender{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">(optional)</span>
              </Label>
              <select value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={fieldCls(false)}>
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${fieldCls(!!errors.password)} pr-12`} />
                <button type="button" onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : "bg-slate-200 dark:bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Strength: <span className="font-semibold">{strengthLabel}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm password</Label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`${fieldCls(!!errors.confirmPassword)} pr-12`} />
                <button type="button" onClick={() => setConfirm((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <input type="checkbox" id="terms" required
                className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 accent-[#4f39f6] cursor-pointer shrink-0" />
              <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer leading-snug">
                I agree to the{" "}
                <Link href="#" className="text-[#4f39f6] hover:underline font-medium">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-[#4f39f6] hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading || !!socialLoading}
              className="w-full h-12 rounded-xl bg-[#4f39f6] hover:bg-[#4530e0] text-white font-semibold text-base transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(79,57,246,0.4)]">
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>Create free account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4f39f6] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}