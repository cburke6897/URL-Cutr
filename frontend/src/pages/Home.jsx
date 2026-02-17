import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import CopyButton from "../components/CopyButton";
import LinkExpirerDropdown from "../components/LinkExpirerDropdown";
import ThemeToggle from "../components/ThemeToggle";

export default function Home({ url, setUrl, shortUrl, error, expiration, setExpiration, shorten, code, setCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-colors p-4">
      <div className="min-h-[23.8rem] w-full max-w-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-8 pb-4 rounded-xl shadow-lg text-center transition-colors">
        
        <h1 className="text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] text-3xl font-bold mb-4 transition-colors">
          URL Cutr
        </h1>

    
        <div className="flex flex-col gap-3 items-center p-3">
          <TextInput placeholder="Enter URL" value={url} onChange={setUrl} additionalClasses="w-full" title="Enter the URL you want to shorten"/>
          <TextInput placeholder="Enter Code (Optional)" value={code} onChange={setCode} additionalClasses="w-full" title="Enter a custom code for your shortened URL (optional)" />
        </div>

        <div className="flex justify-center">
          <div className="w-100">
            <LinkExpirerDropdown value={expiration} onChange={setExpiration} /> 
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3">
          <EnterButton onClick={shorten} title="Shorten URL" text = "Cut URL"/>
          <CopyButton text={shortUrl} disabled={!shortUrl} />
        </div>

        {shortUrl && (
          <p className="text-green-600 dark:text-green-400 mt-2 transition-colors">
            Cut URL:{" "}
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