'use client';

import * as React from 'react';

import { useModals } from '@components/page/ModalContext';

interface ModalTriggerProps {
  children: React.ReactNode;
  modal: React.ComponentType<any>;
  modalProps?: Record<string, any>;
}

function ModalTrigger({ children, modal, modalProps = {} }: ModalTriggerProps) {
  const { open } = useModals();

  return (
    <span onClick={() => open(modal, modalProps)} style={{ display: 'contents' }}>
      {children}
    </span>
  );
}

export default ModalTrigger;
