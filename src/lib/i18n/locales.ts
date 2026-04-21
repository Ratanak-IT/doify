import { Language, Translations } from "./types";

const en: Translations = {
  nav: {
    login: "Log in",
    getStarted: "Get started free",
    features: "Features",
    templates: "Templates",
    pricing: "Pricing",
    enterprise: "Enterprise",
  },
  landing: {
    hero: {
      title: "TaskFlow — Where teams move work forward",
      subtitle: "Boards, lists, and cards. The simplest way to manage your projects.",
      cta: "Get started free",
    },
    features: {
      title: "Everything your team needs",
      subtitle: "One platform to plan, track, and ship — without the complexity tax.",
    },
  },
  dashboard: {
    welcome: "Welcome back",
    tasks: "Tasks",
    projects: "Projects",
    teams: "Teams",
    noTasks: "No tasks assigned yet",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    search: "Search",
  },
};

const kh: Translations = {
  nav: {
    login: "ចូល",
    getStarted: "ចាប់ផ្តើមលេង",
    features: "លក្ខណៈពិសេស",
    templates: "ម៉ាកបង្ហាញ",
    pricing: "តម្លៃ",
    enterprise: "សហគ្រាស",
  },
  landing: {
    hero: {
      title: " — ដែលក្រុមដឹកនាំការងារឱ្យឈានដល់មុខ",
      subtitle: "ក្ដារ, បញ្ជីរ។ វិធីសាមញ្ញបំផុតដើម្បីគ្រប់គ្រងគម្រោងរបស់អ្នក។",
      cta: "ចាប់ផ្តើមលេង",
    },
    features: {
      title: "អ្វីដែលក្រុមរបស់អ្នកត្រូវការ",
      subtitle: "វេទិកាមួយដើម្បីគ្រោងលម្អិត, ដោះស្រាយ, និងផ្ដល់ — ដោយគ្មានពន្ធលម្អិត។",
    },
  },
  dashboard: {
    welcome: "ស្វាគមន៍ត្រលប់មកវិញ",
    tasks: "ភារកិច្ច",
    projects: "គម្រោង",
    teams: "ក្រុម",
    noTasks: "មិនមានភារកិច្ចដែលបានផ្តល់ឱ្យនៅឡើយទេ",
  },
  common: {
    save: "រក្សាទុក",
    cancel: "បោះបង់",
    delete: "លុប",
    edit: "កែសម្រួល",
    close: "បិទ",
    search: "ស្វែងរក",
  },
};

export const locales: Record<Language, Translations> = {
  en,
  kh,
};

export const getTranslation = (
  language: Language,
  key: string,
  defaultValue: string = key
): string => {
  const keys = key.split(".");
  let current: any = locales[language];

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      // Fallback to English
      current = locales.en;
      for (const fallbackKey of keys) {
        if (current && typeof current === "object" && fallbackKey in current) {
          current = current[fallbackKey];
        } else {
          return defaultValue;
        }
      }
      return current || defaultValue;
    }
  }

  return typeof current === "string" ? current : defaultValue;
};
