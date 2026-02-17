import { useEffect, useRef, useState } from "react";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const menuOptions = {
    Home: () => {
      window.location.assign("/");
    },
    "Toggle Theme": toggleTheme,
    "Sign in": () => {
      window.location.assign("/auth");
    },
  };

  const handleOptionClick = (action) => {
    action();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
    <div ref={menuRef} className="fixed top-4 right-4 z-30 flex flex-col items-end gap-2">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="hamburger-menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)] transition-colors outline-none hover:outline hover:outline-2 hover:outline-[var(--color-link)] dark:hover:outline-[var(--color-link-dark)] focus:outline-none"
      >
        <span className="flex flex-col items-center justify-center gap-1">
          <span className="h-0.5 w-5 rounded-full bg-[var(--color-text-light)] dark:bg-[var(--color-text-dark)]"></span>
          <span className="h-0.5 w-5 rounded-full bg-[var(--color-text-light)] dark:bg-[var(--color-text-dark)]"></span>
          <span className="h-0.5 w-5 rounded-full bg-[var(--color-text-light)] dark:bg-[var(--color-text-dark)]"></span>
        </span>
      </button>

      {open && (
        <div
          id="hamburger-menu"
          className="w-44 rounded-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] shadow-lg border border-black/10 dark:border-white/10 overflow-hidden"
        >
          {Object.entries(menuOptions).map(([label, action]) => (
            <button
              key={label}
              onClick={() => handleOptionClick(action)}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] hover:bg-black/5 dark:hover:bg-white/10"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
