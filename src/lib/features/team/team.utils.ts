import { AVATAR_PALETTE } from "./team.constants";

export function getInitials(name: string): string {
  return (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function getAvatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < (seed ?? "").length; i++) {
    h = seed.charCodeAt(i) + ((h << 5) - h);
  }
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}