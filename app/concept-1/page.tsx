import '@root/global.scss';

import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

import DefaultLayout from '@components/page/DefaultLayout';
import DefaultActionBar from '@components/page/DefaultActionBar';
import Package from '@root/package.json';
import DebugGrid from '@components/DebugGrid';
import ModalStack from '@components/ModalStack';
import PageConceptOne from '@components/examples/PageConceptOne';

export const dynamic = 'force-static';

// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params, searchParams }) {
  const title = `${Package.name}: Concept I`;
  const description = Package.description;
  const url = 'https://sacred.computer/conept-1';
  const handle = '@internetxstudio';

  return {
    description,
    icons: {
      apple: [{ url: '/apple-touch-icon.png' }, { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      icon: '/favicon-32x32.png',
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      ],
      shortcut: '/favicon-16x16.png',
    },
    metadataBase: new URL('https://sacred.computer/concept-1'),
    openGraph: {
      description,
      images: [
        {
          url: 'https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png',
          width: 1500,
          height: 785,
        },
      ],
      title,
      type: 'website',
      url,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      handle,
      images: ['https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png'],
      title,
      url,
    },
    url,
  };
}

export default async function Page(props) {
  return (
    <>
      <DebugGrid />
      <DefaultActionBar />
      <ModalStack />
      <PageConceptOne />
    </>
  );
}
