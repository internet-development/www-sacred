import styles from '@components/Window.module.css';

import * as React from 'react';

//NOTE(jimmylee): React Window component — terminal-window frame for sacred. Mirrors the CLI
//NOTE(jimmylee): framework's window primitive (scripts/cli/lib/window.js): a 2ch horizontal margin,
//NOTE(jimmylee): a 1ch right + 1 row bottom shadow, and a slight off-background fill so the window
//NOTE(jimmylee): reads as "lifted" from the page. The window body uses --theme-window-background and
//NOTE(jimmylee): the drop shadow uses --theme-window-shadow — the shadow is intentionally a step
//NOTE(jimmylee): darker than the body so the lift reads correctly across every theme + tint. Wrap a
//NOTE(jimmylee): CLI port (CLITemplate, InvoiceTemplate, ResultsList) in <Window> to render the same
//NOTE(jimmylee): dialog frame the alt-screen CLI shows.

type WindowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Window: React.FC<WindowProps> = ({ children, ...rest }) => {
  return (
    <section className={styles.window} role="dialog" {...rest}>
      {children}
    </section>
  );
};

export default Window;
