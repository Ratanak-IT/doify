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
import { Eye, EyeOff, Loader, Check } from "lucide-react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";
import AvatarUpload from "@/components/avatar/AvatarUpload";

const GENDER_ENUM = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;
type GenderEnum = typeof GENDER_ENUM[number];

function isValidGender(val: string): val is GenderEnum {
  return GENDER_ENUM.includes(val as GenderEnum);
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user  = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile]  = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [saving,       setSaving]       = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName:     "",
    username:     "",
    email:        "",
    gender:       "",
    profilePhoto: "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword:     false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName:     profile.fullName     ?? "",
        username:     profile.username     ?? "",
        email:        profile.email        ?? "",
        gender:       profile.gender       ?? "",
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
        form.fullName     !== (profile.fullName     ?? "") ||
        form.username     !== (profile.username     ?? "") ||
        form.email        !== (profile.email        ?? "") ||
        form.gender       !== (profile.gender       ?? "") ||
        form.profilePhoto !== (profile.profilePhoto ?? "");

      if (!hasChanges) {
        setErrors(["No changes detected."]);
        return;
      }

      const validation = updateProfileSchema.safeParse({
        fullName: form.fullName,
        username: form.username,
        email:    form.email,
        gender:   form.gender || undefined,
      });

      if (!validation.success) {
        setErrors(validation.error.issues.map((i) => i.message));
        return;
      }

      const payload: UpdateProfilePayload = {
  fullName:     form.fullName,
  profilePhoto: form.profilePhoto || undefined,
  ...(form.username !== profile.username && { username: form.username }),
  ...(form.email    !== profile.email    && { email:    form.email    }),
  ...(isValidGender(form.gender)         && { gender:   form.gender   }),
};

      const updated = await updateProfile(payload).unwrap();

      if (user && token) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              name:   updated.fullName,
              email:  updated.email,
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
      console.error("Profile save error:", err);
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
        newPassword:     result.data.newPassword,
      }).unwrap();

      setShowPassword(false);
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password changed successfully!");
    } catch (err: any) {
      alert(err?.data?.message ?? "Failed to change password.");
      console.error("Password change error:", err);
    }
  };

  const genderOptions = [
    { value: "",                  label: "Not specified"     },
    { value: "MALE",              label: "Male"              },
    { value: "FEMALE",            label: "Female"            },
    { value: "OTHER",             label: "Other"             },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  ];

  return (
    <>
      <DashboardHeader showCreate={false} />
    <div className="flex-1 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your profile and account</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Profile</h2>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <AvatarUpload
              currentUrl={form.profilePhoto}
              displayName={form.fullName}
              onUpload={handleAvatarUpload}
              disabled={saving}
              size={96}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {form.fullName || "—"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {form.username && <>@{form.username}</>}
                {isValidGender(form.gender) && (
                  <><br />{genderOptions.find((o) => o.value === form.gender)?.label}</>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              >
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {profile?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Member Since</label>
                <div className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || profileLoading}
            style={{ backgroundColor: "#6C5CE7" }}
            className="px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {profileLoading ? (
              <><Loader size={16} className="animate-spin" /> Loading…</>
            ) : saving ? (
              <><Loader size={16} className="animate-spin" /> Saving…</>
            ) : saveSuccess ? (
              <><Check size={16} /> Saved!</>
            ) : (
              <><Check size={16} /> Save Changes</>
            )}
          </button>

          {errors.length > 0 && (
            <div className="mt-3 space-y-1 text-sm text-red-600 dark:text-red-400">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Password</h2>

          {!showPassword ? (
            <button
              onClick={() => setShowPassword(true)}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Change My Password
            </button>
          ) : (
            <div className="space-y-4 max-w-md mb-4">
              {(
                [
                  { key: "currentPassword", label: "Current Password" },
                  { key: "newPassword",     label: "New Password"     },
                  { key: "confirmPassword", label: "Confirm Password" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                  </label>
                  <input
                    type={show[key] ? "text" : "password"}
                    value={pwdForm[key]}
                    onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })}
                    className="w-full px-4 py-2 pr-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, [key]: !show[key] })}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePasswordSave}
                  style={{ backgroundColor: "#6C5CE7" }}
                  className="flex-1 px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPassword(false);
                    setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  </>
  );
}