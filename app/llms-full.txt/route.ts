import { buildLlmsFullTxt, markdownResponse } from '../_lib/llm-docs';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const body = await buildLlmsFullTxt();
  return markdownResponse(body);
}
