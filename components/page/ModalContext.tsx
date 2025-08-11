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
    const key = `modal-${Date.now()}-${Math.random()}`;

    const newModal: ModalState<P> = { key, component, props };

    setModalStack((prev) => [...prev, newModal as ModalState<any>]);

    return key;
  };

  const close = (key?: string): void => {
    setModalStack((prev) =>
      key ? prev.filter((modal) => modal.key !== key) : prev.slice(0, -1)
    );
  };

  return (
    <ModalContext.Provider value={{ modalStack, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = (): ModalContextType => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider and use client');
  }
  return context;
};