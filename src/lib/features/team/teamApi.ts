import { baseApi } from "../api/api";
import type { TeamMember, Team, PageResponse } from "../types/task-type";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getTeams: builder.query<PageResponse<Team>, { page?: number; size?: number }>({
      query: (params) => ({ url: "/teams", params: { page: 0, size: 20, ...params } }),
      providesTags: ["Team"],
    }),
    getTeamById: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Team", id }],
    }),
    createTeam: builder.mutation<Team, { name: string; description?: string }>({
      query: (body) => ({ url: "/teams", method: "POST", body }),
      invalidatesTags: ["Team", "Dashboard", "Notification"],
    }),
    updateTeam: builder.mutation<Team, { id: string; data: { name?: string; description?: string } }>({
      query: ({ id, data }) => ({ url: `/teams/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Team", "Dashboard"],
    }),
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({ url: `/teams/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team", "Dashboard"],
    }),

    getTeamMembers: builder.query<PageResponse<TeamMember>, { teamId: string; page?: number; size?: number }>({
      query: ({ teamId, ...params }) => ({
        url: `/teams/${teamId}/members`,
        params: { page: 0, size: 50, ...params },
      }),
      providesTags: ["TeamMember"],
    }),
    inviteMember: builder.mutation<void, { teamId: string; email: string; role: string }>({
      query: ({ teamId, ...body }) => ({
        url: `/teams/${teamId}/invitations`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TeamMember", "Dashboard", "Notification"],
    }),
    updateMemberRole: builder.mutation<void, { teamId: string; memberId: string; role: string }>({
      query: ({ teamId, memberId, role }) => ({
        url: `/teams/${teamId}/members/${memberId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["TeamMember", "Dashboard"],
    }),
    removeMember: builder.mutation<void, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeamMember", "Dashboard"],
    }),
    acceptInvitation: builder.mutation<void, string>({
      query: (id) => ({ url: `/teams/invitations/${id}/accept`, method: "POST" }),
      invalidatesTags: ["Team", "TeamMember", "Dashboard", "Notification"],
    }),

    getTeam: builder.query<TeamMember[], void>({
      query: () => "/team",
      providesTags: ["TeamMember"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useAcceptInvitationMutation,
  useGetTeamQuery,
} = teamApi;