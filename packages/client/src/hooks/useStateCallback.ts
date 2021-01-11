import { useCallback, useEffect, useRef, useState } from 'react';

export function useStateCallback(initialState: any) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<Function | null>(null); // mutable ref to store current callback

  const setStateCallback = useCallback((state: any, cb: Function) => {
    cbRef.current = cb; // store passed callback to ref
    setState(state);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (typeof cbRef.current == 'function') {
      cbRef.current?.(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}
