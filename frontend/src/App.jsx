import { useState } from "react";
import './App.css';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-white text-3xl font-bold mb-6">URL Shortener</h1>

        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={shorten}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Shorten
        </button>

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

export default App;