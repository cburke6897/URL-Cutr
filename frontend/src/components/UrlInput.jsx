export default function UrlInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Enter URL"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-lg mb-4 bg-[var(--color-input-bar)] dark:bg-[var(--color-input-bar-dark)] text-[var(--color-input-text)] dark:text-[var(--color-input-text-dark)] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-button)]"
    />
  );
}