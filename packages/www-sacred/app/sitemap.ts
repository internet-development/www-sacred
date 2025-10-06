import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sacred.computer',
      lastModified: new Date(),
    },
  ];
}
