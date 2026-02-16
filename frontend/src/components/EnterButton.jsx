export default function ShortenButton({onClick, title = ""}) {
  return (
    <button
      onClick={onClick}
      className="h-12 w-full py-3 bg-[var(--color-shorten-button)] hover:bg-[var(--color-shorten-button-hover)] dark:bg-[var(--color-shorten-button-dark)] dark:hover:bg-[var(--color-shorten-button-hover-dark)] text-white font-semibold rounded-lg transition"
      title={title}
    >
      Shorten
    </button>
  );
}