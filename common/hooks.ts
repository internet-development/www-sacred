import * as React from 'react';

export function useDebouncedCallback<T>(ms: number, f: (...args: T[]) => void, deps: any[]): (...args: T[]) => void {
  let throttled = false;
  let latestArgs: T | null = null;

  const clearThrottle = () => {
    throttled = false;

    if (latestArgs !== null) {
      f(latestArgs);
      latestArgs = null;
    }
  };

  return React.useCallback(
    (args) => {
      if (throttled) {
        latestArgs = args;
      } else {
        f(args);

        throttled = true;

        setTimeout(clearThrottle, ms);
      }
    },
    [...deps, ms]
  );
}
