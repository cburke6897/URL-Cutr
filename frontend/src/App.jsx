import { useEffect, useState } from "react";
import Home from "./pages/Home";

function App() {
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

  const shorten = async () => {
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: ensureHttp(url), delete_after: expiration, code: code }),
      });

      if (!response.ok) {
        let message = 'Unknown error';
        let error_text = null;

        try {
          error_text = await response.text();
          console.error("Error response body:", error_text);
        }
        catch (e) {          
          console.error("Failed to read error response text:", e);
        }

        if (response.status === 400) {
          message = "Invalid URL format";
        }
        else if (response.status === 429) {
          message = "Rate limit exceeded. Please try again later.";
        }
        else if (response.status === 422) {
          message = "URL not entered";
        }
        else if (response.status === 450) {
          message = "Custom code already exists";
        }
        else if (error_text) {
          message = `Error ${response.status}: ${error_text}`;
        }

        setError(message);  
        return;
      }

      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (e) {
      setError("Network error");
    }
  };

  return (
    <Home
      url={url}
      setUrl={setUrl}
      shortUrl={shortUrl}
      error={error}
      expiration={expiration}
      setExpiration={setExpiration}
      shorten={shorten}
      code={code}
      setCode={setCode}
    />
  );
}

function ensureHttp(url) {
  console.log(url);
  if (!/^https?:\/\//i.test(url)) {
    return "http://" + url;
  }
  return url;
}

export default App;