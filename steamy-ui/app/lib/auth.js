const TOKEN_KEY = 'steamyToken';

export function getPersistedToken() {
  return window.localStorage.getItem(TOKEN_KEY) || null;
}

export function setPersistedToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function erasePersistedToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
