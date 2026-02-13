export default function ShortenButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
      title="Shorten URL"
    >
      Shorten
    </button>
  );
}