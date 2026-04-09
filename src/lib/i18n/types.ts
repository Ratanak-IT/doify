export type Language = "en" | "kh";

export interface Translations {
  [key: string]: string | Translations;
}
