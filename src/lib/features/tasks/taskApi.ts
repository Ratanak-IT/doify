import { baseApi } from "../api/api";
import type {
  Task,
  Project,
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
        status?: string;
      }
    >({
      query: (body) => ({
        url: "/tasks/personal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PersonalTask", "Task", "Stats", "Dashboard", "Notification"],
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
              ...result.content.map((t) => ({ type: "Task" as const, id: t.id })),
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
        "Dashboard",
        "Notification",
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
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        "PersonalTask",
        "Task",
        "Stats",
        "Dashboard",
      ],
    }),

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
        "Task",
        "Stats",
        "Dashboard",
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Task", "PersonalTask", "ProjectTask", "Stats", "Dashboard"],
    }),

    getSubtasks: builder.query<Task[], string>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      providesTags: (_r, _e, taskId) => [{ type: "Task", id: taskId }, "Task"],
    }),

    addAttachment: builder.mutation<Attachment, { taskId: string; file: FormData }>({
      query: ({ taskId, file }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: "POST",
        body: file,
      }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    deleteAttachment: builder.mutation<void, { taskId: string; attachmentId: string }>({
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
      invalidatesTags: ["Comment", "Notification"],
    }),

    updateComment: builder.mutation<Comment, { taskId: string; commentId: string; content: string }>({
      query: ({ taskId, commentId, content }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation<void, { taskId: string; commentId: string }>({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

    getProjects: builder.query<PageResponse<Project>, { page?: number; size?: number }>({
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
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Project", "Dashboard", "Notification"],
    }),

    updateProject: builder.mutation<
      Project,
      { id: string; data: { name?: string; description?: string; dueDate?: string; color?: string } }
    >({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Project", "Dashboard"],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
  }),
  overrideExisting: true,
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
} = taskApi;