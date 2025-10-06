"use client";

import styles from "./ModalStack.module.scss";

import * as React from "react";

import { useModals } from "@srcl/ui/hooks";

interface ModalStackProps {}

export const ModalStack: React.FC<ModalStackProps> = () => {
  const { modalStack } = useModals();

  const totalModals = modalStack.length;

  return (
    <div className={styles.root}>
      {modalStack.map((modalState, index) => {
        const { key, component: ModalComponent, props } = modalState;

        if (!ModalComponent) {
          console.warn(
            `ModalComponent is undefined for modal with key: ${key}`
          );
          return null;
        }

        const offsetFromLast = totalModals - 1 - index;
        const translateY = -offsetFromLast * 40;
        const blur = offsetFromLast * 1.1;

        return (
          <div
            key={key}
            className={styles.item}
            style={{
              zIndex: 10 + index,
              transform: `translateY(${translateY}px)`,
              filter: `blur(${blur}px)`,
            }}
          >
            <ModalComponent {...props} />
          </div>
        );
      })}
    </div>
  );
};
