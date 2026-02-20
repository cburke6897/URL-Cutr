export default function ShortenButton({onClick, title = "", text = ""}) {
  return (
    <button
      onClick={onClick}
      className="h-12 w-full py-3 bg-shorten-button hover:bg-shorten-button-hover dark:bg-shorten-button-dark dark:hover:bg-shorten-button-hover-dark text-white font-semibold rounded-lg transition"
      title={title}
    >
      {text}
    </button>
  );
}