import '@root/global.scss';

import DefaultActionBar from '@components/page/DefaultActionBar';
import DebugGrid from '@components/DebugGrid';
import ModalStack from '@components/ModalStack';
import PageConceptTwo from '@components/examples/PageConceptTwo';



// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export default function ConceptTwoPage(props) {
  return (
    <>
      <DebugGrid />
      <DefaultActionBar />
      <ModalStack />
      <PageConceptTwo />
    </>
  );
}
