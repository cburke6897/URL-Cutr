import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const shorten = async () => {
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: url })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.detail || "Something went wrong");
        return;
      }

      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (e) {
      setError("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <button onClick={shorten} style={{ padding: "0.5rem 1rem" }}>
        Shorten
      </button>

      {shortUrl && (
        <p style={{ marginTop: "1rem" }}>
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default App;