import { useEffect, useRef, useState } from "react";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const menuOptions = {
    Home: () => {
      window.location.assign("/");
    },
    "About URL Cutr": () => {},
    "Pricing (Soon)": () => {},
    "Docs + Tips": () => {},
    "Contact Support": () => {},
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
