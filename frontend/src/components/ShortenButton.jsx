export default function ShortenButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 bg-[var(--color-shorten-button)] hover:bg-[var(--color-shorten-button-hover)] dark:bg-[var(--color-shorten-button-dark)] dark:hover:bg-[var(--color-shorten-button-hover-dark)] text-white font-semibold rounded-lg transition"
      title="Shorten URL"
    >
      Shorten
    </button>
  );
}