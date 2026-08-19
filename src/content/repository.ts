/**
 * Content access boundary.
 *
 * The UI depends only on `ContentRepository`, never on where content is stored.
 * Today it's backed by typed files; when Payload CMS lands we add a
 * `payloadRepository` implementing the same interface and swap it in
 * `getContentRepository()` — no component changes required. All methods are
 * async so file-backed and CMS-backed implementations are interchangeable.
 */
import { about } from "./about";
import { registryCases } from "./cases";
import { institutions } from "./institutions";
import { courtHubs, mapEvents } from "./map";
import { partners } from "./partners";
import { posts } from "./posts";
import { stats } from "./stats";
import { team } from "./team";
import type {
  AboutContent,
  CourtHub,
  Institution,
  MapEvent,
  Partner,
  Post,
  RegistryCase,
  Stat,
  TeamMember,
} from "./types";

export interface ContentRepository {
  getInstitutions(): Promise<Institution[]>;
  getCases(): Promise<RegistryCase[]>;
  getStats(): Promise<Stat[]>;
  getPartners(): Promise<Partner[]>;
  getMapEvents(): Promise<MapEvent[]>;
  getCourtHubs(): Promise<CourtHub[]>;
  getTeam(): Promise<TeamMember[]>;
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | null>;
  getAbout(): Promise<AboutContent>;
}

/** File-backed implementation used until Payload CMS is wired up. */
export const fileRepository: ContentRepository = {
  async getInstitutions() {
    return [...institutions].sort((a, b) => a.order - b.order);
  },
  async getCases() {
    return registryCases;
  },
  async getStats() {
    return stats;
  },
  async getPartners() {
    return partners;
  },
  async getMapEvents() {
    return mapEvents;
  },
  async getCourtHubs() {
    return courtHubs;
  },
  async getTeam() {
    return [...team].sort((a, b) => a.order - b.order);
  },
  async getPosts() {
    return [...posts].sort((a, b) => b.date.localeCompare(a.date));
  },
  async getPost(slug) {
    return posts.find((p) => p.slug === slug) ?? null;
  },
  async getAbout() {
    return about;
  },
};

/**
 * Returns the active content repository. Swap the implementation here (e.g. read
 * `process.env.CONTENT_SOURCE`) once `payloadRepository` exists.
 */
export function getContentRepository(): ContentRepository {
  return fileRepository;
}

/** Registry cases grouped by institution id, preserving file order. */
export async function getCasesByInstitution(
  repo: ContentRepository = fileRepository,
): Promise<Map<string, RegistryCase[]>> {
  const cases = await repo.getCases();
  const byInstitution = new Map<string, RegistryCase[]>();
  for (const c of cases) {
    const list = byInstitution.get(c.institutionId);
    if (list) list.push(c);
    else byInstitution.set(c.institutionId, [c]);
  }
  return byInstitution;
}
