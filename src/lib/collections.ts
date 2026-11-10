import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"solutions"> | CollectionEntry<"projects"> | CollectionEntry<"notes">;

export function publishedPosts<T extends Post>(entries: T[]): T[] {
  return entries.filter((entry) => entry.data.status !== "draft");
}

export function byNewest<T extends Post>(entries: T[]): T[] {
  return [...entries].sort(
    (left, right) =>
      (right.data.updatedDate ?? right.data.pubDate).getTime() -
      (left.data.updatedDate ?? left.data.pubDate).getTime(),
  );
}

export function solutionCategoryLabel(value: string): string {
  const labels: Record<string, string> = {
    windows: "Windows",
    github: "Git & GitHub",
    programming: "程式開發",
    cybersecurity: "資安設定",
    tools: "工具與 AI",
  };
  return labels[value] ?? value;
}
