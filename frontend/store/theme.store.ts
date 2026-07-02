import { create } from "zustand";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

interface ThemeState {
  theme: Theme;
  dialogOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setDialogOpen: (open: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme:
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  dialogOpen: false,
  setDialogOpen: (open) => set({ dialogOpen: open }),
}));
