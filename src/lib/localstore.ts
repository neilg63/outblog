import { fetchTags } from "~/api/fetch";
import { mapToTag } from "~/api/mappers";
import { Tag } from "~/api/models";

export const localStoreSupported = (): boolean => {
  return typeof localStorage !== "undefined";
};

export const toLocal = (key = "", data: any = null) => {
  const ts = Date.now() / 1000;
  let sd = ts + ":";
  if (data !== null && localStoreSupported()) {
    if (typeof data === "object") {
      sd += "obj:" + JSON.stringify(data);
    } else {
      sd += "sca:" + data;
    }
    localStorage.setItem(key, sd);
  }
};

export const fromLocal = (key = "", maxAge = 3600) => {
  const ts = Date.now() / 1000;
  const obj: any = {
    expired: true,
    valid: false,
  };
  if (!maxAge) {
    maxAge = 60 * 60;
  }
  if (localStoreSupported()) {
    const data = localStorage.getItem(key);
    if (data) {
      let parts = data.split(":");
      if (parts.length > 2) {
        obj.ts = parts.shift();
        obj.ts = obj.ts - 0;
        obj.type = parts.shift();
        obj.data = parts.join(":");

        if (obj.type === "obj") {
          obj.data = JSON.parse(obj.data);
        }
        const latestTs = obj.ts + maxAge;
        if (ts <= latestTs) {
          obj.expired = false;
          obj.valid = true;
        }
      }
    }
  }
  return obj;
};

export const clearLocal = (key = "", fuzzy = false) => {
  if (localStoreSupported()) {
    const keys = Object.keys(localStorage);
    if (fuzzy !== true) {
      fuzzy = false;
    }
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      if (fuzzy) {
        const rgx = new RegExp("^" + key);
        if (rgx.test(k)) {
          localStorage.removeItem(k);
        }
      } else if (k === key || key === "all") {
        switch (k) {
          case "current-user":
            break;
          default:
            localStorage.removeItem(k);
            break;
        }
      }
    }
  }
};

export const getStoredTags = (): Tag[] => {
  const stored = fromLocal("tag_list", 7 * 24 * 3600);
  if (!stored.expired && stored.data instanceof Array) {
    return stored.data.map(mapToTag);
  } else {
    return [];
  }
};

export const fetchStoredTags = async () => {
  const storedTags = getStoredTags();
  if (storedTags.length > 0) {
    return storedTags;
  } else {
    const tags = await fetchTags();
    if (tags instanceof Array && tags.length > 1) {
      toLocal("tag_list", tags);
    }
    return tags;
  }
};

export const extractMatchedTag = (slug = ""): Tag => {
  const tags = getStoredTags();
  if (tags.length > 0) {
    const row = tags.find((tg) => tg.slug === slug);
    if (row instanceof Object) {
      return row;
    }
  }
  return new Tag();
};
