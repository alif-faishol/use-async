import { useCallback, useRef, useState } from "react";

type UseApiState<T> = {
  loading: boolean;
  error?: Error;
  data?: T;
};

type UseApiOptions<T> = {
  initialData?: T;
  initialLoadingState?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
};

export type UseApiReturnType<T, U extends unknown[]> = {
  state: UseApiState<T>;
  exec: (...args: U) => Promise<void>;
  setData: (data: T | undefined) => void;
};

const useApi = <T, U extends unknown[]>(
  func: (...args: U) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturnType<T, U> => {
  const {
    initialData,
    initialLoadingState = false,
    onError,
    onSuccess,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    loading: initialLoadingState,
    data: initialData,
  });

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // this is a reference of promise from latest exec() execution
  const validPromise = useRef<Promise<T>>();

  const exec = useCallback(
    async (...args: U) => {
      const currentPromise = func(...args);
      validPromise.current = currentPromise;
      try {
        setState((prevState) => ({
          ...prevState,
          loading: true,
          error: undefined,
        }));
        const data = await currentPromise;
        // Ignores result when validPromise is not currentPromise.
        // Which means this result is not from the latest exec() execution.
        if (validPromise.current !== currentPromise) return;
        setState((prevState) => ({ ...prevState, loading: false, data }));
        if (onSuccessRef.current) onSuccessRef.current(data);
      } catch (error) {
        // Ignores error from invalid promise.
        if (validPromise.current !== currentPromise) return;
        setState((prevState) => ({
          ...prevState,
          loading: false,
          data: undefined,
          error,
        }));
        if (onErrorRef.current) onErrorRef.current(error);
      }
    },
    [func]
  );

  const setData = useCallback((data) => {
    setState((prevState) => ({ ...prevState, data }));
  }, []);

  return {
    state,
    exec,
    setData,
  };
};

export default useApi;
