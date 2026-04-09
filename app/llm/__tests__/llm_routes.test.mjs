import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CACHE_CONTROL,
  LLM_PREFIX,
  MARKDOWN_CONTENT_TYPE,
  SACRED_ORIGIN,
  _resetDocCacheForTests,
  buildLlmsFullTxt,
  buildLlmsTxt,
  findDoc,
  listDocs,
  markdownResponse,
  readDocBody,
  serveDocByPath,
} from '../../_lib/llm-docs.ts';

//NOTE(jimmylee): URL guard for the /llm/* and /llms*.txt routes. Sacred treats the filesystem as
//NOTE(jimmylee): the canonical doc allowlist — every AGENTS.md and SKILL.md the repo ships must be
//NOTE(jimmylee): served by /llm/<repo-relative-path>, listed in /llms.txt, and concatenated into
//NOTE(jimmylee): /llms-full.txt. Adding a new doc without exposing it (or removing one without
//NOTE(jimmylee): pruning the URL set) fails CI inside the same PR.

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');

const SKIP_DIR_NAMES = new Set(['node_modules', '.next', '.git', '.workdir']);
const DOC_FILE_NAMES = new Set(['AGENTS.md', 'SKILL.md']);

function isDirectorySkippable(name) {
  if (SKIP_DIR_NAMES.has(name)) return true;
  if (name.startsWith('.')) return true;
  return false;
}

function walkRepoDocs(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (isDirectorySkippable(entry.name)) continue;
      walkRepoDocs(join(dir, entry.name), out);
      continue;
    }
    if (entry.isFile() && DOC_FILE_NAMES.has(entry.name)) {
      const absolutePath = join(dir, entry.name);
      const relPath = relative(REPO_ROOT, absolutePath).split(sep).join('/');
      out.push(relPath);
    }
  }
}

function listRepoDocsFromDisk() {
  const out = [];
  walkRepoDocs(REPO_ROOT, out);
  return out.sort();
}

describe('app/llm/* and /llms*.txt URL surface', () => {
  _resetDocCacheForTests();
  const onDisk = listRepoDocsFromDisk();
  const docs = listDocs();
  const docPaths = docs.map((d) => d.repoPath).sort();

  it('listDocs() returns every AGENTS.md and SKILL.md in the repo', () => {
    expect(docPaths).toEqual(onDisk);
  });

  it('listDocs() finds the canonical sacred doc set', () => {
    //NOTE(jimmylee): Hard floor — these files must always exist. Catches accidental deletion of
    //NOTE(jimmylee): the catalog or any of the four porting skills.
    const required = [
      'AGENTS.md',
      'components/AGENTS.md',
      'scripts/cli/AGENTS.md',
      'scripts/python/AGENTS.md',
      'skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md',
      'skills/port-sacred-terminal-ui-to-python/SKILL.md',
      'skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md',
      'skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md',
    ];
    for (const path of required) {
      expect(docPaths).toContain(path);
    }
  });

  it('every doc has a sacred.computer URL derived mechanically from its repo path', () => {
    for (const doc of docs) {
      expect(doc.url).toBe(`${SACRED_ORIGIN}${LLM_PREFIX}/${doc.repoPath}`);
    }
  });

  it('serveDocByPath returns byte-identical bodies for every doc', async () => {
    for (const doc of docs) {
      const onDiskBody = readFileSync(doc.absolutePath, 'utf8');
      const helperBody = await readDocBody(doc);
      expect(helperBody).toBe(onDiskBody);

      const res = await serveDocByPath(doc.repoPath);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe(MARKDOWN_CONTENT_TYPE);
      expect(res.headers.get('cache-control')).toBe(CACHE_CONTROL);
      const text = await res.text();
      expect(text).toBe(onDiskBody);
    }
  });

  it('serveDocByPath returns 404 for paths outside the allowlist', async () => {
    const cases = [
      'README.md',
      'package.json',
      'AGENTS',
      'components/AGENTS',
      'foo/bar/AGENTS.md',
      '../etc/passwd',
      'skills/../AGENTS.md',
      '',
    ];
    for (const path of cases) {
      const res = await serveDocByPath(path);
      expect(res.status, `expected 404 for ${path}`).toBe(404);
    }
  });

  it('findDoc returns null for unknown paths and the entry for known paths', () => {
    expect(findDoc('does/not/exist.md')).toBeNull();
    const root = findDoc('AGENTS.md');
    expect(root).not.toBeNull();
    expect(root?.segments).toEqual(['AGENTS.md']);
  });

  it('markdownResponse pins the content-type and cache-control', async () => {
    const res = markdownResponse('hello');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe(MARKDOWN_CONTENT_TYPE);
    expect(res.headers.get('cache-control')).toBe(CACHE_CONTROL);
    expect(await res.text()).toBe('hello');
  });

  it('llms.txt links every doc the routes serve', () => {
    const body = buildLlmsTxt();
    expect(body.startsWith('# Sacred Computer\n')).toBe(true);
    //NOTE(jimmylee): Simulacrum pairing must be named in the description block.
    expect(body).toContain('Simulacrum');
    for (const doc of docs) {
      expect(body, `llms.txt missing link for ${doc.repoPath}`).toContain(doc.url);
    }
    //NOTE(jimmylee): Section headers exist for the three groups buildSections() emits.
    expect(body).toContain('## Repo conventions');
    expect(body).toContain('## Simulacrum (CLI framework)');
    expect(body).toContain('## Skills');
  });

  it('llms-full.txt concatenates every doc body in the same order as listDocs()', async () => {
    const body = await buildLlmsFullTxt();
    expect(body.startsWith('# Sacred Computer — full doc bundle\n')).toBe(true);
    //NOTE(jimmylee): Each doc body must appear verbatim and the per-doc header must be present.
    let cursor = 0;
    for (const doc of docs) {
      const docBody = readFileSync(doc.absolutePath, 'utf8');
      const header = `# ${doc.repoPath}`;
      const headerIdx = body.indexOf(header, cursor);
      expect(headerIdx, `llms-full.txt missing header for ${doc.repoPath}`).toBeGreaterThanOrEqual(0);
      const bodyIdx = body.indexOf(docBody, headerIdx);
      expect(bodyIdx, `llms-full.txt missing body for ${doc.repoPath}`).toBeGreaterThanOrEqual(0);
      cursor = bodyIdx + docBody.length;
    }
  });
});
