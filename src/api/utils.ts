import { format } from "date-fns";
import { YearLink } from "./models";

export const isNumeric = (num: any): boolean => {
  const dt = typeof num;
  if (
    num !== null &&
    num !== undefined &&
    (dt === "number" || dt === "string")
  ) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  } else {
    return false;
  }
};

export const notEmptyString = (str: any = null, minLength = 0): boolean => {
  if (typeof str === "string") {
    return str.trim().length > minLength;
  }
  return false;
};

export const isObjectWith = (obj: any = null, field = ""): boolean => {
  return obj instanceof Object && Object.keys(obj).includes(field);
};

export const isObjectWithArray = (obj: any = null, field = ""): boolean => {
  return isObjectWith(obj, field) && obj[field] instanceof Array;
};

export const isObjectWithObject = (obj: any = null, field = ""): boolean => {
  return (
    isObjectWith(obj, field) &&
    obj[field] instanceof Object &&
    !(obj[field] instanceof Array)
  );
};

export const isObjectWithString = (obj: any = null, field = ""): boolean => {
  return isObjectWith(obj, field) && typeof obj[field] === "string";
};

export const extractRendered = (obj: any, field = "") => {
  if (
    isObjectWithObject(obj, field) &&
    isObjectWithString(obj[field], "rendered")
  ) {
    return obj[field]["rendered"];
  }
};

const translateDateFormatCode = (mode = "short"): string => {
  switch (mode) {
    case "medium":
      return "d MMM yyyy";
    case "long":
      return "EEEE d MMMM yyyy";
    default:
      return "dd/MM/yyyy";
  }
};

export const formatDate = (dt: Date, mode = "short") => {
  const code = translateDateFormatCode(mode);
  return format(dt, code);
};

export const zeroPad = (inval: number | string, places = 2) => {
  let num = 0;
  if (typeof inval === "string") {
    num = parseInt(inval);
  } else if (typeof inval === "number") {
    num = inval;
  }
  const strs: Array<string> = [];
  const len = num > 0 ? Math.floor(Math.log10(num)) + 1 : 1;
  if (num < Math.pow(10, places - 1)) {
    const ep = places - len;
    strs.push("0".repeat(ep));
  }
  strs.push(num.toString());
  return strs.join("");
};

export const zeroPad2 = (inval: number | string): string => {
  return zeroPad(inval, 2);
};

export interface DateParamFiler {
  apply: boolean;
  before: string;
  after: string;
}

export const renderDateRange = (year = 0, month = 0): DateParamFiler => {
  let apply = false;
  let before = "";
  let after = "";
  if (year > 1000) {
    apply = true;
    if (month > 0) {
      const m = zeroPad2(month);
      const nM = month < 12 ? month + 1 : 1;
      const nextM = zeroPad2(month + 1);
      const nYear = month < 12 ? year : year + 1;
      before = `${nYear}-${nextM}-01T00:00:00`;
      after = `${year}-${m}-01T00:00:00`;
    } else {
      const nYear = year + 1;
      before = `${nYear}-01-01T00:00:00`;
      after = `${year}-01-01T00:00:00`;
    }
  }
  return { apply, before, after };
};

export const renderYearMonth = (year = 0, month = 0): string => {
  if (year > 0) {
    if (month > 0) {
      const m = zeroPad2(month);
      const dtString = `${year}-${m}-01T00:00:00`;
      const dt = new Date(dtString);
      return format(dt, "MMMM yyyy");
    } else {
      return year.toString();
    }
  } else {
    return "-";
  }
};

export const generateYearLinks = (max = 6): YearLink[] => {
  const yls: YearLink[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < max; i++) {
    let yl = new YearLink(currentYear - i);
    if (yl instanceof YearLink && yl.year >= 1900) {
      yls.push(yl);
    }
  }
  return yls;
};
