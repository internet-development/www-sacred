"use client";

import * as React from "react";

import { useModals } from "@srcl/ui/hooks";

interface ModalTriggerProps {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  modal: React.ComponentType<any>;
  modalProps?: Record<string, any>;
}

export const ModalTrigger = ({
  children,
  modal,
  modalProps = {},
}: ModalTriggerProps) => {
  const { open } = useModals();

  const onHandleOpenModal = () => {
    open(modal, modalProps);
  };

  return React.cloneElement(children, {
    onClick: onHandleOpenModal,
  });
};
