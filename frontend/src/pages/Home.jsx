import UrlInput from "../components/UrlInput";
import ShortenButton from "../components/ShortenButton";
import CopyButton from "../components/CopyButton";

export default function Home({ url, setUrl, shortUrl, error, shorten }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-white text-3xl font-bold mb-6">URL Shortener</h1>

        <UrlInput value={url} onChange={setUrl} />

        <div className="flex items-center gap-1 mt-2">
            <ShortenButton onClick={shorten} />
            <CopyButton text={shortUrl} />
        </div>

        {shortUrl && (
          <p className="text-green-400 mt-4">
            Short URL:{" "}
            <a href={shortUrl} className="underline text-indigo-300">
              {shortUrl}
            </a>
          </p>
        )}

        {error && (
          <p className="text-red-400 mt-4 font-semibold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}