/**
 * Content ⇄ EmDash, for the Cloudflare build.
 *
 *   npm run cf:content -- seed    write .emdash/seed.json from src/content
 *   npm run cf:content -- check   prove the mapping loses nothing
 *   npm run cf:content -- push    bring a running EmDash up to date with the files
 *
 * `seed` turns today's file content into an EmDash seed: the schema from
 * site/content/collections.ts and one published entry per record. EmDash
 * applies it on the first request to an empty database — that is how the D1
 * database is filled the first time, and how a local dev database is.
 *
 * `check` is the guarantee behind that. For every record of every
 * collection it maps the value to an EmDash row and back and requires the
 * result to deep-equal the original, and it requires every entry key to be
 * unique. The build runs it; a type gaining a field that the collection
 * description does not know about fails here rather than vanishing from the
 * site.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import {
  COLLECTIONS,
  LIST_LABEL,
  POSITION,
  fromRow,
  seedFields,
  toRow,
  type CollectionSpec,
} from "../../site/content/collections";

type Rec = Record<string, unknown>;

export async function loadSource(spec: CollectionSpec): Promise<[string, Rec][]> {
  const mod = (await import(resolve(spec.source.file))) as Record<string, unknown>;
  const value = mod[spec.source.export];
  if (value === undefined) throw new Error(`${spec.source.file} does not export ${spec.source.export}`);
  switch (spec.shape) {
    case "array":
      return (value as Rec[]).map((v, i) => [spec.key!(v, i), v]);
    case "record":
      return Object.entries(value as Record<string, Rec>);
    case "single":
      return [[spec.key!(value as Rec, 0), value as Rec]];
  }
}

/** JSON-level equality: what survives a trip through D1 is what JSON can carry. */
const plain = (v: unknown) => JSON.parse(JSON.stringify(v)) as unknown;

