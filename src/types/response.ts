interface Platform {
  id: number;
  name: string;
  icon: string;
}

interface Topic {
  id: number;
  name: string;
  sub_name?: string;
  description: string;
  github_url: string;
}

interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  sub_topic: string;
  type: string;
  star_count?: number;
  fork_count?: number;
  watch_count?: number;
  updated_at: Date;
}

interface Repos {
  total: number;
  repo_total: number;
  resource_total: number;
  data: Array<Repo>;
}

export type { Platform, Topic, Repo, Repos };
