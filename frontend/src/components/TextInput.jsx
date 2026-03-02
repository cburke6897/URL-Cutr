export default function Input({placeholder, value, onChange, additionalClasses = "", title = "", type = "text", autocomplete = "off", maxLength}) {
  return (
    <input
      type={type}
      placeholder = {placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title = {title}
      autoComplete={autocomplete}
      maxLength={maxLength}
      className={`p-3 rounded-lg bg-input-bar dark:bg-input-bar-dark text-input-text dark:text-input-text-dark placeholder-placeholder dark:placeholder-placeholder-dark focus:outline-none focus:ring-2 focus:ring-button ${additionalClasses}`}
    />
  );
}