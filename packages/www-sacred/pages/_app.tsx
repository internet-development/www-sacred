import Providers from '@root/app/Providers';
import '@root/global.scss';

import * as React from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
