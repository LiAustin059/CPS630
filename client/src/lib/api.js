const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const getStoredToken = () => localStorage.getItem("eventhub_token");

export const apiFetch = (path, options = {}) => {
  const headers = {
    ...(options.headers || {}),
  };

  const token = getStoredToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
};