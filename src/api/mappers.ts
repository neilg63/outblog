import { ParamSet } from "./interfaces";
import { Post, Tag } from "./models";

export const mapToPost = (resource: ParamSet, tags: Tag[] = []): Post => {
  return new Post(resource, tags);
};

export const mapToPlainPost = (resource: ParamSet): Post => {
  return new Post(resource, []);
};

export const mapToTag = (resource: ParamSet): Tag => {
  return new Tag(resource);
};
