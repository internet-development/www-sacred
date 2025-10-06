import styles from "./ActionButton.module.scss";

import * as React from "react";
import * as Utilities from "@srcl/ui/utilities";

interface ActionButtonProps {
  onClick?: () => void;
  hotkey?: any;
  children?: React.ReactNode;
  style?: any;
  rootStyle?: any;
  isSelected?: boolean;
}

export const ActionButton = React.forwardRef<HTMLDivElement, ActionButtonProps>(
  ({ onClick, hotkey, children, style, rootStyle, isSelected }, ref) => {
    return (
      <div
        className={Utilities.classNames(
          styles.root,
          isSelected ? styles.selected : null
        )}
        style={rootStyle}
        onClick={onClick}
        tabIndex={0}
        ref={ref}
        role="button"
      >
        {Utilities.isEmpty(hotkey) ? null : (
          <span className={styles.hotkey}>{hotkey}</span>
        )}
        <span className={styles.content} style={style}>
          {children}
        </span>
      </div>
    );
  }
);

ActionButton.displayName = "ActionButton";
