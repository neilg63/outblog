import { urlSplit } from "./settings";
import { extractRendered, formatDate, notEmptyString } from "./utils";

export interface ParamSet {
  [key: string]: any;
}

type BasePost = { title: string; content: string; slug: string };

export class Post implements BasePost {
  title = "";
  content = "";
  uri = "";
  slug = "";
  excerpt = "";
  previewImg = "";
  date: Date = new Date(0);
  modified: Date = new Date(0);
  tags: Tag[] = [];
  mainTag: Tag = new Tag();

  constructor(resource: any = null, tags: Tag[] = []) {
    if (resource instanceof Object) {
      this.title = extractRendered(resource, "title");
      if (typeof resource.link === "string") {
        const full_slug = resource.link.split(urlSplit()).pop();
        if (typeof full_slug === "string") {
          this.uri = full_slug;
        }
      }
      if (typeof resource.slug === "string") {
        this.slug = resource.slug;
      }
      this.content = extractRendered(resource, "content");
      this.excerpt = extractRendered(resource, "excerpt");
      if (resource.date) {
        this.date = new Date(resource.date);
      }
      if (resource.modified) {
        this.modified = new Date(resource.modified);
      }
      if (notEmptyString(resource.featured_img, 7)) {
        this.previewImg = resource.featured_img;
      }
      if (resource.tags instanceof Array && tags instanceof Array) {
        this.tags = resource.tags
          .map((tagId: number) => {
            const tg = tags.find((t) => t.id === tagId);
            return tg instanceof Tag ? tg : new Tag(null);
          })
          .filter((t: Tag) => t.isValid());
      }
    }
  }

  isValid() {
    return (
      this.date.getFullYear() > 2000 &&
      notEmptyString(this.title) &&
      notEmptyString(this.slug)
    );
  }

  addMainTag(tg: Tag): Post {
    this.mainTag = tg;
    return this;
  }

  dateFormat(mode = "short"): string {
    return formatDate(this.date, mode);
  }

  get shortDate(): string {
    return this.dateFormat("short");
  }

  get mediumDate(): string {
    return this.dateFormat("medium");
  }

  get longDate(): string {
    return this.dateFormat("long");
  }

  get tagList() {
    return this.tags
      .filter((tg: Tag) => notEmptyString(tg.name))
      .map((tg) => tg.name)
      .join(", ");
  }
}

export class Tag {
  id = 0;
  name = "";
  slug = "";

  constructor(resource: any = null) {
    if (resource instanceof Object) {
      if (typeof resource.slug === "string") {
        this.slug = resource.slug;
      }
      if (typeof resource.id === "number") {
        this.id = resource.id;
      }
      if (notEmptyString(resource.name, 7)) {
        this.name = resource.name;
      }
    }
  }

  isValid() {
    return (
      this.id > 0 && notEmptyString(this.slug) && notEmptyString(this.name)
    );
  }
}

export class YearLink {
  title = "";
  year = 0;

  constructor(year: number) {
    if (year > 1900) {
      this.title = year.toString();
      this.year = year;
    }
  }

  get link() {
    return `/${this.year}`;
  }
}
