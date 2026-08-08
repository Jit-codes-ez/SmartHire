/**
 * Reads the auth token from localStorage.
 *
 * Checks:
 * 1. admin
 * 2. recruiter
 * 3. student
 *
 * This allows all three portals to use the same authFetch().
 */
function getAuthToken() {
  const authKeys = ["admin", "recruiter", "student"];

  for (const key of authKeys) {
    const stored = localStorage.getItem(key);

    if (!stored) {
      continue;
    }

    try {
      const data = JSON.parse(stored);

      if (data?.token) {
        return data.token;
      }
    } catch (error) {
      console.error(`Invalid ${key} authentication data.`);
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
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });
}