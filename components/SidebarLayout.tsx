'use client';

import styles from '@components/SidebarLayout.module.scss';
import * as React from 'react';

interface SidebarLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  defaultSidebarWidth?: number;
  isShowingHandle?: boolean;
  isReversed?: boolean;
}

const LINE_HEIGHT = 20;
const CHARACTER_WIDTH = 9.6;

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ defaultSidebarWidth = 20, children, sidebar, isShowingHandle = false, isReversed = false, ...rest }) => {
  const [sidebarWidth, setSidebarWidth] = React.useState(defaultSidebarWidth);
  const handleRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const increment = Math.round(deltaX / CHARACTER_WIDTH);
      setSidebarWidth(Math.max(CHARACTER_WIDTH, startWidth + increment));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  if (isReversed) {
    return (
      <div className={styles.root} {...rest}>
        <div className={styles.content}>{children}</div>
        &nbsp;
        <div
          className={styles.sidebar}
          style={{
            width: `${sidebarWidth}ch`,
          }}
        >
          {sidebar}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root} {...rest}>
      <div
        className={styles.sidebar}
        style={{
          width: `${sidebarWidth}ch`,
        }}
      >
        {sidebar}
      </div>
      {isShowingHandle ? (
        <div className={styles.handle} ref={handleRef} role="button" tabIndex={0} onMouseDown={handleMouseDown} style={isShowingHandle ? {} : { width: `0.5ch` }}>
          <>
            <div className={styles.line} />
            <div className={styles.line} />
          </>
        </div>
      ) : null}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default SidebarLayout;
