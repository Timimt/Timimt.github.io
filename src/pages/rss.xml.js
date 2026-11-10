import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import { publishedPosts } from "../lib/collections";

export async function GET(context) {
  const solutions = publishedPosts(await getCollection("solutions"));
  const projects = publishedPosts(await getCollection("projects"));
  const notes = publishedPosts(await getCollection("notes"));
  const journal = publishedPosts(await getCollection("journal"));

  const items = [...solutions, ...projects, ...notes, ...journal]
    .sort(
      (left, right) =>
        (right.data.updatedDate ?? right.data.pubDate).getTime() -
        (left.data.updatedDate ?? left.data.pubDate).getTime(),
    )
    .map((entry) => {
      const base = entry.collection === "solutions"
        ? "solutions"
        : entry.collection === "projects"
          ? "projects"
          : entry.collection === "journal"
            ? "journal"
            : "notes";
      return {
        title: entry.data.title,
        description: entry.data.description,
        link: `/${base}/${entry.id}/`,
        pubDate: entry.data.pubDate,
        categories: entry.data.tags,
      };
    });

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items,
    customData: `<language>zh-TW</language>`,
  });
}
