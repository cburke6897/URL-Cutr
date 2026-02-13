import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-4 right-4 bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] dark:bg-[var(--color-button-dark)] dark:hover:bg-[var(--color-button-hover-dark)] text-white px-3 py-2 rounded-lg shadow-md transition-colors"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}