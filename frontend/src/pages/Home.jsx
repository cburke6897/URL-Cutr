import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import CopyButton from "../components/CopyButton";
import LinkExpirerDropdown from "../components/LinkExpirerDropdown";
import DropdownMenu from "../components/DropdownMenu";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [expiration, setExpiration] = useState(5);
  const [code, setCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("error");
    if (msg) {
      setError(msg);
    }

    window.history.replaceState({}, "", "/");
  }, []);

  const ensureHttp = (value) => {
    if (!/^https?:\/\//i.test(value)) {
      return "http://" + value;
    }
    return value;
  };

  const shorten = async () => {
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_url: ensureHttp(url),
          delete_after: expiration,
          code: code,
        }),
      });

      if (!response.ok) {
        let message = "Unknown error";
        let errorText = null;

        try {
          errorText = await response.text();
          console.error("Error response body:", errorText);
        } catch (fetchError) {
          console.error("Failed to read error response text:", fetchError);
        }

        if (response.status === 400) {
          message = "Invalid URL format";
        } else if (response.status === 429) {
          message = "Rate limit exceeded. Please try again later.";
        } else if (response.status === 422) {
          message = "URL not entered";
        } else if (response.status === 450) {
          message = "Custom code already exists";
        } else if (errorText) {
          message = `Error ${response.status}: ${errorText}`;
        }

        setError(message);
        return;
      }

      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (requestError) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-colors p-4">
      <DropdownMenu />
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
    </div>
  );
}