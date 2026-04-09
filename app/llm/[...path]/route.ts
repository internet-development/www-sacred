//NOTE(jimmylee): Catch-all route that serves every AGENTS.md and SKILL.md in the repo as raw
//NOTE(jimmylee): markdown. The set of valid URLs is computed at build time from the filesystem via
//NOTE(jimmylee): listDocs() in app/_lib/llm-docs.ts. generateStaticParams enumerates the allowlist,
//NOTE(jimmylee): dynamicParams: false rejects anything else with a 404, and serveDocByPath only ever
//NOTE(jimmylee): reads files that match a known DocEntry — the URL never reaches the filesystem
//NOTE(jimmylee): directly, so there is no path traversal surface.

import { listDocs, serveDocByPath } from '../../_lib/llm-docs';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return listDocs().map((doc) => ({ path: doc.segments }));
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_req: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const requested = path.join('/');
  return serveDocByPath(requested);
}
