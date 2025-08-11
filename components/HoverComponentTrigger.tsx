'use client';

import styles from '@components/HoverComponentTrigger.module.scss';

import * as React from 'react';
import * as Position from '@common/position';

import OutsideElementEvent from '@components/detectors/OutsideElementEvent';
import Popover from '@components/Popover';
import Tooltip from '@components/Tooltip';

import { createPortal } from 'react-dom';

interface HoverComponentTriggerProps {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  text: string;
  component: 'popover' | 'tooltip';
}

function HoverComponentTrigger({ children, text, component }: HoverComponentTriggerProps) {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Position.Placement>('bottom');
  const [position, setPosition] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const onMouseEnter = () => setOpen(true);
  const onClick = () => setOpen(true);
  const onHandleFocus = () => setOpen(true);
  const onOutsideEvent = () => setOpen(false);

  React.useEffect(() => {
    if (!open || !triggerRef.current || !popoverRef.current) return;

    const updatePosition = () => {
      const { placement, position } = Position.calculate(triggerRef.current!, popoverRef.current!);
      setPlacement(placement);
      setPosition(position);
    };

    updatePosition();

    const handleResizeOrScroll = () => updatePosition();

    const mutationObserver = new MutationObserver(() => updatePosition());
    mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
      mutationObserver.disconnect();
    };
  }, [open]);

  const renderComponent = () => {
    if (component === 'popover') {
      return (
        <Popover
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: `var(--z-index-page-popover)`,
          }}
          role="dialog"
          aria-modal="true"
        >
          {text}
        </Popover>
      );
    } else if (component === 'tooltip') {
      return (
        <Tooltip
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: `var(--z-index-page-tooltip)`,
          }}
        >
          {text}
        </Tooltip>
      );
    }
    return null;
  };

  const popoverElement = open ? createPortal(<OutsideElementEvent onOutsideEvent={onOutsideEvent}>{renderComponent()}</OutsideElementEvent>, document.body) : null;

  return (
    <div ref={triggerRef} className={styles.root} data-detector-ignore onMouseEnter={onMouseEnter} onClick={onClick} onFocus={onHandleFocus}>
      {React.cloneElement(children, {
        tabIndex: 0,
      })}
      {popoverElement}
    </div>
  );
}

export default HoverComponentTrigger;
