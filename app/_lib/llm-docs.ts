//NOTE(jimmylee): Shared helper for the /llm/* and /llms*.txt route handlers and their vitest sync
//NOTE(jimmylee): guards. Walks the repo from process.cwd() once and returns every AGENTS.md and
//NOTE(jimmylee): SKILL.md as the canonical doc allowlist. The route handlers feed the same list into
//NOTE(jimmylee): generateStaticParams and the runtime body resolver — there is exactly one source of
//NOTE(jimmylee): truth, the filesystem. The vitest guard fails CI if the on-disk set drifts from the
//NOTE(jimmylee): set the routes serve, so adding a new AGENTS.md or SKILL.md without exposing it as
//NOTE(jimmylee): a URL is impossible inside the same PR.

//NOTE(jimmylee): The `_lib` segment is a Next.js private folder — Next.js excludes any directory
//NOTE(jimmylee): whose name starts with an underscore from routing, so this file lives next to the
//NOTE(jimmylee): routes without becoming one itself.

import { readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export const SACRED_ORIGIN = 'https://sacred.computer';
export const LLM_PREFIX = '/llm';
export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';
export const CACHE_CONTROL = 'public, max-age=300, s-maxage=86400';

export type DocEntry = {
  //NOTE(jimmylee): Repo-relative POSIX path of the file. The URL is mechanically derived from this.
  repoPath: string;
  //NOTE(jimmylee): Path segments suitable for Next.js generateStaticParams() under [...path].
  segments: string[];
  //NOTE(jimmylee): Absolute filesystem path used to read the file body.
  absolutePath: string;
  //NOTE(jimmylee): Canonical sacred.computer URL for the doc.
  url: string;
};

//NOTE(jimmylee): Repo root resolution. Next.js and vitest both run with cwd at the project root, so
//NOTE(jimmylee): process.cwd() is reliable here. Sacred has no monorepo / workspace nesting.
const REPO_ROOT = process.cwd();

//NOTE(jimmylee): Directories we never descend into when walking the tree. node_modules and .next are
//NOTE(jimmylee): the obvious ones; .workdir is the read-only sibling-project mirror sacred uses for
//NOTE(jimmylee): porting reference and intentionally excludes from its own surface.
const SKIP_DIR_NAMES = new Set(['node_modules', '.next', '.git', '.workdir']);

const DOC_FILE_NAMES = new Set(['AGENTS.md', 'SKILL.md']);

function isDirectorySkippable(name: string): boolean {
  if (SKIP_DIR_NAMES.has(name)) return true;
  //NOTE(jimmylee): Skip every dot-directory by convention. Sacred docs live under regular folders.
  if (name.startsWith('.')) return true;
  return false;
}

function walk(dir: string, out: DocEntry[]) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (isDirectorySkippable(entry.name)) continue;
      walk(join(dir, entry.name), out);
      continue;
    }
    if (entry.isFile() && DOC_FILE_NAMES.has(entry.name)) {
      const absolutePath = join(dir, entry.name);
      const relPath = relative(REPO_ROOT, absolutePath).split(sep).join('/');
      const segments = relPath.split('/');
      out.push({
        repoPath: relPath,
        segments,
        absolutePath,
        url: `${SACRED_ORIGIN}${LLM_PREFIX}/${relPath}`,
      });
    }
  }
}

//NOTE(jimmylee): Cached because Next.js may invoke this multiple times during a single build.
let cachedDocs: DocEntry[] | null = null;

export function listDocs(): DocEntry[] {
  if (cachedDocs) return cachedDocs;
  const out: DocEntry[] = [];
  walk(REPO_ROOT, out);
  out.sort((a, b) => {
    //NOTE(jimmylee): Root AGENTS.md first, then components/, then scripts/, then skills/. The order
    //NOTE(jimmylee): is alphabetic-by-segment-depth which produces a stable, agent-readable index.
    if (a.segments.length !== b.segments.length) {
      return a.segments.length - b.segments.length;
    }
    return a.repoPath.localeCompare(b.repoPath);
  });
  cachedDocs = out;
  return out;
}

export function findDoc(repoPath: string): DocEntry | null {
  const docs = listDocs();
  return docs.find((doc) => doc.repoPath === repoPath) ?? null;
}

export async function readDocBody(doc: DocEntry): Promise<string> {
  return readFile(doc.absolutePath, 'utf8');
}

export function markdownResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': MARKDOWN_CONTENT_TYPE,
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

