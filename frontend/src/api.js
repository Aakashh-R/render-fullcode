// src/api.js
// Universal API helper — works with CRA (process.env.REACT_APP_API_BASE) or Vite (import.meta.env.VITE_API_BASE)
const API_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.VITE_API_BASE_URL) ||
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5001";

function getAuthHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res) {
  const text = await res.text();
  try {
    return { status: res.status, body: JSON.parse(text) };
  } catch {
    return { status: res.status, body: text };
  }
}

export async function apiPost(path, body = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return parseResponse(res);
}

export async function apiGet(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      ...getAuthHeader(token),
    },
    credentials: "include",
  });
  return parseResponse(res);
}

export async function apiPut(path, body = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return parseResponse(res);
}

export async function apiDelete(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(token),
    },
    credentials: "include",
  });
  return parseResponse(res);
}
