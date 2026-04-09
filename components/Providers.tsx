'use client';

import * as React from 'react';

import { HotkeysProvider } from '@modules/hotkeys';
import { ModalProvider } from '@components/page/ModalContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <HotkeysProvider>
      <ModalProvider>{children}</ModalProvider>
    </HotkeysProvider>
  );
};

export default Providers;
