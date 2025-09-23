import React from 'react';
import { Helmet } from 'react-helmet-async';
import MetaTags from '@/components/MetaTags';import MetaTags from '@/components/MetaTags';
import '@root/global.scss';

import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

import DefaultLayout from '@components/page/DefaultLayout';
import DefaultActionBar from '@components/page/DefaultActionBar';
import Package from '@root/package.json';
import DebugGrid from '@components/DebugGrid';
import ModalStack from '@components/ModalStack';
import PageConceptOne from '@components/examples/PageConceptOne';



// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export default function ConceptOnePage(props) {
  return (
    <>
      <DebugGrid />
      <DefaultActionBar />
      <ModalStack />
      <PageConceptOne />
    </>
  );
}
