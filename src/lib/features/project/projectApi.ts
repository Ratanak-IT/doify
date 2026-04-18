import { baseApi } from "../api/api";
import type { Project } from "@/lib/features/types/task-type";

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const projectApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getProjectsByTeam: builder.query<
      PageResponse<Project>,
      { teamId: string; page?: number; size?: number }
    >({
      query: ({ teamId, page = 0, size = 50 }) =>
        `/projects/team/${teamId}?page=${page}&size=${size}`,
      providesTags: (result, _, { teamId }) =>
        result
          ? [
              ...result.content.map((p) => ({ type: "Project" as const, id: p.id })),
              { type: "Project" as const, id: `TEAM-${teamId}` },
            ]
          : [{ type: "Project" as const, id: `TEAM-${teamId}` }],
    }),

    getMyProjects: builder.query<PageResponse<Project>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 50 } = {}) =>
        `/projects?page=${page}&size=${size}`,
      providesTags: ["Project"],
    }),

    getProject: builder.query<Project, { projectId: string }>({
      query: ({ projectId }) => `/projects/${projectId}`,
      providesTags: (_, __, { projectId }) => [{ type: "Project", id: projectId }],
    }),

    createProject: builder.mutation<
      Project,
      {
        name: string;
        teamId: string;
        description?: string;
        startDate?: string;
        dueDate?: string;
        color?: string;
      }
    >({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation<
      Project,
      {
        id: string;
        data: Partial<{
          name: string;
          description: string;
          startDate: string;
          dueDate: string;
          color: string;
        }>;
      }
    >({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_, __, { id }) => [{ type: "Project", id }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsByTeamQuery,
  useGetMyProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;