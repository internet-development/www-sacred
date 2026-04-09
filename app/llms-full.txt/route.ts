//NOTE(jimmylee): Concatenation of every AGENTS.md and SKILL.md body in the repo, in the same order
//NOTE(jimmylee): as /llms.txt. Agents that want the full sacred docset in one fetch use this URL —
//NOTE(jimmylee): every section is delimited by `---` plus the repo-relative path so a downstream
//NOTE(jimmylee): tokenizer can split the bundle back into the same files served by /llm/[...path].

import { buildLlmsFullTxt, markdownResponse } from '../_lib/llm-docs';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const body = await buildLlmsFullTxt();
  return markdownResponse(body);
}
