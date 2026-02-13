export default function UrlInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Enter URL"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-lg mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}