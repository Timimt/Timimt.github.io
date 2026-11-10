import { slugify } from "./format";

export type TocHeading = {
  depth: number;
  text: string;
  slug: string;
};

export function extractHeadings(markdown: string): TocHeading[] {
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (!match) return null;
      const text = match[2].replace(/[*_`]/g, "").trim();
      return {
        depth: match[1].length,
        text,
        slug: slugify(text),
      };
    })
    .filter((heading): heading is TocHeading => heading !== null);
}
