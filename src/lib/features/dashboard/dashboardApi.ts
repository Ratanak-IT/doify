import { baseApi } from "../api/api";

export interface ActivityResponse {
  activityType: string;
  description: string;
  timestamp: string;
}

export interface ProjectProgressResponse {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface UpcomingTaskResponse {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  projectName: string;
}

export interface DashboardResponse {
  totalProjects: number;
  totalTasks: number;
  myTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalTeamMembers: number;
  upcomingDueDates: UpcomingTaskResponse[];
  recentActivities: ActivityResponse[];
  projectProgressSummary: ProjectProgressResponse[];
}

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardQuery } = dashboardApi;