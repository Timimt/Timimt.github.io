import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import { publishedPosts } from "../lib/collections";
import {
  githubRepositories,
  githubRepositoryPath,
} from "../data/github-repos";

export async function GET(context) {
  const solutions = publishedPosts(await getCollection("solutions"));
  const projects = publishedPosts(await getCollection("projects"));
  const notes = publishedPosts(await getCollection("notes"));
  const journal = publishedPosts(await getCollection("journal"));

  const articleItems = [...solutions, ...projects, ...notes, ...journal]
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

  const repositoryItems = githubRepositories.map((repository) => ({
    title: repository.title,
    description: repository.description,
    link: githubRepositoryPath(repository),
    pubDate: new Date(repository.pushedAt),
    categories: [repository.language, ...repository.topics].filter(Boolean),
  }));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: [...articleItems, ...repositoryItems].sort(
      (left, right) => right.pubDate.getTime() - left.pubDate.getTime(),
    ),
    customData: `<language>zh-TW</language>`,
  });
}
