import type { CollectionEntry } from "astro:content";

type Post =
  | CollectionEntry<"solutions">
  | CollectionEntry<"projects">
  | CollectionEntry<"notes">
  | CollectionEntry<"journal">;

export function publishedPosts<T extends Post>(entries: T[]): T[] {
  return entries.filter((entry) => entry.data.status !== "draft");
}

export function byNewest<T extends Post>(entries: T[]): T[] {
  return [...entries].sort(
    (left, right) =>
      right.data.pubDate.getTime() - left.data.pubDate.getTime(),
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

export function readingTime(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`|[\]()]/g, " ")
    .trim();
  const chineseCharacters = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = (text.match(/[A-Za-z0-9_-]+/g) ?? []).length;
  return Math.max(1, Math.ceil((chineseCharacters + latinWords * 2) / 500));
}
