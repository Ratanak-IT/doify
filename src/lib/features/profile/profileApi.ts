import { baseApi } from "../api/api";
import type { UserProfile } from "../types/task-type";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      UserProfile,
      { fullName: string; username: string; email: string; profilePhoto?: string }
    >({
      query: (body) => ({ url: "/profile", method: "PUT", body }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/profile/password", method: "PATCH", body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
