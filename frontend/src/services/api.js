const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (!window.location.hash.includes("login")) {
    window.location.hash = "login";
  }
};


const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};


const handleResponse = async (response) => {
  let data = {};

  try {
    const text = await response.text();

    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = {};
  }


  if (!response.ok) {
    if (response.status === 401) {
      clearAuthAndRedirect();
    }

    throw new Error(
      data?.message ||
      data?.detail ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
};


export const api = {
  get: async (endpoint) => {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  },


  post: async (endpoint, data = {}) => {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    return handleResponse(response);
  },


  put: async (endpoint, data = {}) => {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    return handleResponse(response);
  },


  delete: async (endpoint) => {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  },
};