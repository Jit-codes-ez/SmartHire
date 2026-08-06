 function getAuthToken() {
  const stored = localStorage.getItem("student");
  if (!stored) return null;
  try {
    return JSON.parse(stored).token || null;
  } catch {
    return null;
  }
}

export function authFetch(url, options = {}) {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}