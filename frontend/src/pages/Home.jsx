import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import CopyButton from "../components/CopyButton";
import LinkExpirerDropdown from "../components/LinkExpirerDropdown";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import InfoCard from "../components/InfoCard";
import { fetchCurrentUser } from "../utils/User";
import { shortenUrl } from "../utils/Url";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expiration, setExpiration] = useState(5);
  const [code, setCode] = useState("");
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    const successMessage = searchParams.get("success");
    
    if (errorMessage) {
      setError(errorMessage);
    }
    
    if (successMessage) {
      setSuccess(successMessage);
    }

    navigate("/", { replace: true }); // Clear query params from URL

    async function init() {
      setUser(await fetchCurrentUser());
    }

    init()
  }, []);

  const shorten = async () => {
    setError("");
    setSuccess("");
    setShortUrl("");

    try {
      const shortUrlResult = await shortenUrl(url, expiration, code);
      setShortUrl(shortUrlResult);
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      shorten();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
      {user && <UsernameLabel username={user.username} admin = {user.admin} />}
      <DropdownMenu/>
      <div 
        className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors"
        onKeyDown={handleKeyDown}
      >
        
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
          <p className="text-success dark:text-success-dark mt-2 transition-colors">
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

        {success && (
          <p className="text-success dark:text-success-dark mt-4 font-semibold transition-colors">
            {success}
          </p>
        )}

        {error && (
          <p className="text-error dark:text-error-dark mt-4 font-semibold transition-colors">
            {error}
          </p>
        )}
      </div>
      <InfoCard />
    </div>
  );
}