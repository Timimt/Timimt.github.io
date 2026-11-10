import fs from "node:fs";
import path from "node:path";

const owner = process.env.GITHUB_OWNER?.trim() || "Timimt";
const token = process.env.GITHUB_TOKEN?.trim();
const outputDirectory = path.resolve("src", "generated");
const outputPath = path.join(outputDirectory, "github-repos.json");
const excludedRepositories = new Set(["Timimt.github.io"]);

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "timimt-personal-blog-sync",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function request(url, accept = "application/vnd.github+json") {
  const response = await fetch(url, {
    headers: { ...headers, Accept: accept },
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}): ${url}`);
  }
  return response;
}

function titleFromRepo(repository) {
  return repository.name
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function readTitle(readme, fallback) {
  const heading = readme.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading && heading.length <= 120 ? heading : fallback;
}

function kindFor(repository) {
  const topics = repository.topics ?? [];
  const name = repository.name.toLowerCase();
  if (
    topics.includes("troubleshooting") ||
    name.startsWith("solutions-") ||
    name.includes("investigation")
  ) {
    return "troubleshooting";
  }
  return "project";
}

fs.mkdirSync(outputDirectory, { recursive: true });

try {
  const repoResponse = await request(
    `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=100&sort=updated`,
  );
  const repositories = await repoResponse.json();
  if (!Array.isArray(repositories)) {
    throw new Error("GitHub repositories response is invalid.");
  }

  const selected = repositories
    .filter((repository) => !repository.fork && !excludedRepositories.has(repository.name))
    .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at));

  const synced = [];
  for (const repository of selected) {
    let readme = "";
    try {
      const readmeResponse = await request(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository.name)}/readme`,
        "application/vnd.github.raw+json",
      );
      readme = await readmeResponse.text();
    } catch {
      readme = "";
    }

    const fallbackTitle = titleFromRepo(repository);
    synced.push({
      name: repository.name,
      title: readTitle(readme, fallbackTitle),
      description:
        repository.description?.trim() ||
        `${fallbackTitle} 的 GitHub Repository。`,
      url: repository.html_url,
      homepage: repository.homepage || null,
      defaultBranch: repository.default_branch || "main",
      language: repository.language || null,
      topics: Array.isArray(repository.topics) ? repository.topics : [],
      pushedAt: repository.pushed_at,
      updatedAt: repository.updated_at,
      kind: kindFor(repository),
      readme,
    });
  }

  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        owner,
        generatedAt: new Date().toISOString(),
        repositories: synced,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`Synced ${synced.length} GitHub repositories to ${path.relative(process.cwd(), outputPath)}.`);
} catch (error) {
  if (fs.existsSync(outputPath)) {
    console.warn(
      `GitHub sync failed; using existing snapshot: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } else {
    throw error;
  }
}
