import { MetadataRoute } from 'next';

import { listDocs, SACRED_ORIGIN } from './_lib/llm-docs';

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
