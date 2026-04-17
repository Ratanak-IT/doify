"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCredentials, updateUser } from "@/lib/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  type UpdateProfilePayload,
} from "@/lib/features/profile/profileApi";
import { Eye, EyeOff, Loader, Check, User, Lock, ChevronRight, Shield } from "lucide-react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";
import AvatarUpload from "@/components/avatar/AvatarUpload";

const GENDER_ENUM = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;
type GenderEnum = (typeof GENDER_ENUM)[number];

function isValidGender(val: string): val is GenderEnum {
  return GENDER_ENUM.includes(val as GenderEnum);
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<"profile" | "password">("profile");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    gender: "",
    profilePhoto: "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? "",
        username: profile.username ?? "",
        email: profile.email ?? "",
        gender: profile.gender ?? "",
        profilePhoto: profile.profilePhoto ?? "",
      });
    }
  }, [profile]);

  const handleAvatarUpload = (url: string) => {
    setForm((prev) => ({ ...prev, profilePhoto: url }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrors([]);
    try {
      if (!profile) {
        setErrors(["Profile not loaded yet. Please wait and try again."]);
        return;
      }

      const hasChanges =
        form.fullName !== (profile.fullName ?? "") ||
        form.username !== (profile.username ?? "") ||
        form.email !== (profile.email ?? "") ||
        form.gender !== (profile.gender ?? "") ||
        form.profilePhoto !== (profile.profilePhoto ?? "");

      if (!hasChanges) {
        setErrors(["No changes detected."]);
        return;
      }

      const validation = updateProfileSchema.safeParse({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        gender: form.gender || undefined,
      });

      if (!validation.success) {
        setErrors(validation.error.issues.map((i) => i.message));
        return;
      }

      const payload: UpdateProfilePayload = {
        fullName: form.fullName,
        profilePhoto: form.profilePhoto || undefined,
        ...(form.username !== profile.username && { username: form.username }),
        ...(form.email !== profile.email && { email: form.email }),
        ...(isValidGender(form.gender) && { gender: form.gender }),
      };

      const updated = await updateProfile(payload).unwrap();

      if (user && token) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              name: updated.fullName,
              email: updated.email,
              avatar: updated.profilePhoto ?? form.profilePhoto,
            },
            token,
          })
        );
      }
      dispatch(updateUser({ name: updated.fullName, email: updated.email }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrors([err?.data?.message ?? err?.message ?? "Failed to save profile."]);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setErrors([]);
    try {
      const result = changePasswordSchema.safeParse(pwdForm);
      if (!result.success) {
        setErrors(result.error.issues.map((i) => i.message));
        return;
      }

      await changePassword({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      }).unwrap();

      setShowPassword(false);
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password changed successfully!");
    } catch (err: any) {
      alert(err?.data?.message ?? "Failed to change password.");
    }
  };
 
  const info=[
                      { id: "fullName", label: "Full Name", type: "text", key: "fullName" },
                      { id: "username", label: "Username", type: "text", key: "username" },
                      { id: "email", label: "Email Address", type: "email", key: "email" },
                    ];
  const genderOptions = [
    { value: "", label: "Not specified" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  ];

  const navItems = [
    { id: "profile" as const, label: "Profile", icon: User, desc: "Personal info & avatar" },
    { id: "password" as const, label: "Security", icon: Shield, desc: "Password & access" },
  ];

  const changePass=[
                        { key: "currentPassword", label: "Current Password" },
                        { key: "newPassword", label: "New Password" },
                        { key: "confirmPassword", label: "Confirm Password" },
                      ];

  return (
    <>
      <DashboardHeader showCreate={false} />

      {/* pb-20 on mobile to avoid content hiding behind bottom tab bar */}
      <div className="flex-1 min-h-screen bg-[#F8F9FC] dark:bg-[#1E1B2E] pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          {/* Page heading */}
          <div className="mb-5">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-lg">
              Account
            </span>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
              Profile
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation — desktop only */}
            <aside className="hidden md:block w-60 shrink-0">
              <nav className="space-y-1">
                {navItems.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveSection(id);
                      setErrors([]);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all
                      ${activeSection === id
                        ? "bg-gray-300 text-black"
                        : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                      }`}
                  >
                    <div className={`p-2 rounded-xl ${activeSection === id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-800"}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg">{label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{desc}</div>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${activeSection === id ? "translate-x-1" : "opacity-40"}`} />
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">

              {/* PROFILE SECTION */}
              {activeSection === "profile" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <div className="flex items-center gap-6 mb-10">
                    <div className="ring-2 ring-blue-200 dark:ring-blue-900 rounded-full p-1">
                      <AvatarUpload
                        currentUrl={form.profilePhoto}
                        displayName={form.fullName}
                        onUpload={handleAvatarUpload}
                        disabled={saving}
                        size={88}
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {form.fullName || "Your Name"}
                      </h2>
                      {form.username && <p className="text-slate-500 dark:text-slate-400">@{form.username}</p>}
                      {isValidGender(form.gender) && (
                        <span className="inline-block mt-2 px-4 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                          {genderOptions.find((o) => o.value === form.gender)?.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-8" />

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {info.map(({ id, label, type, key }) => (
                      <div key={id}>
                        <label htmlFor={id} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          {label}
                        </label>
                        <input
                          id={id}
                          type={type}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full px-4 py-3 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="gender" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 tracking-wide">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-4 py-3 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {genderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {profile?.createdAt && (
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          Member Since
                        </label>
                        <div className="w-full px-4 py-3 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">
                          {new Date(profile.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.length > 0 && (
                    <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                      {errors.map((e, i) => (
                        <p key={i} className="flex items-start gap-2">✕ {e}</p>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || profileLoading}
                    className={`mt-5 px-3 py-3 text-sm font-bold rounded-[12px] flex items-center gap-2
                      ${saveSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      } disabled:opacity-70`}
                  >
                    {saving ? (
                      <><Loader size={18} className="animate-spin" /> Saving...</>
                    ) : saveSuccess ? (
                      <><Check size={18} /> Saved Successfully</>
                    ) : (
                      <><Check size={18} /> Save Changes</>
                    )}
                  </button>
                  </div>
                </div>
              )}

              {/* PASSWORD SECTION */}
              {activeSection === "password" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
                      <Lock size={20} />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Security</h2>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Keep your account secure with a strong password.</p>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-8" />

                  {!showPassword ? (
                    <button
                      onClick={() => setShowPassword(true)}
                      className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Lock size={18} /> Change Password
                    </button>
                  ) : (
                    <div className="max-w-md space-y-6">
                      {changePass.map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                            {label}
                          </label>
                          <div className="relative">
                            <input
                              type={show[key as keyof typeof show] ? "text" : "password"}
                              value={pwdForm[key as keyof typeof pwdForm]}
                              onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })}
                              className="w-full px-4 py-3 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShow((prev) => ({ ...prev, [key]: !prev[key as keyof typeof show] }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                              {show[key as keyof typeof show] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      ))}

                      {errors.length > 0 && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                          {errors.map((e, i) => <p key={i}>✕ {e}</p>)}
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 justify-end">
                        <button
                          onClick={handlePasswordSave}
                          className=" px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[12px] text-[14px] font-bold flex items-center justify-center gap-2"
                        >
                          <Lock size={18} /> Update
                        </button>
                        <button
                          onClick={() => {
                            setShowPassword(false);
                            setErrors([]);
                            setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                          }}
                          className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-[12px] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar — hidden on md+ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex safe-area-pb">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSection(id);
              setErrors([]);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors
              ${activeSection === id
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-500"
              }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeSection === id ? "bg-blue-50 dark:bg-blue-950" : ""}`}>
              <Icon size={20} />
            </div>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}