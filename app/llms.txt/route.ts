//NOTE(jimmylee): https://llmstxt.org/ index for sacred. Lists every AGENTS.md and SKILL.md in the
//NOTE(jimmylee): repo as canonical sacred.computer URLs, grouped into Repo conventions, Simulacrum
//NOTE(jimmylee): (CLI framework), and Skills. The body is built deterministically from listDocs() so
//NOTE(jimmylee): the set of links here is byte-identical to the set of files served by /llm/[...path]
//NOTE(jimmylee): — the vitest URL guard fails CI if anything drifts.

import { buildLlmsTxt, markdownResponse } from '../_lib/llm-docs';

export const dynamic = 'force-static';

export function GET(): Response {
  return markdownResponse(buildLlmsTxt());
}
