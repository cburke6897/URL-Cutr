import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/Auth";

export default function DropdownMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const token = localStorage.getItem("token");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  let menuOptions;

  if (token) {
    menuOptions = {
      Home: () => navigate("/"),
      Dashboard: () => navigate("/dashboard"),
      "Toggle Theme": toggleTheme,
      "Sign out": async () => await logout(navigate, token),
    }
  } else {
    menuOptions = {
      Home: () => navigate("/"),
      "Toggle Theme": toggleTheme,
      "Sign in": () => navigate("/auth"),
    }
  }

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
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent hover:bg-surface-light dark:hover:bg-surface-dark transition-colors outline-none hover:outline hover:outline-(--color-link) dark:hover:outline-link-dark focus:outline-none"
      >
        <span className="flex flex-col items-center justify-center gap-1">
          <span className="h-0.5 w-5 rounded-full bg-text-light dark:bg-text-dark"></span>
          <span className="h-0.5 w-5 rounded-full bg-text-light dark:bg-text-dark"></span>
          <span className="h-0.5 w-5 rounded-full bg-text-light dark:bg-text-dark"></span>
        </span>
      </button>

      {open && (
        <div
          id="hamburger-menu"
          className="w-44 rounded-lg bg-surface-light dark:bg-surface-dark shadow-lg border border-black/10 dark:border-white/10 overflow-hidden"
        >
          {Object.entries(menuOptions).map(([label, action]) => (
            <button
              key={label}
              onClick={() => handleOptionClick(action)}
              className="w-full px-4 py-2 text-left text-sm text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
