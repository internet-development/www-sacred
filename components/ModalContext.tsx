import * as React from 'react';

export interface ModalProviderProps {
  children?: React.ReactNode;
}

/** NOTE(@elijaharita): a modal component can either be a regular functional
 * component, or one with a forwarded ref that can be supplied to
 * `React.useImperativeHandle()` to customize properties of the modal that will
 * be used by the modal manager (see `ModalRef`).
 */
export type ModalComponent<P = {}> = React.ComponentType<React.PropsWithoutRef<P & CommonModalProps> & React.RefAttributes<ModalRef>>;

export interface ModalState {
  key: string;
  component: ModalComponent<CommonModalProps>;
  props: object;
}

export interface ModalRef {
  getUnmountDelayMS?: () => number;
}

export interface CommonModalProps {
  isClosing: boolean;
  onClose: () => void;
}

interface ModalContextType {
  modalRefs: React.MutableRefObject<{ [key: string]: ModalRef | undefined }>;
  active: ModalState | null;
  closing: { [key: string]: ModalState };
  open: <P>(component: ModalComponent<P>, props: P) => string;
  close: (key?: string) => void;
}

export const ModalContext = React.createContext<ModalContextType | null>(null);

function newModalState(): ModalState | null {
  return null;
}

/**
 * NOTE(@elijaharita):
 *
 * Provides a context that allows any of its descendants to control modals via
 * `useModal()`. Must be paired with `<GlobalModalManager />` in order for modals to
 * show up.
 *
 * A modal is a popup component that must be dismissed / completed before the
 * user is able to interact with the rest of the application again. Examples of
 * modals include toggleable sidebars, error popups, or dropdown menus.
 *
 * Modals are mutually exclusive. Opening a new modal will cause the previous
 * one to be closed.
 * */
export function ModalProvider({ children }: ModalProviderProps) {
  const [activeModal, setActiveModal] = React.useState(newModalState);
  const [closingModals, setClosingModals] = React.useState<{ [key: string]: ModalState }>({});

  const modalRefs = React.useRef<{ [key: string]: ModalRef | undefined }>({});

  const open = (component, props) => {
    close();

    const key = uniqueModalKey();

    if (component) {
      setActiveModal({
        key,
        component,
        props: props || {},
      });
    }

    return key;
  };

  const close = (key?: string) => {
    if (!activeModal) return;
    if (key && activeModal.key !== key) return;

    setActiveModal(null);
    setClosingModals((prev) => ({ ...prev, [activeModal.key]: activeModal }));

    const ms = modalRefs.current[activeModal.key]?.getUnmountDelayMS?.() ?? 0;
    const callback = () => {
      setClosingModals((prev) => {
        const { [activeModal.key]: _, ...filtered } = prev;
        return filtered;
      });
    };

    if (ms) {
      setTimeout(callback, ms);
    } else {
      callback();
    }
  };

  return <ModalContext.Provider value={{ active: activeModal, closing: closingModals, modalRefs, open, close }}>{children}</ModalContext.Provider>;
}

export interface ModalHandle {
  open: <P>(component: ModalComponent<P>, props?: P) => string;
  close: (key?: string) => void;
  active: ModalState | null;
}

function uniqueModalKey(): string {
  return `modal-${Math.floor(Math.random() * 999999999)}`;
}

export function useModals(): ModalHandle {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('Modal context is absent');
  }

  return { open: context.open, close: context.close, active: context.active };
}
