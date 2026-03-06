import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/Auth";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef(null);
  const focusedIndexRef = useRef(-1);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  let menuOptions;

  if (token) {
    menuOptions = {
      Home: () => navigate("/"),
      Dashboard: () => navigate("/dashboard"),
      "Toggle Theme": toggleTheme,
      "Sign out": async () => await logout(navigate, location, token),
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
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setFocusedIndex(-1); // Reset focus to nothing when menu opens

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      const token = localStorage.getItem("token");
      let currentMenuOptions;
      
      if (token) {
        currentMenuOptions = {
          Home: () => navigate("/"),
          Dashboard: () => navigate("/dashboard"),
          "Toggle Theme": toggleTheme,
          "Sign out": async () => await logout(navigate, location, token),
        };
      } else {
        currentMenuOptions = {
          Home: () => navigate("/"),
          "Toggle Theme": toggleTheme,
          "Sign in": () => navigate("/auth"),
        };
      }

      const menuOptionsArray = Object.entries(currentMenuOptions);
      const maxIndex = menuOptionsArray.length - 1;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === -1) return 0;
          return prev < maxIndex ? prev + 1 : 0;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === -1) return maxIndex;
          return prev > 0 ? prev - 1 : maxIndex;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (focusedIndexRef.current >= 0) {
          const [, action] = menuOptionsArray[focusedIndexRef.current];
          handleOptionClick(action);
        }
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
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
          className="w-44 rounded-lg bg-surface-light dark:bg-surface-dark shadow-lg border border-border-subtle dark:border-border-subtle-dark overflow-hidden"
        >
          {Object.entries(menuOptions).map(([label, action], index) => (
            <button
              key={label}
              onClick={() => handleOptionClick(action)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`w-full px-4 py-2 text-left text-sm text-text-light dark:text-text-dark transition-colors ${
                index === focusedIndex
                  ? "bg-hover-overlay dark:bg-hover-overlay-dark"
                  : "hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
