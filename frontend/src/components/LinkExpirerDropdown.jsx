const LINK_EXPIRATION_OPTIONS = {
  "5 minutes": 5,
  "15 minutes": 15,
  "30 minutes": 30,
  "1 hour": 60,
  "6 hours": 360,
  "1 day": 1440,
  "7 days": 10080,
};

export default function LinkExpirerDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-text-light dark:text-text-dark whitespace-nowrap">
        Expire In:
      </label>
      <select
        value={value === null ? "Never expire" : Object.entries(LINK_EXPIRATION_OPTIONS).find(([_, v]) => v === value)?.[0] || "5 minutes"}
        onChange={(e) => onChange(LINK_EXPIRATION_OPTIONS[e.target.value])}
        className="flex-1 p-3 rounded-lg bg-input-bar dark:bg-input-bar-dark text-input-text dark:text-input-text-dark focus:outline-none focus:ring-2 focus:ring-button transition-colors"
        title="Select when the shortened URL should expire"
      >
        {Object.keys(LINK_EXPIRATION_OPTIONS).map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
