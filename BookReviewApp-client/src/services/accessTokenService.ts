const key = 'accessToken';

function get() {
  return localStorage.getItem(key);
}

function save(token: string) {
  localStorage.setItem(key, token);
}

function remove() {
  localStorage.removeItem(key);
}

export const accessTokenService = { get, save, remove };
