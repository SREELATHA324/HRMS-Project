const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },
};