async function check(): Promise<number> {
  let failures = 0;
  for (const spec of COLLECTIONS) {
    const entries = await loadSource(spec);
    const keys = new Set<string>();
    for (const [key, value] of entries) {
      if (!key) {
        console.error(`✗ ${spec.slug}: an entry has an empty key`);
        failures++;
      }
      if (keys.has(key)) {
        console.error(`✗ ${spec.slug}: duplicate key "${key}"`);
        failures++;
      }
      keys.add(key);
      /* Through JSON on the way in too: a row is stored, not handed over. */
      const back = fromRow(spec, plain(toRow(spec, value)) as Rec);
      if (!isDeepStrictEqual(plain(back), plain(value))) {
        failures++;
        const a = plain(value) as Rec;
        const b = plain(back) as Rec;
        const diff = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
          (k) => !isDeepStrictEqual(a[k], b[k]),
        );
        console.error(`✗ ${spec.slug}/${key}: round trip changes ${diff.map((k) => `\`${k}\``).join(", ")}`);
      }
    }
    console.log(`  ${spec.slug}: ${entries.length} entr${entries.length === 1 ? "y" : "ies"}`);
  }
  return failures;
}

async function seed(out: string) {
  const collections = [];
  const content: Record<string, unknown[]> = {};
  let order = 0;
  for (const spec of COLLECTIONS) {
    collections.push({
      slug: spec.slug,
      label: spec.label,
      labelSingular: spec.labelSingular,
      supports: ["drafts", "revisions", "search"],
      routable: false,
      group: spec.group,
      urlPattern: spec.urlPattern,
      sortOrder: order++,
      titleField: spec.titleField,
      fields: seedFields(spec),
    });
    const entries = await loadSource(spec);
    content[spec.slug] = entries.map(([key, value], i) => ({
      id: `${spec.slug}:${key}`,
      slug: key,
      status: "published",
      data: {
        ...toRow(spec, value),
        ...(spec.shape === "array" ? { [POSITION]: (i + 1) * 10 } : {}),
        ...(spec.listLabel ? { [LIST_LABEL]: spec.listLabel(value, key) } : {}),
      },
    }));
  }

  const seedFile = {
    $schema: "https://emdashcms.com/seed.schema.json",
    version: "1",
    meta: {
      name: "НаСвітло",
      description: "Бібліотека відповідальності та правосуддя для України",
    },
    settings: { title: "НаСвітло", timezone: "Europe/Kyiv" },
    collections,
    content,
  };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(seedFile, null, 2) + "\n");
  const n = Object.values(content).reduce((a, b) => a + b.length, 0);
  console.log(`  seed: ${collections.length} collections, ${n} entries → ${out}`);
}

/**
 * `push`: the files → a running EmDash, for the transition period.
 *
 * Until the switch, main keeps editing src/content, and the admin already
 * holds a copy seeded from an older version of it. This compares every file
 * record with the entry in EmDash and, for the ones that differ or are
 * missing, writes the file's version and publishes it. Entries that exist
 * only in EmDash are listed, never deleted.
 *
 * It overwrites editors' work, so by default it only reports; `--yes` writes.
 * After the switch — once EmDash is where content is edited — do not run it.
 *
 *   EMDASH_URL=https://… EMDASH_TOKEN=… npm run cf:content -- push [--yes]
 *
 * The token is a personal access token from the admin (Settings → API
 * tokens) with content read, write and publish scopes.
 */
async function push(write: boolean) {
  const base = process.env.EMDASH_URL?.replace(/\/$/, "");
  const token = process.env.EMDASH_TOKEN;
  if (!base || !token) throw new Error("push needs EMDASH_URL and EMDASH_TOKEN");
  const api = async (method: string, path: string, body?: unknown) => {
    const res = await fetch(`${base}/_emdash/api${path}`, {
      method,
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: { item?: { data: Rec; id: string } } };
    return { status: res.status, item: json.data?.item };
  };

  let changed = 0;
  for (const spec of COLLECTIONS) {
    const entries = await loadSource(spec);
    for (const [i, [key, value]] of entries.entries()) {
      const data: Rec = {
        ...toRow(spec, value),
        ...(spec.shape === "array" ? { [POSITION]: (i + 1) * 10 } : {}),
        ...(spec.listLabel ? { [LIST_LABEL]: spec.listLabel(value, key) } : {}),
      };
      const got = await api("GET", `/content/${spec.slug}/${encodeURIComponent(key)}`);
      const same =
        got.item &&
        isDeepStrictEqual(plain(fromRow(spec, got.item.data)), plain(value)) &&
        (spec.shape !== "array" || Number(got.item.data[POSITION]) === data[POSITION]);
      if (same) continue;
      changed++;
      console.log(`  ${got.item ? "update" : "create"} ${spec.slug}/${key}`);
      if (!write) continue;
      const saved = got.item
        ? await api("PUT", `/content/${spec.slug}/${got.item.id}`, { data })
        : await api("POST", `/content/${spec.slug}`, { slug: key, data });
      if (!saved.item) throw new Error(`push: saving ${spec.slug}/${key} failed (${saved.status})`);
      const pub = await api("POST", `/content/${spec.slug}/${saved.item.id}/publish`);
      if (pub.status >= 300) throw new Error(`push: publishing ${spec.slug}/${key} failed (${pub.status})`);
    }
  }
  console.log(
    changed === 0
      ? "cf:content push: EmDash already matches src/content."
      : write
        ? `cf:content push: wrote and published ${changed} entr${changed === 1 ? "y" : "ies"}.`
        : `cf:content push: ${changed} entr${changed === 1 ? "y differs" : "ies differ"} — run with --yes to write.`,
  );
}

const [cmd = "check", ...rest] = process.argv.slice(2);
if (cmd === "check") {
  const failures = await check();
  if (failures) {
    console.error(`\ncf:content check: ${failures} problem(s). See site/content/collections.ts.`);
    process.exit(1);
  }
  console.log("cf:content check: every record survives the trip through EmDash unchanged.");
} else if (cmd === "seed") {
  await seed(resolve(rest[0] ?? ".emdash/seed.json"));
} else if (cmd === "push") {
  await push(rest.includes("--yes"));
} else {
  console.error(`unknown command: ${cmd}`);
  process.exit(2);
}
