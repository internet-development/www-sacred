import '@root/global.scss';

import DefaultActionBar from '@components/page/DefaultActionBar';
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
