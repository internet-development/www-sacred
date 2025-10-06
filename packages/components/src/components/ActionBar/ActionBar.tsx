import styles from "./ActionBar.module.scss";

import * as React from "react";

import { ButtonGroup } from "../ButtonGroup";

interface ActionBarItem {
  hotkey?: string;
  onClick?: () => void;
  openHotkey?: string;
  selected?: boolean;
  body: React.ReactNode;
  items?: any;
}

interface ActionBarProps {
  items: ActionBarItem[];
}

export const ActionBar: React.FC<ActionBarProps> = ({ items }) => {
  return (
    <div className={styles.root}>
      <ButtonGroup items={items} />
    </div>
  );
};
