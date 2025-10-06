import styles from "./Tooltip.module.scss";

import * as React from "react";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ style: propStyle, ...rest }, ref) => {
    const style: React.CSSProperties = { ...propStyle };

    return <div ref={ref} className={styles.root} {...rest} style={style} />;
  }
);

Tooltip.displayName = "Tooltip";
