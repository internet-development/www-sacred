'use client';

import * as React from 'react';

const DebugGrid: React.FC = () => {
  React.useEffect(() => {
    const debugGrid = document.createElement('div');
    let isVisible = false;

    const setGridHeight = () => {
      debugGrid.style.height = `${document.documentElement.scrollHeight}px`;
    };

    Object.assign(debugGrid.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '-1',
      margin: '0',
      backgroundImage: `
        repeating-linear-gradient(var(--theme-border) 0 1px, transparent 1px 100%),
        repeating-linear-gradient(90deg, var(--theme-border) 0 1px, transparent 1px 100%)
      `,
      backgroundSize: '1ch 1.25rem',
      pointerEvents: 'none',
      display: 'none',
    });

    document.body.appendChild(debugGrid);
    setGridHeight();

    const toggleDebugGrid = () => {
      isVisible = !isVisible;
      debugGrid.style.display = isVisible ? 'block' : 'none';
    };

    const handleDebugGridToggle = () => toggleDebugGrid();

    const observer = new ResizeObserver(() => {
      setGridHeight();
    });
    observer.observe(document.documentElement);

    window.addEventListener('debugGridToggle', handleDebugGridToggle);
    window.addEventListener('resize', setGridHeight);

    return () => {
      document.body.removeChild(debugGrid);
      window.removeEventListener('resize', setGridHeight);
      window.removeEventListener('debugGridToggle', handleDebugGridToggle);
      observer.disconnect();
    };
  }, []);

  return null;
};

export const toggleDebugGrid = (): void => {
  window.dispatchEvent(new CustomEvent('debugGridToggle'));
};

export default DebugGrid;
