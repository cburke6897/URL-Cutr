import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import CopyButton from "../components/CopyButton";
import LinkExpirerDropdown from "../components/LinkExpirerDropdown";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import { fetchCurrentUser } from "../utils/User";
import { shortenUrl } from "../utils/Url";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [expiration, setExpiration] = useState(5);
  const [code, setCode] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("error");
    if (msg) {
      setError(msg);
    }

    window.history.replaceState({}, "", "/");

    async function init() {
      setUser(await fetchCurrentUser());
    }

    init()
  }, []);

  const shorten = async () => {
    setError("");
    setShortUrl("");

    try {
      const shortUrlResult = await shortenUrl(url, expiration, code);
      setShortUrl(shortUrlResult);
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
      {user && <UsernameLabel username={user.username} admin = {user.admin} />}
      <DropdownMenu/>
      <div className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors">
        
        <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-4 transition-colors">
          URL Cutr
        </h1>

    
        <div className="flex flex-col gap-3 items-center p-3">
          <TextInput placeholder="Enter URL" value={url} onChange={setUrl} additionalClasses="w-full" title="Enter the URL you want to shorten"/>
          <TextInput placeholder="Enter Code (Optional)" value={code} onChange={setCode} additionalClasses="w-full" title="Enter a custom code for your shortened URL (optional)" />
        </div>

        <div className="flex justify-center">
          <div className="w-100">
            <LinkExpirerDropdown value={expiration} onChange={setExpiration} showNever={user?.admin === true}/> 
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
              rel="noopener noreferrer"
              target="_blank"
              className="underline text-link dark:text-link-dark"
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