/* import createLocalStore from "@solid-primitives/local-store";

export const storeData = (key: string, content: any = null) => {
  const [value, setValue] = createLocalStore("app");
  setValue(key, content);
  return { key, content };
};

export const fetchStored = (key: string) => {
  const [value, setValue] = createLocalStore("app");
  return value instanceof Object && Object.keys(value).includes(key)
    ? value[key]
    : null;
};
 */
