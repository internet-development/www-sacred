//NOTE(jimmylee): https://llmstxt.org/ index. Built from the same file list as /llm/[...path].

import { buildLlmsTxt, markdownResponse } from '../_lib/llm-docs';

export const dynamic = 'force-static';

export function GET(): Response {
  return markdownResponse(buildLlmsTxt());
}
