export const API_URI = "https://www.outsider-insight.org.uk";
export const WP_API_BASE = "wp-json/wp/v2";

export const siteTitle = `Outsider Insight`;

export const perPage = 32; // default for blog post listings

// process.env.API_BASE_UR
export const get_pai_uri = (): string => API_URI;

export const wpApiUri = (method: string): string => {
  return [get_pai_uri(), WP_API_BASE, method].join("/");
};

export const urlSplit = (): string => {
  const result = get_pai_uri()
    ?.split(/:\/\/(www|cms\.)?/)
    ?.pop();
  return typeof result === "string" ? result : "/";
};
