import { baseApi } from "../api/api";

interface RawAuthResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    uuid?: string;
    fullName?: string;
    name?: string;
    username?: string;
    email?: string;
    profilePhoto?: string;
    avatar?: string;
  };
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: { id: string; name: string; email: string; avatar?: string };
}

function normalize(raw: RawAuthResponse): AuthResponse {
  const token = raw.accessToken ?? raw.token ?? "";
  const u = raw.user ?? {};
  return {
    token,
    refreshToken: raw.refreshToken,
    user: {
      id:     u.id ?? u.uuid ?? "",
      name:   u.fullName ?? u.name ?? u.username ?? "",
      email:  u.email ?? "",
      avatar: u.profilePhoto ?? u.avatar,
    },
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (raw: RawAuthResponse) => normalize(raw),
    }),

    register: builder.mutation<
      AuthResponse,
      { fullName: string; username: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (raw: RawAuthResponse) => normalize(raw),
    }),
    socialLogin: builder.mutation<
      AuthResponse,
      { email: string; name: string; avatar?: string | null; provider: string }
    >({
      query: (body) => ({ url: "/auth/social-login", method: "POST", body }),
      transformResponse: (raw: RawAuthResponse) => normalize(raw),
    }),

    refresh: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      transformResponse: (raw: RawAuthResponse) => normalize(raw),
    }),

    logoutApi: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),

    verifyEmail: builder.query<void, string>({
      query: (token) => `/auth/verify-email?token=${token}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSocialLoginMutation,
  useRefreshMutation,
  useLogoutApiMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailQuery,
} = authApi;