const ensureHttp = (value) => {
  if (!/^https?:\/\//i.test(value)) {
    return "http://" + value;
  }
  return value;
};

export const shortenUrl = async (url, expiration, code) => {
  const token = localStorage.getItem("token");
  console.log("Token in shorten function:", token);

  const response = await fetch("http://localhost:8000/shorten", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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

    throw new Error(message);
  }

  const data = await response.json();
  return data.short_url;
};
