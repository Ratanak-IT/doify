"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCredentials, updateUser } from "@/lib/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/lib/features/profile/profileApi";
import { Upload, Eye, EyeOff, Loader, Check, X } from "lucide-react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/schemas";

const CLOUDINARY_CLOUD_NAME = "dwzm6ymw7";
const CLOUDINARY_UPLOAD_PRESET = "careerpatch_unsigned";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const [show, setShow] = useState<any>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        username: profile.username || "",
        email: profile.email || "",
        gender: profile.gender || "",
        profilePhoto: profile.profilePhoto || "",
      });
    }
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update form state with new image
      setForm({ ...form, profilePhoto: imageUrl });
      setUploadSuccess(true);

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      setUploadError("Failed to upload image. Please try again.");
      console.error("Upload error:", err);
      setTimeout(() => setUploadError(""), 3000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const result = updateProfileSchema.safeParse({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
      });

      if (!result.success) {
        console.error("Validation error:", result.error);
        return;
      }

      // Update profile with all fields including profilePhoto if it exists
      const updated = await updateProfile({
        ...result.data,
        profilePhoto: form.profilePhoto,
      }).unwrap();

      if (user && token) {
        dispatch(
          setCredentials({
            user: { ...user, name: updated.fullName, email: updated.email, avatar: form.profilePhoto },
            token,
          })
        );
      }

      dispatch(updateUser({ name: updated.fullName, email: updated.email }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      const result = changePasswordSchema.safeParse(pwdForm);
      if (!result.success) return;

      await changePassword({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });

      setShowPassword(false);
      setPwdForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password");
      console.error("Error:", err);
    }
  };

  const initials =
    form.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "JD";

  const genderOptions = [
    { value: "", label: "Not specified" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  ];

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your profile and account
          </p>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Profile
          </h2>

          {/* Avatar and Upload */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white text-2xl font-bold border border-slate-200 dark:border-slate-600">
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt={form.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
                title="Upload profile picture"
              >
                {uploading ? (
                  <Loader size={16} className="animate-spin text-slate-600 dark:text-slate-400" />
                ) : (
                  <Upload size={16} className="text-slate-600 dark:text-slate-400" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Profile Picture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Upload a profile photo (Max 5MB)
              </p>
              {uploadError && (
                <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <X size={14} />
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Check size={14} />
                  Picture updated successfully!
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              >
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Member Since */}
            {profile?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Member Since
                </label>
                <div className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ backgroundColor: "#6C5CE7" }}
            className="px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader size={16} className="animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check size={16} />
                Saved!
              </>
            ) : (
              <>
                <Check size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Password Section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Password
          </h2>

          {!showPassword ? (
            <button
              onClick={() => setShowPassword(true)}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Change My Password
            </button>
          ) : (
            <div className="space-y-4 max-w-md mb-4">
              {[
                { key: "currentPassword", label: "Current Password" },
                { key: "newPassword", label: "New Password" },
                { key: "confirmPassword", label: "Confirm Password" },
              ].map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                  </label>

                  <input
                    type={show[key] ? "text" : "password"}
                    value={(pwdForm as any)[key]}
                    onChange={(e) =>
                      setPwdForm({ ...pwdForm, [key]: e.target.value })
                    }
                    className="w-full px-4 py-2 pr-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                  />

                  <button
                    onClick={() => setShow({ ...show, [key]: !show[key] })}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    type="button"
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
                    setPwdForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
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
  );
}
