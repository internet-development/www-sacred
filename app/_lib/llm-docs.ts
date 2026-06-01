//NOTE(jimmylee): Single source of truth for the /llm/* URL surface. The filesystem is the allowlist.
//NOTE(jimmylee): _lib is a Next.js private folder so this file is not a route itself.

import { readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export const SACRED_ORIGIN = 'https://sacred.computer';
export const LLM_PREFIX = '/llm';
export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';
export const PLAINTEXT_CONTENT_TYPE = 'text/plain; charset=utf-8';
export const CACHE_CONTROL = 'public, max-age=300, s-maxage=86400';

export type DocEntry = {
  kind: 'doc' | 'source';
  repoPath: string;
  //NOTE(jimmylee): urlPath differs from repoPath for source files (e.g. Card.tsx -> Card.tsx.txt).
  urlPath: string;
  segments: string[];
  absolutePath: string;
  url: string;
  contentType: string;
};

const REPO_ROOT = process.cwd();
const SKIP_DIR_NAMES = new Set(['node_modules', '.next', '.git', '.workdir']);

const DOC_FILE_NAMES = new Set(['AGENTS.md', 'SKILL.md']);

function isDirectorySkippable(name: string): boolean {
  if (SKIP_DIR_NAMES.has(name)) return true;
  if (name.startsWith('.')) return true;
  return false;
}

function walkDocs(dir: string, out: DocEntry[]) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (isDirectorySkippable(entry.name)) continue;
      walkDocs(join(dir, entry.name), out);
      continue;
    }
    if (entry.isFile() && DOC_FILE_NAMES.has(entry.name)) {
      const absolutePath = join(dir, entry.name);
      const relPath = relative(REPO_ROOT, absolutePath).split(sep).join('/');
      const segments = relPath.split('/');
      out.push({
        kind: 'doc',
        repoPath: relPath,
        urlPath: relPath,
        segments,
        absolutePath,
        url: `${SACRED_ORIGIN}${LLM_PREFIX}/${relPath}`,
        contentType: MARKDOWN_CONTENT_TYPE,
      });
    }
  }
}

function walkComponentSources(out: DocEntry[]) {
  const componentsDir = join(REPO_ROOT, 'components');
  let names: string[];
  try {
    names = readdirSync(componentsDir).filter((n) => {
      return typeof n === 'string' && n.endsWith('.tsx') && statSync(join(componentsDir, n)).isFile();
    }) as string[];
  } catch {
    return;
  }
  for (const name of names) {
    const absolutePath = join(componentsDir, name);
    const repoPath = `components/${name}`;
    const urlPath = `components/${name}.txt`;
    const segments = urlPath.split('/');
    out.push({
      kind: 'source',
      repoPath,
      urlPath,
      segments,
      absolutePath,
      url: `${SACRED_ORIGIN}${LLM_PREFIX}/${urlPath}`,
      contentType: PLAINTEXT_CONTENT_TYPE,
    });
  }
}

let cachedDocs: DocEntry[] | null = null;

export function listDocs(): DocEntry[] {
  if (cachedDocs) return cachedDocs;
  const out: DocEntry[] = [];
  walkDocs(REPO_ROOT, out);
  walkComponentSources(out);
  out.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'doc' ? -1 : 1;
    if (a.segments.length !== b.segments.length) {
      return a.segments.length - b.segments.length;
    }
    return a.repoPath.localeCompare(b.repoPath);
  });
  cachedDocs = out;
  return out;
}

export function findDoc(urlPath: string): DocEntry | null {
  const docs = listDocs();
  return docs.find((doc) => doc.urlPath === urlPath) ?? null;
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
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': doc.contentType,
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

type LlmsTxtSection = { title: string; entries: { label: string; url: string }[] };

function buildSections(): LlmsTxtSection[] {
  const docs = listDocs();
  const repoConventions: LlmsTxtSection = { title: 'Repo conventions', entries: [] };
  const simulacrum: LlmsTxtSection = { title: 'Simulacrum (CLI framework)', entries: [] };
  const skills: LlmsTxtSection = { title: 'Skills', entries: [] };
  const componentSource: LlmsTxtSection = { title: 'Component source', entries: [] };

  for (const doc of docs) {
    if (doc.kind === 'source') {
      const name = doc.repoPath.replace('components/', '');
      componentSource.entries.push({ label: name, url: doc.url });
    } else if (doc.repoPath === 'AGENTS.md') {
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
      repoConventions.entries.push({ label: doc.repoPath, url: doc.url });
    }
  }

  return [repoConventions, simulacrum, skills, componentSource];
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
  const docs = listDocs().filter((d) => d.kind === 'doc');
  const parts: string[] = [];
  parts.push('# Sacred Computer — full doc bundle');
  parts.push('');
  parts.push('> Concatenation of every AGENTS.md and SKILL.md in the sacred repo, in the same');
  parts.push('> order as https://sacred.computer/llms.txt. Sacred Computer (React) and Simulacrum');
  parts.push('> (CLI) are two halves of one framework — the React surface is documented in');
  parts.push('> components/AGENTS.md, the CLI surface in scripts/cli/AGENTS.md and');
  parts.push('> scripts/python/AGENTS.md. Component source is available individually at');
  parts.push('> https://sacred.computer/llm/components/<Name>.tsx.txt but not included in this');
  parts.push('> bundle to keep it focused on contracts.');
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

export function _resetDocCacheForTests(): void {
  cachedDocs = null;
}
