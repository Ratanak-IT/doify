import { baseApi } from "../api/api";
import type {
  Task,
  Project,
  ActivityItem,
  DashboardStats,
  Comment,
  Attachment,
  PageResponse,
} from "../types/task-type";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalTasks: builder.query<
      PageResponse<Task>,
      { status?: string; search?: string; page?: number; size?: number }
    >({
      query: (params) => ({
        url: "/tasks/personal",
        params: { page: 0, size: 20, ...params },
      }),
      providesTags: ["PersonalTask"],
    }),

    createPersonalTask: builder.mutation<
      Task,
      {
        title: string;
        description?: string;
        priority?: string;
        dueDate?: string;
        parentTaskId?: string;
      }
    >({
      query: (body) => ({
        url: "/tasks/personal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PersonalTask", "Task", "Stats"],
    }),

    getProjectTasks: builder.query<
      PageResponse<Task>,
      {
        projectId: string;
        assigneeId?: string;
        status?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({ projectId, ...params }) => ({
        url: `/tasks/project/${projectId}`,
        params: { page: 0, size: 20, ...params },
      }),
      providesTags: (result, _error, { projectId }) =>
        result
          ? [
              ...result.content.map((t) => ({
                type: "Task" as const,
                id: t.id,
              })),
              { type: "ProjectTask" as const, id: projectId },
              "ProjectTask",
            ]
          : ["ProjectTask"],
    }),

    createProjectTask: builder.mutation<
      Task,
      {
        projectId: string;
        title: string;
        description?: string;
        priority?: string;
        dueDate?: string;
        assigneeId?: string;
        parentTaskId?: string;
        status?: string;
      }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/tasks/project/${projectId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { projectId }) => [
        { type: "ProjectTask", id: projectId },
        "ProjectTask",
        "Task",
        "Stats",
      ],
    }),

    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Task", id }],
    }),

    updateTask: builder.mutation<
      Task,
      {
        id: string;
        data: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      // Also invalidate the PARENT task's subtask list so getSubtasksQuery
      // re-fetches immediately when a subtask status/title changes.
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        "PersonalTask",
        "Task", // re-fetches all getSubtasksQuery caches (they providesTags: "Task")
        "Stats",
      ],
    }),

    // ─── Used for project tasks (parent + subtasks) ──────────────────────────
    updateProjectTask: builder.mutation<
      Task,
      {
        projectId: string;
        taskId: string;
        data: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string;
        };
      }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { projectId, taskId }) => [
        { type: "Task", id: taskId },
        { type: "ProjectTask", id: projectId },
        "ProjectTask",
        "Project",
        "Task",
        "Stats",
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Task", "PersonalTask", "ProjectTask", "Project", "Stats"],
    }),

    getSubtasks: builder.query<Task[], string>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      // Tag with the PARENT task id so any mutation that invalidates
      // { type: "Task", id: parentTaskId } will re-fetch this query.
      providesTags: (_r, _e, taskId) => [
        { type: "Task", id: taskId },
        "Task",
      ],
    }),

    addAttachment: builder.mutation<
      Attachment,
      { taskId: string; file: FormData }
    >({
      query: ({ taskId, file }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: "POST",
        body: file,
      }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    // Fix: transformResponse on DELETE mutations must return void, not null
    deleteAttachment: builder.mutation<
      void,
      { taskId: string; attachmentId: string }
    >({
      query: ({ taskId, attachmentId }) => ({
        url: `/tasks/${taskId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    getComments: builder.query<
      PageResponse<Comment>,
      { taskId: string; page?: number; size?: number }
    >({
      query: ({ taskId, ...params }) => ({
        url: `/tasks/${taskId}/comments`,
        params: { page: 0, size: 20, ...params },
      }),
      providesTags: ["Comment"],
    }),

    addComment: builder.mutation<Comment, { taskId: string; content: string }>({
      query: ({ taskId, content }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comment"],
    }),

    updateComment: builder.mutation<
      Comment,
      { taskId: string; commentId: string; content: string }
    >({
      query: ({ taskId, commentId, content }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Comment"],
    }),

    // Fix: removed transformResponse: () => null — return type is void
    deleteComment: builder.mutation<
      void,
      { taskId: string; commentId: string }
    >({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

    getProjects: builder.query<
      PageResponse<Project>,
      { page?: number; size?: number }
    >({
      query: (params) => ({
        url: "/projects",
        params: { page: 0, size: 20, ...params },
      }),
      providesTags: ["Project"],
    }),

    getProjectsByTeam: builder.query<
      PageResponse<Project>,
      { teamId: string; page?: number; size?: number }
    >({
      query: ({ teamId, ...params }) => ({
        url: `/projects/team/${teamId}`,
        params: { page: 0, size: 20, ...params },
      }),
      providesTags: ["Project"],
    }),

    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Project", id }],
    }),

    createProject: builder.mutation<
      Project,
      {
        name: string;
        description?: string;
        startDate?: string;
        dueDate?: string;
        color: string;
        teamId?: string;
      }
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation<
      Project,
      {
        id: string;
        data: {
          name?: string;
          description?: string;
          dueDate?: string;
          color?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    getDashboard: builder.query<
      DashboardStats & { recentActivity: ActivityItem[] },
      void
    >({
      query: () => "/dashboard",
      providesTags: ["Stats", "Activity"],
    }),

    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard",
      transformResponse: (response: any) => {
        // If response has stats directly, return it
        if (response.totalTasks !== undefined) {
          return {
            totalTasks: response.totalTasks,
            inProgress: response.inProgress,
            completed: response.completed,
            overdue: response.overdue,
            totalTasksChange: response.totalTasksChange || "0",
            inProgressChange: response.inProgressChange || "0",
            completedChange: response.completedChange || "0",
            overdueChange: response.overdueChange || "0",
          };
        }
        // If response has data wrapper
        if (response.data && response.data.totalTasks !== undefined) {
          return {
            totalTasks: response.data.totalTasks,
            inProgress: response.data.inProgress,
            completed: response.data.completed,
            overdue: response.data.overdue,
            totalTasksChange: response.data.totalTasksChange || "0",
            inProgressChange: response.data.inProgressChange || "0",
            completedChange: response.data.completedChange || "0",
            overdueChange: response.data.overdueChange || "0",
          };
        }
        // Default fallback
        return {
          totalTasks: 0,
          inProgress: 0,
          completed: 0,
          overdue: 0,
          totalTasksChange: "0",
          inProgressChange: "0",
          completedChange: "0",
          overdueChange: "0",
        };
      },
      providesTags: ["Stats"],
    }),

    getRecentActivity: builder.query<ActivityItem[], void>({
      query: () => "/dashboard/activity",
      providesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetPersonalTasksQuery,
  useCreatePersonalTaskMutation,
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteTaskMutation,
  useGetSubtasksQuery,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetProjectsQuery,
  useGetProjectsByTeamQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetDashboardQuery,
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} = taskApi;