"use client";

import styles from "./ModalError.module.scss";

import { useHotkeys, useModals } from "@srcl/ui/hooks";

import { ActionButton } from "@srcl/ui/components/ActionButton";
import { CardDouble } from "@srcl/ui/components/CardDouble";

import { Grid } from "@srcl/ui/components/Grid";

interface ModalErrorProps {
  buttonText?: string | any;
  message: string | any;
  title?: string;
}

// TODO(jimmylee)
// Enter doesn't always work for some reason.
export const ModalError = ({ message, buttonText, title }: ModalErrorProps) => {
  const { close } = useModals();

  useHotkeys("enter", () => close());

  return (
    <div className={styles.root}>
      <CardDouble title={title}>
        <br />
        {message}
        <Grid>
          <ul>
            <li>
              Press{" "}
              <ActionButton hotkey="⏎" onClick={() => close()}>
                ENTER
              </ActionButton>{" "}
              to continue.
            </li>
          </ul>
        </Grid>
      </CardDouble>
    </div>
  );
};
