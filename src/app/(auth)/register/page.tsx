"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { registerSchema } from "@/lib/schemas";
import type { z } from "zod";
import { Eye, EyeOff, CheckCircle2, ArrowRight, Zap, Users, BarChart3 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/lib/contexts/ThemeContext";

type Form = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof Form | "gender" | "general", string>>;

const OAUTH_ERRORS: Record<string, string> = {
  oauth_cancelled: "Sign-up was cancelled. Please try again.",
  token_exchange_failed: "Could not connect to the provider. Please try again.",
  no_email:
    "Your account has no public email. Please use email/password registration.",
  backend_rejected: "Account could not be authenticated. Please try again.",
  server_error: "An unexpected error occurred. Please try again.",
};

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

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// Build the provider authorization URL — browser redirects directly to provider
function getOAuthUrl(provider: "google" | "github" | "facebook"): string {
  const appUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000";
  const redirectUri = encodeURIComponent(
    `${appUrl}/api/auth/callback/${provider}`,
  );

  if (provider === "google") {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent("openid email profile")}&access_type=offline`;
  }
  if (provider === "github") {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent("read:user user:email")}`;
  }
  // facebook
  const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID ?? "";
  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent("email,public_profile")}&response_type=code`;
}

export default function RegisterPage() {
  const router   = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === "dark";

  const [form, setForm] = useState<Form & { gender: string }>({
    fullName: "", username: "", email: "", password: "", confirmPassword: "", gender: "",
  });
  const [errors, setErrors]       = useState<Errors>({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Pick up ?error= set by the callback route on failure
  useEffect(() => {
    const err = searchParams.get("error");
    if (err)
      setErrors({
        general: OAUTH_ERRORS[err] ?? "Sign-up failed. Please try again.",
      });
  }, [searchParams]);

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
        fullName: result.data.fullName, username: result.data.username,
        email: result.data.email, password: result.data.password,
        ...(form.gender && { gender: form.gender }),
      }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Registration failed. Please try again.";
      setErrors({ general: msg });
    }
  };

  const handleSocial = (provider: "google" | "github" | "facebook") => {
    setSocialLoading(provider);
    window.location.href = getOAuthUrl(provider);
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
     ${dark ? "bg-slate-800 text-white placeholder:text-slate-500" : "bg-slate-50 text-slate-900 placeholder:text-slate-400"}
     ${hasErr
       ? "border-red-400"
       : `${dark ? "border-slate-700" : "border-slate-200"} focus:border-[#4f39f6] focus:ring-2 focus:ring-[#4f39f6]/15`
     }`;

  const socialBtnCls =
    `flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
     ${dark ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`;

  const isBusy = isLoading || !!socialLoading;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className={`block text-sm font-semibold mb-1.5 ${dark ? "text-white" : "text-slate-700"}`}>{children}</label>
  );

  return (
    <div className={`min-h-screen flex transition-colors ${dark ? "bg-slate-900" : "bg-white"}`}>

      {/* Left branding panel */}
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
            <div className="inline-flex items-center gap-2 bg-[rgba(97,95,255,0.3)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#05df72]" />
              <span className="text-[#c6d2ff] text-sm font-medium">Free 14-day trial · No credit card required</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">Start your</h1>
            <h1 className="text-5xl font-bold text-[#a3b3ff] leading-tight">free trial today</h1>
            <p className="text-[#c6d2ff] text-lg mt-4 max-w-md">Everything your team needs to plan, collaborate, and ship great work.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Zap size={20} />, title: "Unlimited Projects & Tasks", desc: "No caps — scale as your team grows" },
              { icon: <Users size={20} />, title: "Real-time Collaboration", desc: "Work seamlessly with up to 15 members" },
              { icon: <BarChart3 size={20} />, title: "Advanced Analytics", desc: "Insights to keep every project on track" },
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

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["bg-indigo-500", "bg-pink-500", "bg-amber-500", "bg-green-500"].map((c, i) => (
              <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#312c85]`} />
            ))}
          </div>
          <p className="text-sm"><span className="text-white font-semibold">2,400+</span><span className="text-[#c6d2ff]"> teams started this month</span></p>
        </div>
      </div>

      {/* Right form panel */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-10 transition-colors overflow-y-auto ${dark ? "bg-slate-900" : "bg-white"}`}>

        <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden group">
          <div className="w-10 h-10 rounded-[14px] bg-[#4f39f6] group-hover:bg-[#4530e0] flex items-center justify-center transition-colors">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <span className={`text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Doify</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="mb-7">
            <h2 className={`text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Create account</h2>
            <p className={`mt-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>Set up your team workspace in minutes</p>
          </div>

          {errors.general && (
            <div className={`mb-5 p-3.5 rounded-xl border text-sm ${dark ? "bg-red-950/50 border-red-800/50 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <Label>Full name</Label>
                <input placeholder="John Smith" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={fieldCls(!!errors.fullName)} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div className="mb-3">
                <Label>Username</Label>
                <input placeholder="johnsmith" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={fieldCls(!!errors.username)} />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              </div>
            </div>

            <div className="mb-3">
              <Label>Work email</Label>
              <input type="email" placeholder="you@company.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldCls(!!errors.email)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-3">
              <Label>Gender <span className={`font-normal text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>(optional)</span></Label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={fieldCls(false)}>
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <Label>Password</Label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${fieldCls(!!errors.password)} pr-12`} />
                <button type="button" onClick={() => setShowPwd((s) => !s)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : dark ? "bg-white/10" : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Strength: <span className="font-semibold">{strengthLabel}</span></p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="mb-3">
              <Label>Confirm password</Label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`${fieldCls(!!errors.confirmPassword)} pr-12`} />
                <button type="button" onClick={() => setConfirm((s) => !s)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}>
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="mb-1.5 flex items-start gap-2.5 pt-1">
              <input type="checkbox" id="terms" required
                className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-[#4f39f6] cursor-pointer shrink-0" />
              <label htmlFor="terms" className={`text-sm cursor-pointer leading-snug ${dark ? "text-slate-400" : "text-slate-500"}`}>
                I agree to the{" "}
                <Link href="#" className="text-[#4f39f6] hover:underline font-medium">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-[#4f39f6] hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isBusy}
              className="w-full h-12 rounded-xl bg-[#4f39f6] hover:bg-[#4530e0] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(79,57,246,0.4)]">
              {isLoading ? (<><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</>) : (<>Create free account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
            <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-400"}`}>or sign up with email</span>
            <div className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
          </div>

          <div className="flex gap-3">
            {(["google", "github", "facebook"] as const).map((provider) => (
              <button key={provider} onClick={() => handleSocial(provider)} disabled={isBusy} className={socialBtnCls} aria-label={`Sign up with ${provider}`}>
                {socialLoading === provider ? <Spinner /> : provider === "google" ? <GoogleIcon /> : provider === "github" ? <GithubIcon /> : <FacebookIcon />}
                <span className="capitalize">{provider}</span>
              </button>
            ))}
          </div>

          <p className={`text-center text-sm mt-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#4f39f6] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}