/**
 * Reads the auth token from localStorage.
 * Checks "admin" first, then falls back to "student".
 * This way admin pages and student pages both work with
 * the same authFetch without any change at the call site.
 */
function getAuthToken() {
  // Try admin key first
  const adminStored = localStorage.getItem("admin");
  if (adminStored) {
    try {
      const token = JSON.parse(adminStored).token;
      if (token) return token;
    } catch {
      // malformed — fall through
    }
  }

  // Fall back to student key
  const studentStored = localStorage.getItem("student");
  if (studentStored) {
    try {
      const token = JSON.parse(studentStored).token;
      if (token) return token;
    } catch {
      // malformed
    }
  }

  return null;
}

export function authFetch(url, options = {}) {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}