export async function serveDocByPath(requestedPath: string): Promise<Response> {
  const doc = findDoc(requestedPath);
  if (!doc) return new Response('Not Found', { status: 404 });
  const body = await readDocBody(doc);
  return markdownResponse(body);
}

//NOTE(jimmylee): Group docs into the four sections rendered in llms.txt — repo conventions (root +
//NOTE(jimmylee): components catalog), CLI framework AGENTS files, and the four porting skills. The
//NOTE(jimmylee): grouping is layout-only — every doc in listDocs() must end up in exactly one group.
type LlmsTxtSection = { title: string; entries: { label: string; url: string }[] };

function buildSections(): LlmsTxtSection[] {
  const docs = listDocs();
  const repoConventions: LlmsTxtSection = { title: 'Repo conventions', entries: [] };
  const simulacrum: LlmsTxtSection = { title: 'Simulacrum (CLI framework)', entries: [] };
  const skills: LlmsTxtSection = { title: 'Skills', entries: [] };

  for (const doc of docs) {
    if (doc.repoPath === 'AGENTS.md') {
      repoConventions.entries.push({ label: 'Root AGENTS.md', url: doc.url });
    } else if (doc.repoPath === 'components/AGENTS.md') {
      repoConventions.entries.push({ label: 'Components catalog', url: doc.url });
    } else if (doc.repoPath.startsWith('scripts/cli/')) {
      simulacrum.entries.push({ label: 'CLI framework AGENTS.md (TypeScript)', url: doc.url });
    } else if (doc.repoPath.startsWith('scripts/python/')) {
      simulacrum.entries.push({ label: 'CLI framework AGENTS.md (Python mirror)', url: doc.url });
    } else if (doc.repoPath.startsWith('skills/')) {
      const slug = doc.segments[1] ?? doc.repoPath;
      skills.entries.push({ label: `skills/${slug}`, url: doc.url });
    } else {
      //NOTE(jimmylee): Any AGENTS.md or SKILL.md added in a new directory falls through to the
      //NOTE(jimmylee): repo-conventions section by default so the URL never goes missing.
      repoConventions.entries.push({ label: doc.repoPath, url: doc.url });
    }
  }

  return [repoConventions, simulacrum, skills];
}

export function buildLlmsTxt(): string {
  const sections = buildSections();
  const lines: string[] = [];
  lines.push('# Sacred Computer');
  lines.push('');
  lines.push('> Sacred Computer is a zero-dependency React + CLI framework for building');
  lines.push('> terminal-aesthetic applications. The React surface lives under components/');
  lines.push('> and is cataloged in components/AGENTS.md. The CLI half of sacred — Simulacrum —');
  lines.push('> lives under scripts/cli/ (TypeScript) and scripts/python/ (Python mirror) and');
  lines.push('> renders the same primitives in a terminal alt-screen. Both halves load the same');
  lines.push('> palette from scripts/cli/colors.json so the React UI and the CLI screens stay in');
  lines.push('> byte-level agreement. Pick whichever runtime fits the task you were given —');
  lines.push('> sacred is the React side, Simulacrum is the CLI side, and they are two halves');
  lines.push('> of one framework.');
  lines.push('');
  for (const section of sections) {
    if (section.entries.length === 0) continue;
    lines.push(`## ${section.title}`);
    for (const entry of section.entries) {
      lines.push(`- [${entry.label}](${entry.url})`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export async function buildLlmsFullTxt(): Promise<string> {
  const docs = listDocs();
  const parts: string[] = [];
  parts.push('# Sacred Computer — full doc bundle');
  parts.push('');
  parts.push('> Concatenation of every AGENTS.md and SKILL.md in the sacred repo, in the same');
  parts.push('> order as https://sacred.computer/llms.txt. Sacred Computer (React) and Simulacrum');
  parts.push('> (CLI) are two halves of one framework — the React surface is documented in');
  parts.push('> components/AGENTS.md, the CLI surface in scripts/cli/AGENTS.md and');
  parts.push('> scripts/python/AGENTS.md.');
  parts.push('');
  for (const doc of docs) {
    const body = await readDocBody(doc);
    parts.push('---');
    parts.push('');
    parts.push(`# ${doc.repoPath}`);
    parts.push('');
    parts.push(body);
    parts.push('');
  }
  return parts.join('\n');
}

//NOTE(jimmylee): Test-only escape hatch — clears the cached doc list so a unit test can re-walk the
//NOTE(jimmylee): tree against a different cwd. Production callers should never use this.
export function _resetDocCacheForTests(): void {
  cachedDocs = null;
}
