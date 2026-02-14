export default function Input({placeholder, value, onChange, additionalClasses = "", title = ""}) {
  return (
    <input
      type="text"
      placeholder = {placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title = {title}
      className={`p-3 rounded-lg bg-[var(--color-input-bar)] dark:bg-[var(--color-input-bar-dark)] text-[var(--color-input-text)] dark:text-[var(--color-input-text-dark)] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-button)] ${additionalClasses}`}
    />
  );
}