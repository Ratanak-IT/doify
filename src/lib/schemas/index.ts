import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Full name is required").min(2).max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Invalid email address"),
  gender: z.string(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createPersonalTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Title is too long"),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  parentTaskId: z.string().optional(),
});

export const createProjectTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Title is too long"),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  parentTaskId: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

function pastDateMessage(val: string | undefined): string | undefined {
  if (!val) return undefined; // empty = optional, skip
  const selected = new Date(val);
  if (isNaN(selected.getTime())) return "Invalid date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return "Date cannot be in the past";
  return undefined;
}

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Name is too long"),
    description: z.string().max(500).optional(),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color")
      .default("#4F46E5"),
    teamId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // start date: not in the past
    const startErr = pastDateMessage(data.startDate);
    if (startErr) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: startErr, path: ["startDate"] });
    }

    // due date: not in the past
    const dueErr = pastDateMessage(data.dueDate);
    if (dueErr) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: dueErr, path: ["dueDate"] });
    }

    // due date must be after start date (if both provided)
    if (data.startDate && data.dueDate) {
      const start = new Date(data.startDate);
      const due = new Date(data.dueDate);
      if (!isNaN(start.getTime()) && !isNaN(due.getTime()) && due < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Due date must be after start date",
          path: ["dueDate"],
        });
      }
    }
  });

export const updateProjectSchema = z
  .object({
    name: z.string().min(1, "Project name is required").max(100).optional(),
    description: z.string().max(500).optional(),
    dueDate: z.string().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    // due date: if provided, must not be in the past
    const dueErr = pastDateMessage(data.dueDate);
    if (dueErr) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: dueErr, path: ["dueDate"] });
    }
  });

export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  teamId: z.string().min(1, "Please select a team"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreatePersonalTaskInput = z.infer<typeof createPersonalTaskSchema>;
export type CreateProjectTaskInput = z.infer<typeof createProjectTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;