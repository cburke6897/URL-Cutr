import UrlInput from "../components/UrlInput";
import ShortenButton from "../components/ShortenButton";
import CopyButton from "../components/CopyButton";
import LinkExpirerDropdown from "../components/LinkExpirerDropdown";
import ThemeToggle from "../components/ThemeToggle";

export default function Home({ url, setUrl, shortUrl, error, expiration, setExpiration, shorten }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-colors p-4">
      <div className="w-full max-w-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-8 rounded-xl shadow-lg text-center transition-colors">
        
        <h1 className="text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] text-3xl font-bold mb-4 transition-colors">
          URL Shortener
        </h1>

        <UrlInput value={url} onChange={setUrl} />

        <div className="flex justify-center mt-3">
          <div className="w-4/5">
            <LinkExpirerDropdown value={expiration} onChange={setExpiration} />
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3">
          <ShortenButton onClick={shorten} />
          <CopyButton text={shortUrl} disabled={!shortUrl} />
        </div>

        {shortUrl && (
          <p className="text-green-600 dark:text-green-400 mt-2 transition-colors">
            Short URL:{" "}
            <a
              href={shortUrl}
              className="underline text-[var(--color-link)] dark:text-[var(--color-link-dark)]"
            >
              {shortUrl}
            </a>
          </p>
        )}

        {error && (
          <p className="text-red-600 dark:text-red-400 mt-4 font-semibold transition-colors">
            {error}
          </p>
        )}
      </div>

      <ThemeToggle />
    </div>
  );
}