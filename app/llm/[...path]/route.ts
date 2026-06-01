//NOTE(jimmylee): dynamicParams: false means only paths from generateStaticParams are valid.
//NOTE(jimmylee): No user input reaches the filesystem directly.

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
