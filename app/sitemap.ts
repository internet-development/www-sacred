import { MetadataRoute } from 'next';

import { listDocs, SACRED_ORIGIN } from './_lib/llm-docs';

//NOTE(jimmylee): Sitemap is built from the same listDocs() helper that drives /llm/[...path],
//NOTE(jimmylee): /llms.txt, and /llms-full.txt — every AGENTS.md and SKILL.md the repo ships ends up
//NOTE(jimmylee): in the sitemap automatically, and the vitest URL guard ensures the doc set never
//NOTE(jimmylee): drifts from the URL set.

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const docEntries: MetadataRoute.Sitemap = listDocs().map((doc) => ({
    url: doc.url,
    lastModified,
  }));

  return [
    { url: SACRED_ORIGIN, lastModified },
    { url: `${SACRED_ORIGIN}/llms.txt`, lastModified },
    { url: `${SACRED_ORIGIN}/llms-full.txt`, lastModified },
    ...docEntries,
  ];
}
