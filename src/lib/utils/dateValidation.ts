
export function validateDueDate(
  value: string,
  required = true
): string | undefined {
  if (!value) {
    return required ? "Due date is required" : undefined;
  }

  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selected.getTime())) {
    return "Invalid date";
  }

  if (selected < today) {
    return "Due date cannot be in the past";
  }

  return undefined;
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}