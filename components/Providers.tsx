'use client';

import * as React from 'react';

import { ModalProvider } from '@components/ModalContext';

export default function Providers({ children }) {
  return <ModalProvider>{children}</ModalProvider>;
}
