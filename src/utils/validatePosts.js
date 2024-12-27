export function validatePostData({ title, slug, content, tags }) {
  if (!title || typeof title !== "string") throw new Error("Invalid title.");
  if (!slug || typeof slug !== "string") throw new Error("Invalid slug.");
  if (!content || typeof content !== "string")
    throw new Error("Invalid content.");
  if (
    tags &&
    (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))
  ) {
    throw new Error("Tags must be an array of strings.");
  }
}
