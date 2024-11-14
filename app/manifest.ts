import Package from '@root/package.json';

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#000000',
    description: Package.description,
    display: 'standalone',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    name: Package.name,
    short_name: Package.name,
    start_url: '/',
    theme_color: '#000000',
  };
}
