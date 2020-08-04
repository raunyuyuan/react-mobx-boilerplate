// /user/profile/xxx => [ '/user',  '/user/profile', , '/user/profile/xxx']
export function urlToList(url: string): any[] {
  const a = url.split("/").filter((i) => i);
  return a.map((_, idx) => `/${a.slice(0, idx + 1).join("/")}`);
}

export function fixedEncodeURIComponent(str: string) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return `%${c.charCodeAt(0).toString(16)}`;
  });
}
