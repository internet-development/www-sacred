import * as React from 'react';

interface OutsideElementEventProps {
  className?: string;
  children: React.ReactNode;
  onOutsideEvent: (event: MouseEvent | TouchEvent) => void;
  style?: React.CSSProperties;
}

const OutsideElementEvent: React.FC<OutsideElementEventProps> = ({ className, children, onOutsideEvent, style }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleOutsideEvent = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!(event.target instanceof Element)) return;

      if (event.target.hasAttribute('data-detector-ignore')) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideEvent(event);
      }
    },
    [onOutsideEvent]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideEvent);
    document.addEventListener('touchstart', handleOutsideEvent);

    return () => {
      document.removeEventListener('mousedown', handleOutsideEvent);
      document.removeEventListener('touchstart', handleOutsideEvent);
    };
  }, [handleOutsideEvent]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default OutsideElementEvent;
