import data from "../generated/github-repos.json";

export type GithubRepository = {
  name: string;
  title: string;
  description: string;
  url: string;
  homepage: string | null;
  defaultBranch: string;
  language: string | null;
  topics: string[];
  pushedAt: string;
  updatedAt: string;
  kind: "project" | "troubleshooting";
  readme: string;
};

type GithubData = {
  owner: string;
  generatedAt: string;
  repositories: GithubRepository[];
};

const githubData = data as GithubData;

export const githubOwner = githubData.owner;
export const githubGeneratedAt = githubData.generatedAt;
export const githubRepositories = githubData.repositories;
export const githubProjects = githubRepositories.filter(
  (repository) => repository.kind === "project",
);
export const githubTroubleshooting = githubRepositories.filter(
  (repository) => repository.kind === "troubleshooting",
);

export function githubRepositoryPath(repository: GithubRepository): string {
  return `/projects/github/${repository.name}/`;
}
