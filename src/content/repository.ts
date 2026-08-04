/**
 * Content access boundary.
 *
 * The UI depends only on `ContentRepository`, never on where content is stored.
 * Today it's backed by typed files (`fileRepository`); when Payload CMS lands we
 * add a `payloadRepository` implementing the same interface and swap it in
 * `getContentRepository()` — no component changes required.
 *
 * All methods are async so the file-backed and CMS-backed implementations are
 * interchangeable.
 */
import { courts } from "./courts";
import { partners } from "./partners";
import { registryCases } from "./registry";
import { stats } from "./stats";
import type { Court, Partner, RegistryCase, Stat } from "./types";

export interface ContentRepository {
  getCourts(): Promise<Court[]>;
  getRegistryCases(): Promise<RegistryCase[]>;
  getStats(): Promise<Stat[]>;
  getPartners(): Promise<Partner[]>;
}

/** File-backed implementation used until Payload CMS is wired up. */
export const fileRepository: ContentRepository = {
  async getCourts() {
    return [...courts].sort((a, b) => a.order - b.order);
  },
  async getRegistryCases() {
    return registryCases;
  },
  async getStats() {
    return stats;
  },
  async getPartners() {
    return partners;
  },
};

/**
 * Returns the active content repository. Swap the implementation here (e.g. read
 * `process.env.CONTENT_SOURCE`) once `payloadRepository` exists.
 */
export function getContentRepository(): ContentRepository {
  return fileRepository;
}

/** Convenience: registry cases grouped by court id, preserving file order. */
export async function getRegistryByCourt(
  repo: ContentRepository = fileRepository,
): Promise<Map<string, RegistryCase[]>> {
  const cases = await repo.getRegistryCases();
  const byCourt = new Map<string, RegistryCase[]>();
  for (const c of cases) {
    const list = byCourt.get(c.courtId);
    if (list) list.push(c);
    else byCourt.set(c.courtId, [c]);
  }
  return byCourt;
}
