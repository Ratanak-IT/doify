
export type TaskStatus   = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MemberRole   = "OWNER" | "ADMIN" | "MEMBER";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_CREATED"
  | "DUE_DATE_REMINDER"
  | "OVERDUE_TASK"
  | "MENTIONED_IN_COMMENT"
  | "INVITATION_ACCEPTED"
  | "COMMENT_ADDED"
  | "PROJECT_UPDATED"
  | "PROJECT_CREATED"
  | "TEAM_INVITATION"
  | "TEAM_MEMBER_JOINED";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

// ── Profile / UserResponse ─────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  profilePhoto?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  isVerified?: boolean;
  createdAt?: string;
}

// ── Task ───────────────────────────────────────────────────────────────────
export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  parentTaskId?: string;
  assignees: TaskAssignee[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  subtaskCount?: number;
  commentCount?: number;
  attachmentsCount?: number;
}

// ── Comment ────────────────────────────────────────────────────────────────
// API returns `author` (UserResponse) — NOT `user`.
// `initials` and `color` are not in the API; derive them in the UI.
export interface CommentAuthor {
  id: string;
  fullName: string;
  username: string;
  email: string;
  profilePhoto?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  isVerified?: boolean;
  createdAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

// ── Attachment ─────────────────────────────────────────────────────────────
export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

// ── Project ────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  color: string;
  progress: number;
  tasksCount: number;
  tasksDone?: number;
  totalTasks?: number;
  description?: string;
  status?: string;
  dueDate?: string;
  startDate?: string;
  teamId?: string;
  members?: { id: string; initials: string; color: string }[];
}

// ── Team ───────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  owner?: UserProfile;
  createdAt?: string;
}

// Matches the API's TeamMemberResponse schema exactly.
// `initials`, `color`, `status`, `tasksOpen`, `tasksDone` are NOT in the API —
// derive them in the UI.
export interface TeamMember {
  id: string;          // membership record id
  user: UserProfile;   // nested UserResponse
  role: MemberRole;
  joinedAt: string;    // API field is `joinedAt`, not `joinedDate`
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  referenceId?: string; 
  referenceType?: string;
  isRead: boolean; 
  createdAt: string;
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  overdue: number;
  totalTasksChange: string;
  inProgressChange: string;
  completedChange: string;
  overdueChange: string;
}

export interface ActivityItem {
  id: string;
  user: { name: string; initials: string; color: string };
  action: string;
  target: string;
  createdAt: string;
}