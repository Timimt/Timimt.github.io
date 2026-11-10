import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function folderSlugId({ entry }: { entry: string }): string {
  const withoutIndex = entry.replace(/\/index\.md$/, "");
  return withoutIndex.replace(/\.md$/, "").split("/").pop() ?? withoutIndex;
}

const postFields = {
  title: z.string().min(1).max(120),
  description: z.string().min(20).max(240),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  status: z.enum(["published", "draft"]).default("published"),
  repo: z.string().url().optional(),
};

const solutions = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/solutions",
    generateId: folderSlugId,
  }),
  schema: z.object({
    ...postFields,
    category: z.enum(["windows", "github", "programming", "cybersecurity", "tools"]),
    errorSummary: z.string().max(240).optional(),
    sources: z.array(z.string().url()).max(12).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
    generateId: folderSlugId,
  }),
  schema: z.object({
    ...postFields,
    status: z.enum(["published", "draft", "active", "paused", "archived"]).default("published"),
    stack: z.array(z.string().min(1).max(40)).max(20).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).max(8).default([]),
  }),
});

const notes = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/notes",
    generateId: folderSlugId,
  }),
  schema: z.object({
    ...postFields,
    course: z.string().optional(),
    relatedKnowledge: z.string().url().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/journal",
    generateId: folderSlugId,
  }),
  schema: z.object({
    ...postFields,
    mood: z.string().max(40).optional(),
  }),
});

export const collections = { solutions, projects, notes, journal };
