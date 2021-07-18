export function saveToken(key: string, value: any) {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}

export function getToken(key: string) {
  let item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }

  return item;
}

export function deleteToken(key: string) {
  localStorage.removeItem(key);
}
