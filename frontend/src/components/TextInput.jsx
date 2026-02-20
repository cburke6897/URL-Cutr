export default function Input({placeholder, value, onChange, additionalClasses = "", title = "", type = "text"}) {
  return (
    <input
      type={type}
      placeholder = {placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title = {title}
      className={`p-3 rounded-lg bg-input-bar dark:bg-input-bar-dark text-input-text dark:text-input-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button ${additionalClasses}`}
    />
  );
}