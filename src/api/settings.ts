export const API_URI = "https://cms.outsider-insight.org.uk";
export const WP_API_BASE = "wp-json/wp/v2";

export const siteTitle = `Outsider Insight`;

export const siteDesc = `If you feel unable to cope with the pace of socio-cultural change or reconcile obvious contradictions and feel social and personal injustices have grown rather than shrunk over the last 30 years of neoliberal economic globalisation with an unprecedented rate of cultural change and social engineering, then you maybe you are not mad, society is.`;

export const imgBase = "wp-content/uploads";

export const defImages = [
  "2023/05/power-dynamics-green.jpg",
  "2023/05/power-dynamics-red.jpg",
  "2023/05/nature-and-nurture-green.jpg",
  "2023/05/nature-and-nurture-red.jpg",
  "2023/05/surveillance-red.jpg",
  "2023/05/highway-to-hell.jpg",
  "2023/05/overdev-red.jpg",
  "2023/05/gridlock.jpg",
  "2023/05/alienation.jpg",
  "2023/05/rail-lonely.jpg",
];

export const perPage = 32; // default for blog post listings

export const startYear = 2001; // earliest available year

export const skipYears = [2003, 2004]; // earliest available year

// process.env.API_BASE_UR
export const get_api_uri = (): string => API_URI;

export const wpApiUri = (method: string): string => {
  return [get_api_uri(), WP_API_BASE, method].join("/");
};

export const urlSplit = (): string => {
  const result = get_api_uri()
    ?.split(/:\/\/(www|cms\.)?/)
    ?.pop();
  return typeof result === "string" ? result : "/";
};
