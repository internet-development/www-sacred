'use client';

import * as React from 'react';

export type ModalComponent<P = {}> = React.ComponentType<React.PropsWithoutRef<P>>;

export interface ModalState<P = any> {
  key: string;
  component: ModalComponent<P>;
  props: P;
}

interface ModalContextType {
  modalStack: ModalState[];
  open: <P>(component: ModalComponent<P>, props: P) => string;
  close: (key?: string) => void;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = React.useState<ModalState<any>[]>([]);

  const open = <P,>(component: ModalComponent<P>, props: P): string => {
    if (!component) {
      console.warn('Modal component is required - modal will not open');
      return '';
    }
    
    if (typeof component !== 'function' && typeof component !== 'object') {
      console.warn('Modal component must be a valid React component - modal will not open');
      return '';
    }

    const key = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const newModal: ModalState<P> = { key, component, props };

    setModalStack((prev) => [...prev, newModal as ModalState<any>]);

    return key;
  };

  const close = (key?: string): void => {
    setModalStack((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      
      if (key) {
        if (typeof key !== 'string') {
          console.warn('Modal key must be a string');
          return prev;
        }
        return prev.filter((modal) => modal.key !== key);
      }
      
      return prev.slice(0, -1);
    });
  };

  return <ModalContext.Provider value={{ modalStack, open, close }}>{children}</ModalContext.Provider>;
};

export const useModals = (): ModalContextType => {
  const context = React.useContext(ModalContext);
  if (!context) {
    console.warn('useModals must be used within a ModalProvider');
    return {
      modalStack: [],
      open: () => {
        console.warn('Modal open called outside of ModalProvider - modal will not open');
        return '';
      },
      close: () => {
        console.warn('Modal close called outside of ModalProvider - modal will not close');
      }
    };
  }
  return context;
};
